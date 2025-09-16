<template>
  <ul class="flex flex-col gap-2">
    <li v-for="item in filteredMenus" :key="item.to || item.action">
      <!-- Logout Button -->
      <button
        v-if="item.action === 'logout'"
        @click="logout"
        class="menu-link"
        :class="[open ? 'justify-start' : 'justify-center border-b-0']"
      >
        <Icon :name="item.icon" width="32" height="32" class="text-sizeXXl" />
        <span v-show="open">{{ item.label }}</span>
      </button>

      <!-- Normal Links -->
      <NuxtLink
        v-else
        :to="item.to"
        class="menu-link"
        :class="[
          open ? 'justify-start' : 'justify-center border-b-0',
          route.path === item.to
            ? 'bg-gray-200 dark:bg-slate-800 rounded-md'
            : '',
        ]"
      >
        <Icon :name="item.icon" width="32" height="32" class="text-sizeXXl" />
        <span v-show="open">{{ item.label }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { useCustomAuth } from '@/composables/useCustomAuth';
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  const props = defineProps<{
    menus: Array<{
      label: string;
      to: string;
      icon: string;
      action: string;
      roles: string[];
    }>;
    open: boolean;
  }>();
  const route = useRoute();
  const { logout, user } = useCustomAuth();

  const filteredMenus = computed(() =>
    props.menus.filter(
      (item) => user.value && item.roles.includes(user.value.role)
    )
  );
</script>

<style scoped>
  .menu-link {
    @apply w-full flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base text-dark-surface dark:text-light transition-all hover:rounded-md hover:bg-gray-200 hover:border-b-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white;
  }
</style>
