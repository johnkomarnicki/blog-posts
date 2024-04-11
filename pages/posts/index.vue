<script setup lang="ts">
import { type PostWithUser } from "@/types";

const router = useRouter();
const route = useRoute();

const orderBy = ref(route.query.order || "oldestFirst");
const limit = ref(10);
const offset = ref(0);
async function getPosts() {
  const res = await $fetch("/api/posts", {
    query: {
      include: "user",
      order: orderBy.value,
      limit: limit.value,
      offset: offset.value,
    },
  });
  // increment offset for infinite pagination
  offset.value += limit.value;
  return res;
}

async function updatePostOrder(event: Event) {
  const target = event.target as HTMLInputElement;
  orderBy.value = target.checked ? "newestFirst" : "oldestFirst";
  router.push({ query: { order: orderBy.value } });
  offset.value = 0;
  posts.value = await getPosts();
}

const timer = ref<ReturnType<typeof setTimeout>>();
const triggerEl = ref<HTMLDivElement | null>(null);
const fetchingData = ref(false);
function loadPaginatedData() {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        fetchingData.value = true;
        clearTimeout(timer.value);
        timer.value = setTimeout(async () => {
          const res = await getPosts();
          if (posts.value) posts.value = posts.value?.concat(res);
        }, 500);
      }
    },
    { threshold: 1 },
  );

  if (triggerEl.value) observer.observe(triggerEl.value);
}

onMounted(() => {
  loadPaginatedData();
});

// Fetch data
const { data: posts, error } = await useAsyncData(
  "blog-posts",
  async (): Promise<PostWithUser[]> => {
    return await getPosts();
  },
  {
    transform: (posts) => {
      return posts.map((post) => ({
        id: post.id,
        image: post.image,
        publishedAt: post.publishedAt,
        title: post.title,
        excerpt: post.excerpt,
        user: post.user,
      }));
    },
  },
);

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    statusMessage: error.value.statusMessage,
  });
}

useSeoMeta({
  title: "Posts | Dev Blog",
  description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
  ogTitle: "Posts | Dev Blog",
  ogDescription: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
});
</script>

<template>
  <div class="container my-12 flex max-w-screen-lg flex-col">
    <h1 class="mb-2 text-center text-3xl font-bold">Our Blog</h1>
    <p class="mb-10 text-balance text-center font-light text-gray-600">
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam sequi
      fuga ut quasi dolorem dignissimos esse corrupti aspernatur quae quia.
    </p>
    <div class="mb-4 flex gap-1 self-end text-xs">
      <input
        @change="updatePostOrder"
        :checked="orderBy === 'newestFirst'"
        type="checkbox"
      />
      <span>Newest to oldest</span>
    </div>
    <div class="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2">
      <template v-for="post in posts">
        <BlogCard :post="post" />
      </template>
    </div>
    <div class="flex flex-col items-center self-center">
      <div ref="triggerEl"></div>
      <Icon
        v-if="fetchingData"
        name="line-md:loading-alt-loop"
        width="50"
        height="50"
      />
    </div>
  </div>
</template>
