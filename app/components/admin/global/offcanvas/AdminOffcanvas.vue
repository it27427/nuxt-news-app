<template>
  <div>
    <!-- Open button -->
    <OpenButton @open="open" />

    <!-- Offcanvas -->
    <AdminOffcanvasSidebar
      :is-open="isOpen"
      :is-collapsed="isCollapsed"
      @close="close"
    >
      <!-- Header -->
      <header
        class="flex flex-col items-center justify-center gap-2 p-4 border-b border-gray-200 dark:border-slate-800 relative"
        :class="[isCollapsed ? 'h-dash-head-xl' : 'h-dash-head-sm']"
      >
        <div
          class="flex items-center justify-end w-full absolute z-10 top-0 -right-11"
        >
          <CloseButton @close="close" />
        </div>

        <!-- Collapse Button -->
        <div
          class="flex items-center justify-center rounded-full absolute top-full"
          :class="[
            isCollapsed ? 'w-10 h-10 -mt-5 -right-5' : 'w-8 h-8 -mt-4 -right-4',
          ]"
        >
          <CollapseButton :open="isCollapsed" @toggle="toggleCollapse" />
        </div>

        <!-- User Initial -->
        <div
          class="flex items-center justify-center font-hind font-bold rounded-full bg-dark-surface dark:bg-slate-800 text-light uppercase"
          :class="[isCollapsed ? 'w-20 h-20 text-5xl' : 'w-12 h-12 text-3xl']"
        >
          {{ props.user?.name?.charAt(0).toUpperCase() }}
        </div>

        <!-- User Info -->
        <ul
          v-if="isCollapsed"
          class="flex flex-col items-center justify-center"
        >
          <li
            class="text-2xl uppercase font-bold font-hind text-black dark:text-gray-200"
          >
            {{ props.user?.name }}
          </li>
          <li class="text-md font-hind text-dark-surface dark:text-gray-200">
            {{ props.user?.email }}
          </li>
        </ul>
      </header>

      <!-- Body -->
      <div
        class="p-4 overflow-y-auto scrollbar-none"
        :class="[
          isCollapsed ? 'max-h-screen-minus-xl' : 'max-h-screen-minus-sm',
        ]"
      >
        <AdminMenu :menus="props.menus" :open="isCollapsed" />
      </div>
    </AdminOffcanvasSidebar>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import AdminMenu from '~/components/admin/global/AdminMenu.vue';
  import CollapseButton from '~/components/admin/global/CollapseButton.vue';
  import AdminOffcanvasSidebar from '~/components/admin/global/offcanvas/AdminOffcanvasSidebar.vue';
  import CloseButton from '~/components/admin/global/offcanvas/CloseButton.vue';
  import OpenButton from '~/components/admin/global/offcanvas/OpenButton.vue';
  import type { AdminMenuType as MenuProps, UserType } from '~~/types/admin';

  const props = defineProps<{
    menus: MenuProps[];
    user: UserType | null;
  }>();

  const isOpen = ref(false);
  const isCollapsed = ref(true);

  const open = () => (isOpen.value = true);
  const close = () => (isOpen.value = false);

  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value;
  };
</script>
