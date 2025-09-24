<template>
  <aside
    class="bg-light text-dark dark:bg-gray-900 dark:text-white flex-col transition-all duration-300"
    :class="[props.open ? 'w-64' : 'w-20']"
  >
    <header
      class="flex flex-col items-center justify-center gap-2 p-4 border-b border-gray-200 dark:border-slate-800 relative"
      :class="[open ? 'h-dash-head-xl' : 'h-dash-head-sm']"
    >
      <div
        class="flex items-center justify-center rounded-full absolute top-full"
        :class="[open ? 'w-10 h-10 -mt-5 -right-5' : 'w-8 h-8 -mt-4 -right-4']"
      >
        <CollapseButton :open="props.open" @toggle="toggleSidebar" />
      </div>

      <div
        class="flex items-center justify-center font-hind font-bold rounded-full bg-dark-surface dark:bg-slate-800 text-light uppercase"
        :class="[props.open ? 'w-20 h-20 text-5xl' : 'w-12 h-12 text-3xl']"
      >
        {{ props.user?.name?.charAt(0).toUpperCase() }}
      </div>

      <ul v-show="props.open" class="flex flex-col items-center justify-center">
        <li
          class="text-2xl uppercase font-bold font-hind text-black dark:text-gray-200 transition-opacity duration-300"
        >
          {{ props.user?.name }}
        </li>
        <li
          class="text-md font-hind text-dark-surface dark:text-gray-200 transition-opacity duration-300"
        >
          {{ props.user?.email }}
        </li>
      </ul>
    </header>

    <!-- DESKTOP-ADMIN-MENU -->
    <nav
      class="flex flex-col gap-2 p-2 overflow-y-auto scrollbar-none"
      :class="[props.open ? 'max-h-screen-minus-xl' : 'max-h-screen-minus-sm']"
    >
      <!-- ADMIN-MENU -->
      <AdminMenu :menus="props.menus" :open="props.open" />
    </nav>
  </aside>
</template>

<script setup lang="ts">
  import AdminMenu from '~/components/admin/global/AdminMenu.vue';
  import CollapseButton from '~/components/admin/global/CollapseButton.vue';
  import type { AdminMenuType as MenuProps, UserType } from '~~/types/admin';

  const props = defineProps<{
    open: boolean;
    menus: MenuProps[];
    user: UserType | null;
  }>();

  const emit = defineEmits<{ (e: 'toggle'): void }>();

  const toggleSidebar = () => emit('toggle');
</script>
