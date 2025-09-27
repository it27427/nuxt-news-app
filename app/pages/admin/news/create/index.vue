<template>
  <section>
    <form class="space-y-5">
      <div class="flex flex-col md:flex-row items-center gap-2">
        <div class="w-full md:w-1/2">
          <CustomSelect
            v-model="selectedNewsType"
            :options="newsTypes"
            placeholder="সংবাদ ধরন নির্বাচন করুন"
          />
        </div>
      </div>

      <client-only>
        <div>
          <QuillEditor v-model:content="body" />
        </div>
      </client-only>

      <!-- <div class="flex flex-col gap-2 md:flex-row">
        <BaseInput type="text" label="Image Source 1" />
        <BaseInput type="text" label="Image Source 2" />
        <BaseInput type="text" label="Image Source 3" />
        <BaseInput type="text" label="Image Source 4" />
        <BaseInput type="text" label="Image Source 5" />
        <BaseInput type="text" label="Image Source 6" />
      </div> -->

      <div class="flex items-center justify-end gap-3">
        <button
          class="py-2 px-5 bg-slate-500 text-white hover:bg-slate-600 font-semibold font-hind text-xl transition-all delay-300"
        >
          সংরক্ষণ
        </button>

        <button
          class="py-2 px-5 bg-green-500 text-white hover:bg-green-600 font-semibold text-xl transition-all delay-300"
        >
          প্রকাশ করুন
        </button>
      </div>
    </form>
  </section>
</template>

<script lang="ts" setup>
  definePageMeta({
    layout: 'admin',
  });

  const body = ref('');

  const newsTypes = [
    'রাজনীতি',
    'সর্বাধিক পঠিত',
    'বিশ্ব',
    'অর্থনীতি',
    'স্বাস্থ্য',
    'খেলা',
    'প্রযুক্তি',
    'ভিডিও',
  ];

  const selectedNewsType = ref<string[]>([]);
</script>

<style lang="scss" scoped>
  :deep(.ql-editor) {
    min-height: 12.5rem;
  }

  :deep(.ql-toolbar.ql-snow) {
    border-top-left-radius: 0.3125rem;
    border-top-right-radius: 0.3125rem;
  }

  :deep(.ql-container.ql-snow) {
    border-bottom-left-radius: 0.3125rem;
    border-bottom-right-radius: 0.3125rem;
  }

  :deep(.ql-snow .ql-tooltip) {
    left: 0.625rem !important;
    @apply bg-light text-dark dark:bg-slate-600 dark:text-white border-0;
  }

  :deep(.ql-snow .ql-tooltip.ql-editing input[type='text']) {
    @apply bg-transparent;

    &:focus {
      outline: none;
    }
  }

  :deep(.ql-snow .ql-tooltip a) {
    @apply text-dark dark:text-white;
  }
</style>
