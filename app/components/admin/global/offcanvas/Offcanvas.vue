<template>
  <div>
    <!-- Open button -->
    <OpenButton @open="open" />

    <!-- Offcanvas -->
    <OffcanvasSidebar :is-open="isOpen" :close="close">
      <header class="p-4">
        <CloseButton @close="close" />
      </header>

      <OffcanvasBody class="p-4">
        <!-- ADMIN-MENU -->
        <AdminMenu :menus="props.menus" :open="true" />
      </OffcanvasBody>
    </OffcanvasSidebar>
  </div>
</template>

<script setup lang="ts">
  import AdminMenu from '@/components/admin/global/AdminMenu.vue';
  import CloseButton from '@/components/admin/global/offcanvas/CloseButton.vue';
  import OffcanvasBody from '@/components/admin/global/offcanvas/OffcanvasBody.vue';
  import OffcanvasSidebar from '@/components/admin/global/offcanvas/OffcanvasSidebar.vue';
  import OpenButton from '@/components/admin/global/offcanvas/OpenButton.vue';
  import { ref } from 'vue';

  const props = defineProps<{
    menus: Array<{
      label: string;
      to: string;
      icon: string;
      action: string;
      roles: string[];
    }>;
  }>();

  const isOpen = ref(false);

  // Functions
  const open = () => (isOpen.value = true);
  const close = () => (isOpen.value = false);
</script>
