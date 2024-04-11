<script setup lang="ts">
const setup = ref(false);
const checked = ref(false);

const { data: dbStatus } = await useFetch("/api/db/check-setup", {});
if (dbStatus.value?.isSetup) setup.value = true;
checked.value = true;

const loading = ref();
async function setupDb() {
  try {
    loading.value = true;
    await $fetch("/api/db/migrate");
    await $fetch("/api/db/seed");
    setup.value = true;
  } catch (e) {
    alert("Error setting up database");
  }
  loading.value = false;
}
</script>
<template>
  <div class="flex h-screen items-center justify-center">
    <div class="flex max-w-[700px] flex-col gap-8" v-if="!setup">
      <h1 class="text-4xl font-bold">👋 Welcome to the Test!</h1>
      <div>
        <p class="mb-2">
          This is a test to see how you handle a real-world task. You will be
          building a simple blog by fetching data from a pre-built REST API.
        </p>
        <p class="mb-2">
          You will be given a set of tasks to complete. Details can be found in
          the project
          <strong class="font-mono text-xs text-red-600">README.md</strong>.
        </p>
        <p class="mb-2">
          The first step is to setup the database with the button below.
        </p>
      </div>
      <div>
        <button class="rounded bg-blue-600 p-3 text-white" @click="setupDb">
          {{ loading ? "Setting up Database..." : "Setup Database" }}
        </button>
      </div>
    </div>

    <div v-else class="flex flex-col gap-8 text-center">
      <h1 class="text-4xl font-bold">🎉 You're all set up!</h1>
      <div>
        <NuxtLink to="/posts" class="rounded bg-blue-600 p-3 text-white">
          Go to Task #1
        </NuxtLink>

        <a
          href="#"
          class="ml-4 inline-block text-sm text-gray-500 underline"
          @click.prevent="setupDb"
        >
          {{ loading ? "Setting up Database..." : "(or Setup Database Again)" }}
        </a>
      </div>
    </div>
  </div>
  <!-- <div>
      <h1 class="text-2xl">Display The Paginated Posts Here</h1>
      <ul class="list-disc list-inside ml-10">
        <li>Keep performance in mind</li>
        <li>Make sure to display optimized images</li>
        <li>Paginate according to your desired strategy</li>
        <li>Provide a sort order control</li>
        <li>Store the sort order in the URL</li>
        <li>Make it look good 💪</li>
        <li>
          Then
          <NuxtLink class="text-blue-500 underline" to="/posts/hello">
            go to the next task (displaying the individual post)</NuxtLink
          >
        </li>
      </ul>
    </div> -->

  <!-- <div class="flex h-screen items-center justify-center">
    <div>
      <h1 class="text-2xl">Display the Individual Post Here</h1>
      <ul class="ml-10 list-inside list-disc">
        <li>Keep seo in mind</li>
        <li>Make sure to display optimized images</li>
        <li>Make it look good 💪</li>
      </ul>
    </div>
  </div> -->
</template>
