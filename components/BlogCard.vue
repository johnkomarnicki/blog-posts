<script setup lang="ts">
import { formatDistance } from "date-fns";
import { type PostWithUser } from "../types/index";

interface Props {
  post: PostWithUser;
}

defineProps<Props>();
</script>

<template>
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

<style scoped></style>
