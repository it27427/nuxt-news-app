<template>
  <div v-if="route.path?.startsWith('/admin')">
    <!-- ERROR-PAGE(ADMIN) -->
    <NuxtLayout name="authentication">
      <section
        class="flex items-center justify-center w-full min-h-screen bg-red-50 dark:bg-slate-950 p-4"
      >
        <SvgIcon />
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
                status === 'authenticated' ? '/admin/dashboard' : '/auth/login'
              "
              class="bg-primary text-white rounded-sm px-6 h-14 py-2 flex items-center gap-1 justify-center transition-all hover:bg-primary-dark"
            >
              <client-only>
                <Icon
                  v-if="status === 'authenticated'"
                  name="hugeicons:dashboard-browsing"
                  width="24"
                  height="24"
                  class="text-4xl"
                />

                <Icon
                  v-else
                  name="hugeicons:login-circle-02"
                  width="24"
                  height="24"
                  class="text-4xl"
                />
              </client-only>

              <span class="font-hind font-bold inline-block text-xl mt-0.125">
                {{
                  status === 'authenticated'
                    ? 'ড্যাসবোর্ডে যান'
                    : 'পুনরায় লগইন করুন'
                }}
              </span>
            </BaseLink>
          </div>

          <div v-else class="flex flex-col items-center gap-4">
            <div class="flex flex-col items-center gap-2">
              <h1 class="text-7xl font-bold text-red-500 font-bengali">
                ত্রুটি
                <span class="text-7xl font-bold text-red-500 font-bengali">
                  {{ toBanglaNumber(error.statusCode) }}
                </span>
              </h1>

              <p class="text-2xl font-medium text-red-500 mb-4">
                {{ error.message }}
              </p>
            </div>

            <BaseLink
              :to="
                status === 'authenticated' ? '/admin/dashboard' : '/auth/login'
              "
              class="bg-primary text-white rounded-sm px-6 h-14 py-2 flex items-center gap-1 justify-center transition-all hover:bg-primary-dark"
            >
              <client-only>
                <Icon
                  v-if="status === 'authenticated'"
                  name="hugeicons:dashboard-square-02"
                  width="24"
                  height="24"
                  class="text-4xl"
                />

                <Icon
                  v-else
                  name="hugeicons:login-circle-02"
                  width="24"
                  height="24"
                  class="text-4xl"
                />
              </client-only>

              <span class="font-hind font-bold inline-block text-xl mt-0.125">
                {{
                  status === 'authenticated'
                    ? 'ড্যাসবোর্ডে যান'
                    : 'পুনরায় লগইন করুন'
                }}
              </span>
            </BaseLink>
          </div>
        </div>
      </section>
    </NuxtLayout>
  </div>

  <!-- GLOBAL-ERROR-PAGE(PUBLIC) -->
  <div v-else>
    <section
      class="flex items-center justify-center w-full min-h-screen bg-red-50 dark:bg-slate-900 p-4"
    >
      <SvgIcon />
      <div class="flex flex-col items-center justify-center text-center">
        <div class="flex flex-col items-center gap-4">
          <h1 class="text-7xl font-bold text-red-500">
            ত্রুটি
            <span class="font-tino font-bold">
              {{ toBanglaNumber(error.statusCode) }}
            </span>
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
            class="bg-primary text-white rounded-sm px-6 h-14 py-2 flex items-center justify-center transition-all hover:bg-primary-dark"
          >
            <client-only>
              <Icon name="mi:home" width="24" height="24" class="text-4xl" />
            </client-only>
            <span class="font-hind font-bold inline-block text-xl mt-0.125">
              মূল পাতায় যান
            </span>
          </BaseLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import type { NuxtError } from '#app';
  import { useRoute } from '#imports';
  import BaseLink from '~/components/base/BaseLink.vue';
  import SvgIcon from '~/components/global/SvgIcon.vue';
  import { toBanglaNumber } from '~/utils/number';

  declare const useErrorAuth: () => {
    status: 'authenticated' | 'unauthenticated';
  };

  const props = defineProps<{ error: NuxtError }>();
  const error = props.error;

  const route = useRoute();

  const { status } = useErrorAuth();
</script>
