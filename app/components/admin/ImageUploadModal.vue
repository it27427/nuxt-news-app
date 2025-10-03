<template>
  <VueFinalModal
    v-model="internalVisible"
    :clickToClose="false"
    :escToClose="true"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
  >
    <div class="p-6 bg-white rounded-lg shadow-lg w-full max-w-md text-center">
      <h3 class="text-lg font-bold mb-4">Image Upload</h3>

      <!-- Drag & Drop -->
      <div
        class="relative border-2 border-dashed border-slate-400 rounded-lg p-6 mb-4 cursor-pointer min-h-[180px] flex items-center justify-center"
        @dragover.prevent
        @drop.prevent="handleDrop"
        @click="!previewUrl && triggerFileInput()"
      >
        <p v-if="!previewUrl" class="text-gray-500">Drag & drop an image here or click to upload</p>
        <div v-else class="relative w-full">
          <img :src="previewUrl" alt="Preview" class="w-full max-h-60 object-contain rounded" />
          <button type="button" @click.stop="removeImage"
            class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded">✕ Remove</button>
        </div>
        <input ref="fileInput" type="file" class="hidden" @change="handleFileChange" />
      </div>

      <!-- OR by URL -->
      <div class="relative mb-3">
        <input type="text" v-model="form.url" placeholder="Image URL"
          class="w-full p-2 border border-slate-400 rounded" @input="updatePreviewFromUrl" />
        <button v-if="previewUrl" type="button" @click="removeImage" class="absolute right-2 top-2 text-red-600">✕</button>
      </div>

      <!-- Caption -->
      <input type="text" v-model="form.caption" placeholder="Caption"
        class="w-full mb-3 p-2 border border-slate-400 rounded" />

      <!-- Source -->
      <input type="text" v-model="form.source" placeholder="Source"
        class="w-full mb-3 p-2 border border-slate-400 rounded" />

      <!-- Actions -->
      <div class="flex justify-end gap-2">
        <button @click="cancel" class="px-3 py-1 border rounded">Cancel</button>
        <button @click="submit" class="px-3 py-1 bg-green-600 text-white rounded">Insert</button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
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
