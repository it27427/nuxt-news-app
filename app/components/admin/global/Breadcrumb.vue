<template>
  <div
    :class="[
      'bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-6',
      props.className,
    ]"
  >
    <div
      class="flex items-center justify-between gap-2 lg:justify-start lg:gap-0"
    >
      <!-- Slot for other content -->
      <div>
        <slot />
      </div>

      <nav class="flex items-center gap-2">
        <!-- Home link -->
        <BaseLink
          to="/admin/dashboard"
          class="text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark font-bold font-tino flex items-center gap-1 transition-colors duration-400"
        >
          <client-only>
            <Icon name="mi:home" width="24" height="24" class="text-3xl" />
          </client-only>
        </BaseLink>

        <!-- Separator -->
        <client-only>
          <Icon
            name="guidance:left-arrow"
            width="28"
            height="28"
            class="inline-block mt-1"
          />
        </client-only>

        <!-- Current page -->
        <span
          class="text-gray-700 dark:text-light font-baloda font-medium inline-block mt-1"
        >
          {{ currentLabel }}
        </span>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
  import BaseLink from '@/components/base/BaseLink.vue';
  import { adminMenus } from '@/menus/adminMenus';
  import { toBanglaNumber } from '@/utils/number';
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  const props = defineProps<{
    className?: string;
  }>();

  const route = useRoute();

  const currentLabel = computed(() => {
    if (route.path === '/admin/dashboard') {
      return 'ড্যাসবোর্ডে স্বাগতম 🎉';
    }

    const menu = adminMenus.find((m) => m.to === route.path);

    if (menu) {
      return menu.label;
    }

    // Check Dynamic Edit Routes
    const dynamicMatch = route.path.match(/^\/admin\/(\w+)\/(\d+)\/edit$/);

    if (dynamicMatch) {
      const resource = dynamicMatch[1]!;
      const id = dynamicMatch[2]!;

      let label = '';

      if (resource === 'tags') {
        label = `🏷️ ট্যাগ সম্পাদনা ← 🆔${toBanglaNumber(id)}`;
      } else if (resource === 'news') {
        label = `📰 সংবাদ সম্পাদনা ← 🆔{toBanglaNumber(id)}`;
      } else if (resource === 'users') {
        label = `🧑‍💻 ব্যবহারকারী সম্পাদনা ← 🆔{toBanglaNumber(id)}`;
      } else {
        const capitalizedResource =
          resource.charAt(0).toUpperCase() + resource.slice(1);
        label = `${capitalizedResource} সম্পাদনা ← 🆔${toBanglaNumber(id)}`;
      }

      return label;
    }

    return '👻 অজানা পাতা';
  });
</script>

<style lang="scss" scoped>
  div {
    backdrop-filter: blur(0.375rem);
  }
</style>
