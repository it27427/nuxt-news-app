<template>
  <client-only>
    <ul v-if="filteredMenus.length > 0" class="flex flex-col gap-2">
      <li v-for="item in filteredMenus" :key="item.to || item.action">
        <button
          v-if="item.action === 'logout'"
          @click="logout"
          class="menu-link"
          :class="[open ? 'justify-start' : 'justify-center border-b-0']"
        >
          <Icon :name="item.icon" width="32" height="32" class="text-sizeXXl" />
          <span v-if="open">{{ item.label }}</span>
        </button>

        <NuxtLink
          v-else
          :to="item.to"
          class="menu-link"
          :class="[
            open ? 'justify-start' : 'justify-center border-b-0',
            route.path === item.to
              ? 'bg-gray-200 dark:bg-slate-800 rounded-md font-bold'
              : '',
          ]"
        >
          <Icon :name="item.icon" width="32" height="32" class="text-sizeXXl" />
          <span v-if="open">{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </client-only>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAuth } from '~/composables/useAuth';
  import type { AdminMenuType as MenuProps } from '~~/types/admin';

  const props = defineProps<{
    menus: MenuProps[];
    open: boolean;
  }>();

  const route = useRoute();
  const { logout, user } = useAuth();

  const filteredMenus = computed(() =>
    props.menus.filter(
      (item) => user.value?.role && item.roles.includes(user.value.role)
    )
  );
</script>

<style lang="scss" scoped>
  .menu-link {
    @apply w-full flex items-center gap-2 p-2 border-b border-gray-200 
    dark:border-gray-700 font-hind text-base text-dark-surface dark:text-light 
    transition-all hover:rounded-md hover:bg-gray-200 hover:border-b-gray-200 
    dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white;
  }
</style>
