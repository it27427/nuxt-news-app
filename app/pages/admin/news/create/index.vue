<template>
  <section class="flex flex-col gap-5">
    <h1 class="text-dark dark:text-primary text-center font-bold text-2xl md:text-3xl py-5">{{ pageTitle }}</h1>

    <client-only>
      <form @submit.prevent="publishContent" class="flex flex-col gap-5">

        <!-- Categories & Tags -->
        <div class="flex flex-col md:flex-row gap-4">
          <div class="w-full md:w-1/2">
            <CustomSelect
              v-model="selectedNewsType"
              :options="categoryOptions"
              placeholder="সংবাদ ধরন নির্বাচন করুন"
              multiple
            />
          </div>

          <div class="w-full md:w-1/2">
            <CustomSelect
              v-model="selectedNewsTag"
              :options="tagOptions"
              placeholder="ট্যাগ নির্বাচন করুন"
              multiple
            />
          </div>
        </div>

        <!-- Title -->
        <input
          v-model="title"
          type="text"
          placeholder="সংবাদ শিরোনাম লিখুন"
          class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded px-4 py-2 gap-2 shadow-sm ring-1 focus:ring-green-500 active:ring-green-500 focus:border-green-500 active:border-green-500 focus:bg-green-50 dark:focus:bg-green-900 transition-all duration-150 outline-none"
        />

        <!-- Home Card Text -->
        <textarea
          v-model="homeCardText"
          placeholder="হোম কার্ড টেক্সট লিখুন"
          class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded px-4 py-2 gap-2 shadow-sm ring-1 focus:ring-green-500 active:ring-green-500 focus:border-green-500 active:border-green-500 focus:bg-green-50 dark:focus:bg-green-900 transition-all duration-150 outline-none resize-none min-h-40"
        ></textarea>

        <!-- Featured Image -->
        <div class="border p-3 rounded">
          <p class="font-semibold mb-2">Featured Image</p>
          <button
            type="button"
            @click="openImageModal('featured')"
            class="px-3 py-1 bg-blue-500 text-white rounded mb-2"
          >
            Upload / Select Image
          </button>

          <div v-if="featured.url" class="mt-2 relative">
            <img :src="featured.url" class="w-full max-h-40 object-contain rounded" />
            <button
              type="button"
              @click="removeFeaturedImage"
              class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
            >
              ✕ Remove
            </button>
            <p class="text-sm text-gray-600 mt-1">Caption: {{ featured.caption }}</p>
            <p class="text-sm text-gray-600 mt-1">Source: {{ featured.source }}</p>
          </div>
        </div>

        <!-- Dynamic Content Blocks -->
        <div
          v-for="(block, index) in contentBlocks"
          :key="index"
          class="border p-3 rounded relative"
        >
          <select v-model="block.type" class="border p-2 mb-2">
            <option value="text">Text</option>
            <option value="subtitle">Subtitle</option>
            <option value="image">Image</option>
          </select>

          <!-- Text -->
          <div v-if="block.type === 'text'">
            <textarea
              v-model="block.text"
              placeholder="পোস্ট টেক্সট লিখুন"
              class="w-full border p-2 rounded"
            ></textarea>
          </div>

          <!-- Subtitle -->
          <div v-if="block.type === 'subtitle'">
            <input
              v-model="block.text"
              type="text"
              placeholder="সাবটাইটেল লিখুন"
              class="w-full border p-2 rounded"
            />
          </div>

          <!-- Image -->
          <div v-if="block.type === 'image'">
            <button
              type="button"
              @click="openImageModal(index)"
              class="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Upload / Select Image
            </button>
            <div v-if="block.url" class="mt-2 relative">
              <img :src="block.url" class="w-full max-h-40 object-contain rounded" />
              <button
                type="button"
                @click="removeBlock(index)"
                class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
              >
                ✕ Remove
              </button>
              <p class="text-sm text-gray-600 mt-1">Caption: {{ block.caption }}</p>
              <p class="text-sm text-gray-600 mt-1">Source: {{ block.source }}</p>
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <button type="button" @click="addBlock" class="px-3 py-1 border rounded">
            + ব্লক যোগ করুন
          </button>
        </div>

        <!-- Buttons -->
        <div class="flex items-center justify-end gap-3">
          <button
            type="button"
            @click="saveDraft"
            :disabled="loading"
            class="py-2 px-5 bg-slate-500 text-white hover:bg-slate-600 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            সংরক্ষণ করুন
          </button>

          <button
            type="submit"
            :disabled="loading"
            class="py-2 px-5 bg-green-500 text-white hover:bg-green-600 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitButtonLabel }}
          </button>
        </div>
      </form>
    </client-only>

    <!-- Image Upload Modal -->
    <client-only>
      <ImageUploadModal
        v-model:visible="imageModalVisible"
        @submit="handleImageInsert"
      />
    </client-only>
  </section>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'admin' })
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~~/store/auth.store'
import { useCategoriesStore } from '~~/store/categories.store'
import { useDraftsStore } from '~~/store/drafts.store'
import { useNewsStore } from '~~/store/news.store'
import { useTagsStore } from '~~/store/tags.store'

const toast = useToast()
const router = useRouter()
const authStore = useAuthStore()
const newsStore = useNewsStore()
const draftsStore = useDraftsStore()
const categoriesStore = useCategoriesStore()
const tagsStore = useTagsStore()

const pageTitle = ref('সংবাদ তৈরি করুন');

interface Option { label: string; value: string }

const selectedNewsType = ref<Option[]>([])
const selectedNewsTag = ref<Option[]>([])
const title = ref('')
const homeCardText = ref('')
const featured = ref<{ url: string; caption: string; source: string; file: File | null }>({ url: '', caption: '', source: '', file: null })
const contentBlocks = ref<any[]>([])
const imageModalVisible = ref(false)
const currentBlockIndex = ref<number | 'featured' | null>(null)

const categoryOptions = computed(() => categoriesStore.categories.map((c: any) => ({ label: c.name, value: c.id })))
const tagOptions = computed(() => tagsStore.tags.map((t: any) => ({ label: t.name, value: t.id })))
const loading = computed(() => newsStore.loading || draftsStore.loading)
const submitButtonLabel = computed(() => authStore.user?.role === 'super_admin' ? 'প্রকাশ করুন' : 'সাবমিট করুন')

onMounted(async () => {
  if (!categoriesStore.categories.length) await categoriesStore.fetchCategories()
  if (!tagsStore.tags.length) await tagsStore.fetchTags()
})

/* Blocks */
function addBlock() { contentBlocks.value.push({ type: 'text', text: '', caption: '', source: '', url: '', file: null }) }
function removeBlock(index: number) { contentBlocks.value.splice(index, 1) }
function removeBlockImage(index: number) { 
  if(contentBlocks.value[index].type === 'image') contentBlocks.value[index] = { type: 'image', url: '', caption: '', source: '', file: null } 
}

/* Open Image Modal */
function openImageModal(index: number | 'featured') {
  currentBlockIndex.value = index
  imageModalVisible.value = true
}

/* Handle Image Insert */
function handleImageInsert(payload: any) {
  if (currentBlockIndex.value === 'featured') {
    featured.value = { url: payload.url, caption: payload.caption, source: payload.source, file: payload.file }
  } else if (typeof currentBlockIndex.value === 'number') {
    contentBlocks.value[currentBlockIndex.value] = { 
      type: 'image', 
      url: payload.url, 
      caption: payload.caption, 
      source: payload.source, 
      file: payload.file 
    }
  }
  currentBlockIndex.value = null
}
function removeFeaturedImage() { featured.value = { url: '', caption: '', source: '', file: null } }

/* Upload Helper */
async function uploadFile(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/uploads', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    return data.url || ''
  } catch (err) {
    console.warn('uploadFile failed:', err)
    return URL.createObjectURL(file)
  }
}

/* Build Payload */
async function buildPayloadForNewsOrDraft() {
  let featuredUrl = featured.value.url || ''
  if (featured.value.file) featuredUrl = await uploadFile(featured.value.file)

  const normalizedBlocks = await Promise.all(contentBlocks.value.map(async (b: any) => {
    if (b.type === 'image') {
      let url = b.url
      if (b.file) url = await uploadFile(b.file)
      return { type: 'image', url, caption: b.caption, source: b.source }
    } else if (b.type === 'subtitle') return { type: 'subtitle', text: b.text }
    else return { type: 'text', text: b.text }
  }))

  return {
    title: title.value,
    home_card_text: homeCardText.value,
    featured_image: { url: featuredUrl, caption: featured.value.caption, source: featured.value.source },
    categories: selectedNewsType.value.map(c => c.value),
    tags: selectedNewsTag.value.map(t => t.value),
    content_blocks: normalizedBlocks,
    author: { id: authStore.user?.id ?? 'unknown_user', name: authStore.user?.name ?? 'Anonymous' },
    created_at: new Date().toISOString()
  }
}

/* Save Draft */
async function saveDraft() {
  try {
    const payload = await buildPayloadForNewsOrDraft()
    await draftsStore.createDraft(payload)
    toast.success('সংবাদ সফলভাবে সংরক্ষণাগারে সংরক্ষণ করা হয়েছে!')
    router.push('/admin/drafts/')
  } catch (err: any) {
    toast.error(err?.message || 'সংবাদ সংরক্ষণাগারে সংরক্ষণ করতে ব্যর্থ হয়েছে!')
  }
}

/* Publish */
async function publishContent() {
  try {
    const payload = await buildPayloadForNewsOrDraft()
    if (!payload.title.trim()) { toast.error('অনুগ্রহ করে শিরোনাম লিখুন!'); return }
    if (!payload.categories.length) { toast.error('অন্তত একটি ক্যাটেগরি নির্বাচন করুন!'); return }
    if (!payload.content_blocks.length) { toast.error('কমপক্ষে একটি কন্টেন্ট ব্লক যোগ করুন!'); return }

    const response = await newsStore.createNews(payload)
    if (!response?.data) { toast.error('সংবাদ তৈরি করা যায়নি!'); return }

    toast.success(authStore.user?.role === 'super_admin' ? 'সংবাদ সফলভাবে প্রকাশ করা হয়েছে!' : 'সংবাদ সফলভাবে পর্যালোচনায় পাঠানো হয়েছে!')
    router.push('/admin/news/')
  } catch (err: any) {
    toast.error(err?.message || 'সংবাদ প্রকাশ করতে ব্যর্থ হয়েছে!')
  }
}
</script>
