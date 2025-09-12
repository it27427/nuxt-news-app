<template>
  <div>
    <h2>Latest Telegram Messages</h2>

    <!-- <ul>
      <li v-for="msg in data" :key="msg.id">
        <p>
          <strong>{{ msg.text }}</strong>
        </p>
        <small>{{ msg.date }}</small>
        <span v-if="msg.views">👁 {{ msg.views }}</span>
        <div v-if="msg.media">
          <a :href="msg.media" target="_blank">Download Media</a>
        </div>
      </li>
    </ul> -->
  </div>
</template>

<script setup lang="ts">
  type TelegramMessage = {
    id: number;
    date: string;
    text: string;
    views: number | null;
    media: string | null;
  };

  // const { data, error, pending } =
  //   await useFetch<TelegramMessage[]>('/api/telegram');
</script>
