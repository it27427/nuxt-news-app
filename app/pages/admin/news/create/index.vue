<template>
  <section>
    <form class="space-y-5">
      <div class="w-64">
        <CustomSelect
          v-model="selectedNewsType"
          :options="newsTypes"
          placeholder="সংবাদ ধরন নির্বাচন করুন"
        />
      </div>

      <client-only>
        <div>
          <QuillEditor v-model:content="body" />
        </div>
      </client-only>

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

  const selectedNewsType = ref(null);
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
</style>
