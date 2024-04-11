<script setup>
const props = defineProps({
  error: {
    type: Object,
  },
});

const handleError = () => clearError({ redirect: "/posts" });
</script>

<template>
  <section
    class="font-Rubik flex min-h-screen flex-col items-center justify-center px-6 py-10"
  >
    <h1 class="mb-4 text-9xl font-bold">
      {{ error.statusCode }}
    </h1>
    <p class="mb-4 text-3xl font-bold">{{ error.message }}</p>
    <p class="mb-8 text-xl text-gray-600">
      Sorry, we can't find that page. You'll find lot to explore on the home
      page.
    </p>
    <button class="rounded-md bg-blue-500 p-4 text-white" @click="handleError">
      Back to Homepage
    </button>
  </section>
</template>
