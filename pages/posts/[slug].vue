<script setup lang="ts">
import { format } from "date-fns";

const { slug } = useRoute().params;
const { data: post, error } = await useFetch(`/api/posts/${slug}`, {
  query: {
    include: "user",
  },
});

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    statusMessage: error.value.statusMessage,
  });
}

useSeoMeta({
  title: () => `${post.value?.title} | Dev Blog`,
  description: () => `${post.value?.excerpt}`,
  ogTitle: () => `${post.value?.title} | Dev Blog`,
  ogDescription: () => `${post.value?.excerpt}`,
});
</script>

<template>
  <div class="container my-12 flex max-w-screen-md flex-col">
    <NuxtLink
      class="mb-6 flex items-center gap-1 text-blue-500 hover:underline"
      :to="{ name: 'posts' }"
    >
      <Icon
        name="material-symbols:arrow-left-alt-rounded"
        width="1rem"
        height="1rem"
      />
      <span class="text-sm">Back</span>
    </NuxtLink>
    <div class="mb-8 flex items-center gap-4">
      <NuxtImg
        :src="post?.user.avatar"
        preset="avatar-md"
        format="webp"
        loading="lazy"
        class="rounded-full shadow"
      />
      <div class="flex flex-col">
        <p class="font-bold">
          {{ post?.user.firstName }} {{ post?.user.lastName }}
        </p>
        <p v-if="post?.publishedAt" class="text-sm font-light text-gray-600">
          {{ format(new Date(post?.publishedAt), "MMM do, yyyy") }}
        </p>
      </div>
    </div>
    <h1 class="mb-6 text-3xl font-bold">{{ post?.title }}</h1>
    <NuxtImg
      :src="post?.image"
      format="webp"
      loading="lazy"
      class="mb-8 rounded-md shadow"
    />
    <div class="prose" v-html="post?.content"></div>
  </div>
</template>
