<template>
  <section>
    <form @submit.prevent="logContent" class="space-y-5">
      <div class="flex flex-col md:flex-row items-center gap-4">
        <div class="w-full md:w-1/2">
          <CustomSelect
            v-model="selectedNewsType"
            :options="newsTypes"
            placeholder="সংবাদ ধরন নির্বাচন করুন"
          />
        </div>

        <div class="w-full md:w-1/2">
          <CustomSelect
            v-model="selectedNewsTag"
            :options="newsTags"
            placeholder="ট্যাগ নির্বাচন করুন"
          />
        </div>
      </div>

      <client-only>
        <div>
          <QuillEditor v-model:content="body" contentType="json" />
        </div>
      </client-only>

      <div class="mt-4">
        <h3>Editor Output (JSON/Delta) - Cleaned Data</h3>
        <pre>{{ finalBody.ops || finalBody }}</pre>
      </div>

      <div class="flex items-center justify-end gap-3">
        <button
          type="button"
          @click="saveDraft"
          class="py-2 px-5 bg-slate-500 text-white hover:bg-slate-600 font-semibold font-hind text-xl transition-all delay-300"
        >
          সংরক্ষণ
        </button>

        <button
          type="submit"
          @click="publishContent"
          class="py-2 px-5 bg-green-500 text-white hover:bg-green-600 font-semibold text-xl transition-all delay-300"
        >
          প্রকাশ করুন
        </button>
      </div>
    </form>
  </section>
</template>

<script lang="ts" setup>
  // 💡 CRITICAL FIX: Import 'ref' and 'computed' from 'vue'
  import Delta from 'quill-delta';
  import { computed, ref } from 'vue';
  // NOTE: Assuming QuillEditor component is globally available or imported in a layout.
  // If not, you must import it: import QuillEditor from '~/components/admin/QuillEditor.vue';

  definePageMeta({
    layout: 'admin',
  });

  // Function to clean Delta ops by removing only leading/trailing newlines
  function cleanDelta(delta: Delta): Delta {
    const newOps: any[] = [...delta.ops];

    // Remove leading newlines
    while (newOps.length > 0 && newOps[0].insert === '\n') {
      newOps.shift();
    }
    // Remove trailing newlines (if the last element is text that is just '\n')
    while (newOps.length > 0 && newOps[newOps.length - 1].insert === '\n') {
      newOps.pop();
    }

    return new Delta(newOps);
  }

  // State
  const body = ref<Delta>(new Delta()); // Storing as Delta

  // 💡 CRITICAL FIX: Define the finalBody computed property
  const finalBody = computed(() => cleanDelta(body.value));

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

  const newsTags = [
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
  const selectedNewsTag = ref<string[]>([]);

  function logContent() {
    console.log('Quill JSON content:', finalBody.value.ops);
    alert('Content logged to console!');
  }

  function saveDraft() {
    // Use finalBody.value.ops for saving/publishing
    console.log('Draft saved (Cleaned):', {
      body: finalBody.value.ops,
      type: selectedNewsType.value,
      tags: selectedNewsTag.value,
    });
    alert('সংবাদ সংরক্ষণাগারে সংরক্ষণ করা হয়েছে!');
  }

  function publishContent() {
    // Use finalBody.value.ops for saving/publishing
    console.log('Publishing content (Cleaned):', {
      body: finalBody.value.ops,
      type: selectedNewsType.value,
      tags: selectedNewsTag.value,
    });
    alert('সংবাদ প্রকাশ করা হয়েছে!');
  }
</script>

<style lang="scss" scoped>
  :deep(.ql-editor) {
    min-height: 40rem;
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
