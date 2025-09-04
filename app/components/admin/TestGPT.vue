<template>
  <div>
    <h2>Telegram Summary (via GPT-4)</h2>
    <p>{{ data?.summary }}</p>

    <h3>Raw Messages</h3>
    <ul>
      <li v-for="m in data?.raw" :key="m">{{ m }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  type TelegramGPTResponse = {
    raw: string[];
    summary: string | null;
  };

  const { data } = await useFetch<TelegramGPTResponse>('/api/telegram-gpt');
</script>
