<template>
  <aside
    class="bg-light text-dark dark:bg-gray-900 dark:text-white min-h-screen transition-all duration-300 hidden lg:flex flex-col"
    :class="[props.open ? 'w-64' : 'w-20']"
  >
    <Header
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
        I
      </div>

      <ul v-show="props.open" class="flex flex-col items-center justify-center">
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

    <nav class="flex-1 flex flex-col gap-2 p-2">
      <!-- PUBLISHER-LIST -->
      <ul class="flex flex-col gap-2">
        <li>
          <BaseLink
            to="/admin/dashboard"
            class="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all"
            :class="[
              props.open ? 'justify-start' : 'justify-center border-b-0',
            ]"
          >
            <Icon
              name="streamline-freehand:dashboard-browser-gauge"
              width="32"
              height="32"
              class="text-sizeXXl"
            />
            <span v-show="props.open">ড্যাশবোর্ড</span>
          </BaseLink>
        </li>

        <li>
          <BaseLink
            to="/admin/create-news"
            class="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all"
            :class="[
              props.open ? 'justify-start' : 'justify-center border-b-0',
            ]"
          >
            <Icon
              name="basil:edit-outline"
              width="32"
              height="32"
              class="text-sizeXXl"
            />
            <span v-show="props.open">সংবাদ তৈরি করুন</span>
          </BaseLink>
        </li>

        <li>
          <BaseLink
            to="/admin/news-list"
            class="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all"
            :class="[
              props.open ? 'justify-start' : 'justify-center border-b-0',
            ]"
          >
            <Icon
              name="fluent-mdl2:product-list"
              width="32"
              height="32"
              class="text-sizeXXl"
            />
            <span v-show="props.open">সংবাদ তালিকা</span>
          </BaseLink>
        </li>

        <li>
          <BaseLink
            to="/admin/create-tag"
            class="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all"
            :class="[
              props.open ? 'justify-start' : 'justify-center border-b-0',
            ]"
          >
            <Icon name="oui:tag" width="32" height="32" class="text-sizeXXl" />
            <span v-show="props.open">ট্যাগ তৈরি করুন</span>
          </BaseLink>
        </li>

        <li>
          <BaseLink
            to="/admin/tag-list"
            class="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all"
            :class="[
              props.open ? 'justify-start' : 'justify-center border-b-0',
            ]"
          >
            <Icon
              name="streamline-freehand:task-list-pin-1"
              width="32"
              height="32"
              class="text-sizeXXl"
            />
            <span v-show="props.open">ট্যাগ তালিকা</span>
          </BaseLink>
        </li>

        <li>
          <BaseLink
            to="/admin/automations"
            class="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all"
            :class="[
              props.open ? 'justify-start' : 'justify-center border-b-0',
            ]"
          >
            <Icon
              name="carbon:ibm-event-automation"
              width="32"
              height="32"
              class="text-sizeXXl"
            />
            <span v-show="props.open">স্বয়ংক্রিয়তা</span>
          </BaseLink>
        </li>
      </ul>

      <!-- ADMIN-LIST -->
      <ul class="flex flex-col gap-2">
        <li>
          <BaseLink
            to="/admin/create-user"
            class="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all"
            :class="[
              props.open ? 'justify-start' : 'justify-center border-b-0',
            ]"
          >
            <Icon
              name="famicons:create-outline"
              width="32"
              height="32"
              class="text-sizeXXl"
            />
            <span v-show="props.open">ব্যবহারকারী তৈরি করুন</span>
          </BaseLink>
        </li>

        <li>
          <BaseLink
            to="/admin/users-list"
            class="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all"
            :class="[
              props.open ? 'justify-start' : 'justify-center border-b-0',
            ]"
          >
            <Icon
              name="garden:user-list-stroke-16"
              width="32"
              height="32"
              class="text-sizeXXl"
            />
            <span v-show="props.open">ব্যবহারকারীর তালিকা</span>
          </BaseLink>
        </li>

        <li>
          <BaseLink
            to="/admin/create-tag"
            class="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all"
            :class="[
              props.open ? 'justify-start' : 'justify-center border-b-0',
            ]"
          >
            <Icon name="oui:tag" width="32" height="32" class="text-sizeXXl" />
            <span v-show="props.open">ট্যাগ তৈরি করুন</span>
          </BaseLink>
        </li>

        <li>
          <BaseLink
            to="/admin/drafts"
            class="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all"
            :class="[
              props.open ? 'justify-start' : 'justify-center border-b-0',
            ]"
          >
            <Icon
              name="fluent:drafts-20-regular"
              width="32"
              height="32"
              class="text-sizeXXl"
            />
            <span v-show="props.open">সংরক্ষণাগার</span>
          </BaseLink>
        </li>

        <li>
          <BaseLink
            to="/admin/approval"
            class="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all"
            :class="[
              props.open ? 'justify-start' : 'justify-center border-b-0',
            ]"
          >
            <Icon
              name="fluent:approvals-app-32-regular"
              width="32"
              height="32"
              class="text-sizeXXl"
            />
            <span v-show="props.open">অনুমোদন</span>
          </BaseLink>
        </li>
      </ul>

      <!-- LOG-OUT -->
      <Button
        @click="logout"
        class="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 font-hind text-base lg:text-lg text-dark-surface dark:text-light hover:border-b-gray-200 hover:rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 dark:hover:border-b-slate-800 dark:hover:text-white transition-all"
        :class="[props.open ? 'justify-start' : 'justify-center border-b-0']"
      >
        <Icon
          name="ri:logout-circle-r-line"
          width="32"
          height="32"
          class="text-sizeXXl"
        />
        <span v-if="props.open">লগ আউট</span>
      </Button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
  import Button from '@/components/admin/global/Button.vue';
  import CollapseButton from '@/components/admin/global/CollapseButton.vue';
  import BaseLink from '@/components/base/BaseLink.vue';
  import Header from '@/components/global/layouts/Header.vue';
  import { useCustomAuth } from '@/composables/useCustomAuth';

  const props = defineProps<{ open: boolean }>();
  const emit = defineEmits<{ (e: 'toggle'): void }>();

  const toggleSidebar = () => emit('toggle');

  const { logout } = useCustomAuth();
</script>
