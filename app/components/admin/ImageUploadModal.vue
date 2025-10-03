<template>
  <VueFinalModal
    v-model="internalVisible"
    :clickToClose="false"
    :escToClose="true"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
  >
    <div class="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-md md:max-w-lg md:min-w-[40rem]">
      <div class="w-full flex items-center justify-between mb-6">
        <h3 class="text-lg font-tino font-medium">ছবি আপলোড করুন</h3>
        <button @click="cancel" class="font-semibold text-sm px-3 py-1 text-red-500 bg-red-50 border border-red-500 rounded shadow-sm transition-all duration-150 hover:ring-1 focus:ring-1">
          বাতিল করুন
        </button>
      </div>

      <div class="flex flex-col gap-4">
        <!-- Drag & Drop -->
        <div
          class="relative border border-dashed rounded-lg p-2 mb-1 cursor-pointer min-h-[12rem] md:min-h-[20rem] flex items-center justify-center"
          :class="errors.image ? 'border-red-500 bg-red-50' : 'border-slate-400 bg-white dark:bg-gray-800'"
          @dragover.prevent
          @drop.prevent="handleDrop"
          @click="!previewUrl && triggerFileInput()"
        >
          <p v-if="!previewUrl" class="text-gray-500 dark:text-light-50 flex items-center flex-col gap-2 justify-center text-center">
            <Icon icon="iwwa:upload" class="text-6xl" />
            এখানে ছবি টেনে আনুন এবং ছেড়ে দিন 
            <br> অথবা <br> আপলোড করতে ক্লিক করুন
          </p>
          <div v-else class="relative w-full h-full p-1">
            <img :src="previewUrl" alt="Preview" class="w-full h-full relative object-cover rounded" />
            <button type="button" @click.stop="removeImage" v-tooltip="'অপসারণ করুন'"
              class="absolute top-2 right-2 w-8 h-8 p-1 border border-red-500 rounded-full flex items-center justify-center shadow-sm bg-red-50">
              <Icon icon="ei:close" class="text-lg" />
            </button>
          </div>
          <input ref="fileInput" type="file" class="hidden" @change="handleFileChange" />
        </div>
        <span v-if="errors.image" class="text-red-500 text-sm mb-2">{{ errors.image }}</span>

        <!-- OR by URL -->
        <div class="relative mb-1">
          <input type="text" v-model="form.url" placeholder="ছবির ইউআরএল (ছবির ওয়েব ঠিকানা)"
            :class="['w-full h-12 rounded px-4 py-2 shadow-sm outline-none', errors.url ? 'border border-red-500 bg-red-50' : 'border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-white']"
            @input="updatePreviewFromUrl" />
        </div>
        <span v-if="errors.url" class="text-red-500 text-sm mb-2">{{ errors.url }}</span>

        <!-- Caption -->
        <div class="mb-1">
          <input type="text" v-model="form.caption" placeholder="ছবির শিরোনাম"
            :class="['w-full h-12 rounded px-4 py-2 shadow-sm outline-none', errors.caption ? 'border border-red-500 bg-red-50' : 'border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-white']" />
        </div>
        <span v-if="errors.caption" class="text-red-500 text-sm mb-2">{{ errors.caption }}</span>

        <!-- Source -->
        <div class="mb-1">
          <input type="text" v-model="form.source" placeholder="ছবির উৎস"
            :class="['w-full h-12 rounded px-4 py-2 shadow-sm outline-none', errors.source ? 'border border-red-500 bg-red-50' : 'border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-white']" />
        </div>
        <span v-if="errors.source" class="text-red-500 text-sm mb-2">{{ errors.source }}</span>

        <!-- Actions -->
        <div class="flex justify-end gap-2 mt-4">
          <button @click="submit" class="w-full h-12 font-semibold text-sm px-4 py-2 text-green-500 border border-green-500 rounded shadow-sm transition-all duration-150">
            সন্নিবেশিত করুন
          </button>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { reactive, ref, watch } from 'vue';

interface ImageData {
  file: File | null;
  url: string;
  caption: string;
  source: string;
}

const props = defineProps<{
  visible: boolean;
  initialData?: ImageData;
}>();
const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void;
  (e: 'submit', payload: ImageData): void;
}>();

const internalVisible = ref(props.visible);
watch(() => props.visible, val => internalVisible.value = val);
watch(internalVisible, val => emit('update:visible', val));

const form = reactive<ImageData>({
  file: null,
  url: '',
  caption: '',
  source: ''
});
const previewUrl = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Validation errors
const errors = reactive<{ image?: string; url?: string; caption?: string; source?: string }>({});

// Prefill form if initialData exists
watch(
  () => props.initialData,
  (val) => {
    if (val) {
      form.file = val.file || null;
      form.url = val.url || '';
      form.caption = val.caption || '';
      form.source = val.source || '';
      previewUrl.value = val.url || (val.file ? URL.createObjectURL(val.file) : null);
    } else {
      removeImage();
    }
  },
  { immediate: true }
);

function triggerFileInput() { fileInput.value?.click(); }
function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null;
  if (file) { form.file = file; previewUrl.value = URL.createObjectURL(file); form.url = ''; }
}
function handleDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0] ?? null;
  if (file) { form.file = file; previewUrl.value = URL.createObjectURL(file); form.url = ''; }
}
function updatePreviewFromUrl() {
  if (form.url) { previewUrl.value = form.url; form.file = null; }
}
function removeImage() {
  form.file = null;
  form.url = '';
  form.caption = '';
  form.source = '';
  previewUrl.value = null;
  clearErrors();
}

function clearErrors() {
  errors.image = undefined;
  errors.url = undefined;
  errors.caption = undefined;
  errors.source = undefined;
}

function cancel() {
  internalVisible.value = false;
  removeImage();
}

function validateForm() {
  clearErrors();
  let valid = true;

  // Image file or URL required
  if (!form.file && !form.url.trim()) {
    errors.url = 'ইমেজ ফাইল বা URL আবশ্যক';
    valid = false;
  }

  // Caption required
  if (!form.caption.trim()) {
    errors.caption = 'ছবির শিরোনাম আবশ্যক';
    valid = false;
  }

  // Source required
  if (!form.source.trim()) {
    errors.source = 'ছবির উৎস আবশ্যক';
    valid = false;
  }

  return valid;
}

function submit() {
  if (!validateForm()) return;

  const payload: ImageData = {
    file: form.file,
    url: form.url || previewUrl.value || '',
    caption: form.caption,
    source: form.source
  };

  emit('submit', payload);
  internalVisible.value = false;
  removeImage();
}
</script>
