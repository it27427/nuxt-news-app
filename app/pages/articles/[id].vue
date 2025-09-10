<template>
  <div class="jonopath-container">
    <h1>Article Details {{ id }} Page</h1>
  </div>
</template>

<script setup lang="ts">
  const { id } = useRoute().params;

  definePageMeta({ auth: false });
</script>

/** /topics/articles/${news._id} */
