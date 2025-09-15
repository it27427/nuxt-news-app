<!-- components/admin/Sidebar.vue -->
<template>
  <aside
    :class="[
      open ? 'w-64' : 'w-20',
      'bg-light text-dark dark:bg-gray-900 dark:text-white min-h-screen fixed top-20 left-0 transition-all duration-300 hidden lg:flex flex-col',
    ]"
  >
    <!-- Sidebar Header -->
    <Header
      :class="[
        open ? 'h-dash-head-xl' : 'h-dash-head-sm',
        'flex flex-col items-center justify-center gap-2 p-4 border-b border-gray-200 dark:border-slate-800',
      ]"
    >
      <!-- User Initial -->
      <div
        :class="[
          open ? 'w-20 h-20 text-5xl' : 'w-12 h-12 text-3xl',
          'flex items-center justify-center font-hind font-bold rounded-full bg-dark-surface dark:bg-slate-800 text-light uppercase',
        ]"
      >
        I
      </div>

      <!-- User-Info -->
      <ul v-show="open" class="flex flex-col items-center justify-center">
        <li
          class="text-2xl uppercase font-bold font-hind text-black dark:text-gray-200 transition-opacity duration-300"
        >
          Istiak Tushar
        </li>
        <li
          class="text-md font-hind text-dark-surface dark:text-gray-200 transition-opacity duration-300"
        >
          istiak.tushar@gmail.com
        </li>
      </ul>
    </Header>

    <!-- Sidebar Body -->
    <nav class="flex-1 p-2">
      <ul class="flex flex-col gap-2">
        <li>
          <BaseLink
            to="/admin/dashboard"
            :class="[
              open ? 'justify-start' : 'justify-center border-b-0',
              'flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all',
            ]"
          >
            <Icon
              name="streamline-freehand:dashboard-browser-gauge"
              width="32"
              height="32"
              class="text-sizeXXl"
            />
            <span v-show="open">ড্যাশবোর্ড</span>
          </BaseLink>
        </li>

        <li>
          <BaseLink
            to="/admin/create-news"
            :class="[
              open ? 'justify-start' : 'justify-center border-b-0',
              'flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all',
            ]"
          >
            <Icon
              name="basil:edit-outline"
              width="32"
              height="32"
              class="text-sizeXXl"
            />
            <span v-show="open">সংবাদ তৈরি করুন</span>
          </BaseLink>
        </li>

        <li>
          <BaseLink
            to="/admin/news-list"
            :class="[
              open ? 'justify-start' : 'justify-center border-b-0',
              'flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all',
            ]"
          >
            <Icon
              name="clarity:list-line"
              width="32"
              height="32"
              class="text-sizeXXl"
            />
            <span v-show="open">সংবাদ তালিকা</span>
          </BaseLink>
        </li>

        <li>
          <BaseLink
            to="/admin/create-tag"
            :class="[
              open ? 'justify-start' : 'justify-center border-b-0',
              'flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all',
            ]"
          >
            <Icon name="oui:tag" width="32" height="32" class="text-sizeXXl" />
            <span v-show="open">ট্যাগ তৈরি করুন</span>
          </BaseLink>
        </li>

        <li>
          <BaseLink
            to="/admin/tag-list"
            :class="[
              open ? 'justify-start' : 'justify-center border-b-0',
              'flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all',
            ]"
          >
            <Icon
              name="solar:hashtag-square-outline"
              width="32"
              height="32"
              class="text-sizeXXl"
            />
            <span v-show="open">ট্যাগ তালিকা</span>
          </BaseLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
  import BaseLink from '@/components/base/BaseLink.vue';
  import Header from '@/components/global/layouts/Header.vue';
  import { computed } from 'vue';

  const props = defineProps<{
    open: boolean;
  }>();

  const open = computed(() => !props.open);
</script>
