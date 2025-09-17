<template>
  <div v-if="route.path?.startsWith('/admin')">
    <!-- ERROR-PAGE(ADMIN) -->
    <NuxtLayout name="authentication">
      <div
        class="flex items-center justify-center w-full min-h-screen bg-red-200 dark:bg-slate-950 p-4"
      >
        <div class="flex flex-col items-center justify-center text-center">
          <div
            v-if="error.statusCode === 404"
            class="flex flex-col items-center gap-4"
          >
            <div class="flex flex-col items-center gap-2">
              <h1 class="text-7xl font-bold text-red-500">ত্রুটি ৪০৪</h1>
              <p class="text-2xl font-medium text-red-500 mb-4">
                দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি খুঁজে পাওয়া যায়নি।
              </p>
            </div>

            <BaseLink
              :to="
                status === 'authenticated' ? '/admin/dashboard' : '/admin/login'
              "
              class="bg-primary text-white font-bold rounded-sm px-5 h-12 flex items-center justify-center transition-all hover:bg-primary-dark"
            >
              <i class="fa-solid mr-1 fa-arrow-left" />
              {{
                status === 'authenticated'
                  ? 'ড্যাসবোর্ড পেজে ফিরে যান'
                  : 'লগইন পেজে ফিরে যান'
              }}
            </BaseLink>
          </div>

          <div v-else class="flex flex-col items-center gap-4">
            <div class="flex flex-col items-center gap-2">
              <h1 class="text-7xl font-bold text-red-500 font-bengali">
                ত্রুটি
                <span class="text-7xl font-bold text-red-500 font-bengali">
                  {{ error.statusCode }}
                </span>
              </h1>
              <p class="text-2xl font-medium text-red-500 mb-4">
                {{ error.message }}
              </p>
            </div>

            <BaseLink
              :to="
                status === 'authenticated' ? '/admin/dashboard' : '/admin/login'
              "
              class="bg-primary text-white font-bold rounded-sm px-5 h-12 flex items-center justify-center transition-all hover:bg-primary-dark"
            >
              <i class="fa-solid mt-0.5 mr-1 fa-arrow-left" />
              {{
                status === 'authenticated'
                  ? 'ড্যাসবোর্ড পেজে ফিরে যান'
                  : 'লগইন পেজে ফিরে যান'
              }}
            </BaseLink>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>

  <!-- GLOBAL-ERROR-PAGE(PUBLIC) -->
  <div v-else>
    <div
      class="flex items-center justify-center w-full min-h-screen bg-gray-100 dark:bg-slate-900 p-4"
    >
      <div class="flex flex-col items-center justify-center text-center">
        <div class="flex flex-col items-center gap-4">
          <h1 class="text-7xl font-bold text-red-500">
            ত্রুটি {{ error.statusCode }}
          </h1>
          <p class="text-2xl font-medium text-red-500 mb-4">
            {{
              error.statusCode === 404
                ? 'দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি খুঁজে পাওয়া যায়নি।'
                : error.message
            }}
          </p>

          <BaseLink
            to="/"
            class="bg-primary text-white font-bold rounded-sm px-5 h-12 flex items-center justify-center transition-all hover:bg-primary-dark"
          >
            <i class="fa-solid mr-1 fa-arrow-left" />
            হোম পেজে ফিরে যান
          </BaseLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { NuxtError } from '#app';
  import { useRoute } from '#imports';
  import BaseLink from '@/components/base/BaseLink.vue';

  declare const useErrorAuth: () => {
    status: 'authenticated' | 'unauthenticated';
  };

  const props = defineProps<{ error: NuxtError }>();
  const error = props.error;

  const route = useRoute();

  const { status } = useErrorAuth();
</script>
