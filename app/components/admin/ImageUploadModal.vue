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
      
        <button @click="cancel" class="font-semibold text-sm px-3 py-1 border border-red-500 dark:border-red rounded shadow-sm focus:ring-1 hover:ring-1 hover:ring-red-500 bg-red-50 dark:bg-red-900 focus:ring-red-500 active:ring-red-500 focus:border-red-500 active:border-red-500 focus:bg-red-50 dark:focus:bg-red-900 transition-all duration-150">
          বাতিল করুন
        </button>
      </div>

      <div class="flex flex-col gap-4">
        <!-- Drag & Drop -->
        <div
          class="relative border border-dashed border-slate-400 rounded-lg p-2 mb-4 cursor-pointer min-h-[12rem] md:min-h-[20rem] flex items-center justify-center"
          @dragover.prevent
          @drop.prevent="handleDrop"
          @click="!previewUrl && triggerFileInput()"
        >
          <p v-if="!previewUrl" class="text-gray-500 dark:text-light-50 flex items-center flex-col gap-2 justify-center text-center">
            <Icon icon="iwwa:upload" class="text-6xl" />
            এখানে ছবি টেনে আনুন এবং ছেড়ে দিন 
            <br>
            অথবা
            <br>
            আপলোড করতে ক্লিক করুন
          </p>
          <div v-else class="relative w-full h-full p-1">
            <img :src="previewUrl" alt="Preview" class="w-full h-full relative object-cover rounded" />
            <button type="button" @click.stop="removeImage" v-tooltip="'অপসারণ করুন'"
              class="cursor-pointer absolute top-2 right-2 font-semibold text-sm w-8 h-8 p-1 justify-center border border-red-500 dark:border-red rounded-full shadow-sm focus:ring-1 hover:ring-1 hover:ring-red-500 bg-red-50 dark:bg-red-900 focus:ring-red-500 active:ring-red-500 focus:border-red-500 active:border-red-500 focus:bg-red-50 dark:focus:bg-red-900 transition-all duration-150 flex items-center gap-1">
              <Icon icon="ei:close" class="text-lg" />
            </button>
          </div>
          <input ref="fileInput" type="file" class="hidden" @change="handleFileChange" />
        </div>

        <!-- OR by URL -->
        <div class="relative mb-3">
          <input type="text" v-model="form.url" placeholder="ছবির ইউআরএল (ছবির ওয়েব ঠিকানা)"
            class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded px-4 py-2 flex justify-between items-center gap-2 shadow-sm focus:ring-2 focus:ring-green-500 active:ring-green-500 focus:border-green-500 active:border-green-500 focus:bg-green-50 dark:focus:bg-green-900 transition-all duration-150 outline-none" @input="updatePreviewFromUrl" />
          <button v-if="previewUrl" type="button" v-tooltip.left="'অপসারণ করুন'" @click="removeImage" class="absolute top-2 right-2 text-red-600">
            <Icon icon="solar:close-circle-linear" class="text-2xl" /> 
          </button>
        </div>

        <!-- Caption -->
        <input type="text" v-model="form.caption" placeholder="ছবির শিরোনাম"
          class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded px-4 py-2 flex justify-between items-center gap-2 shadow-sm focus:ring-2 focus:ring-green-500 active:ring-green-500 focus:border-green-500 active:border-green-500 focus:bg-green-50 dark:focus:bg-green-900 transition-all duration-150 outline-none" />

        <!-- Source -->
        <input type="text" v-model="form.source" placeholder="ছবির উৎস"
          class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded px-4 py-2 flex justify-between items-center gap-2 shadow-sm focus:ring-2 focus:ring-green-500 active:ring-green-500 focus:border-green-500 active:border-green-500 focus:bg-green-50 dark:focus:bg-green-900 transition-all duration-150 outline-none" />

        <!-- Actions -->
        <div class="flex justify-end gap-2 mt-4">
          <button @click="submit" class="font-semibold text-sm px-4 py-2 border border-green-500 dark:border-red rounded shadow-sm focus:ring-1 hover:ring-1 hover:ring-green-500 bg-red-50 dark:bg-green-900 focus:ring-green-500 active:ring-regreend-500 focus:border-green-500 active:border-green-500 focus:bg-green-50 dark:focus:bg-green-900 transition-all duration-150">
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

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ (e: 'update:visible', val: boolean): void, (e: 'submit', payload: any): void }>()

const internalVisible = ref(props.visible)
watch(() => props.visible, val => internalVisible.value = val)
watch(internalVisible, val => emit('update:visible', val))

const form = reactive({
  file: null as File | null,
  url: '',
  caption: '',
  source: ''
})

const previewUrl = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() { fileInput.value?.click() }
function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null
  if (file) { form.file = file; previewUrl.value = URL.createObjectURL(file); form.url = '' }
}
function handleDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0] ?? null
  if (file) { form.file = file; previewUrl.value = URL.createObjectURL(file); form.url = '' }
}
function updatePreviewFromUrl() {
  if (form.url) { previewUrl.value = form.url; form.file = null }
}
function removeImage() { form.file = null; form.url = ''; previewUrl.value = null; form.caption = ''; form.source = '' }
function cancel() { internalVisible.value = false; removeImage() }
function submit() {
  const payload = { file: form.file, url: form.url || previewUrl.value || '', caption: form.caption, source: form.source }
  emit('submit', payload)
  internalVisible.value = false
}
</script>
