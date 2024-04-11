<script setup lang="ts">
import { formatDistance } from "date-fns";

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
const { data: posts, error } = await useAsyncData(async () => {
  return await getPosts();
});

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
        <div class="flex flex-col rounded-md border px-4 py-6 shadow-md">
          <div class="mb-4 flex items-center gap-2 text-xs text-gray-600">
            <div class="flex items-center gap-1">
              <Icon
                name="material-symbols:article-outline"
                width=".8rem"
                height=".8rem"
              />
              <span>Article</span>
            </div>
            <span v-if="post.publishedAt" class="ml-auto">
              {{
                formatDistance(post.publishedAt, new Date(), {
                  addSuffix: true,
                })
              }}
            </span>
          </div>
          <NuxtImg
            ref="blogImage"
            v-if="post.image"
            :src="post.image"
            format="webp"
            loading="lazy"
            sizes="sm:50vw"
            class="mb-3 rounded-md object-cover"
          />
          <h2 class="mb-2 text-xl font-bold">{{ post.title }}</h2>
          <p class="mb-4 text-sm font-light text-gray-600">
            {{ post.excerpt }}
          </p>
          <div class="flex items-center gap-2 text-sm">
            <div class="flex items-center gap-3">
              <NuxtImg
                v-if="post.user?.avatar"
                :src="post.user?.avatar"
                preset="avatar-sm"
                format="webp"
                loading="lazy"
                class="rounded-full"
              />
              <span>{{ post.user?.firstName }} {{ post.user?.lastName }}</span>
            </div>
            <NuxtLink
              class="ml-auto flex items-center gap-2 text-blue-500 hover:underline"
              :to="{ name: 'posts-slug', params: { slug: post.id } }"
            >
              <span>Read More</span>
              <Icon
                name="material-symbols:arrow-right-alt-rounded"
                width="1rem"
                height="1rem"
              />
            </NuxtLink>
          </div>
        </div>
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
