<template>
  <div>
    <!-- Open button -->
    <OpenButton @open="open" />

    <!-- Offcanvas -->
    <OffcanvasSidebar :is-open="isOpen" @close="close">
      <!-- Dynamic Header -->
      <Header
        class="flex flex-col items-center justify-center gap-2 p-4 border-b border-gray-200 dark:border-slate-800 relative"
      >
        <CloseButton @close="close" />

        <!-- Collapse Button -->
        <div
          class="flex items-center justify-center rounded-full absolute top-full -mt-5 right-4"
        >
          <CollapseButton :open="true" @toggle="$emit('toggle')" />
        </div>

        <!-- User Initial Circle -->
        <div
          class="flex items-center justify-center font-hind font-bold rounded-full bg-dark-surface dark:bg-slate-800 text-light uppercase w-20 h-20 text-5xl"
        >
          I
        </div>

        <!-- User Info -->
        <ul class="flex flex-col items-center justify-center mt-2">
          <li
            class="text-2xl uppercase font-bold font-hind text-black dark:text-gray-200"
          >
            Istiak Tushar
          </li>
          <li class="text-md font-hind text-dark-surface dark:text-gray-200">
            istiak.tushar@gmail.com
          </li>
        </ul>
      </Header>

      <!-- Offcanvas Body -->
      <OffcanvasBody class="p-4">
        <AdminMenu :menus="props.menus" :open="true" />
      </OffcanvasBody>
    </OffcanvasSidebar>
  </div>
</template>

<script setup lang="ts">
  import AdminMenu from '@/components/admin/global/AdminMenu.vue';
  import CollapseButton from '@/components/admin/global/CollapseButton.vue';
  import CloseButton from '@/components/admin/global/offcanvas/CloseButton.vue';
  import OffcanvasBody from '@/components/admin/global/offcanvas/OffcanvasBody.vue';
  import OffcanvasSidebar from '@/components/admin/global/offcanvas/OffcanvasSidebar.vue';
  import OpenButton from '@/components/admin/global/offcanvas/OpenButton.vue';
  import Header from '@/components/global/layouts/Header.vue';
  import type { MenuProps } from '@/utils/adminPropTypes';
  import { ref } from 'vue';

  const props = defineProps<{
    menus: MenuProps[];
  }>();

  const emit = defineEmits<{
    (e: 'toggle'): void;
  }>();

  const isOpen = ref(false);
  const open = () => (isOpen.value = true);
  const close = () => (isOpen.value = false);
</script>
