<template>
  <section class="flex flex-col gap-5">
    <h1 class="text-dark dark:text-primary text-center font-bold text-2xl md:text-3xl py-5">
      {{ pageTitle }}
    </h1>

    <client-only>
      <form @submit.prevent="publishContent" class="flex flex-col gap-5">

        <!-- Categories & Tags -->
        <div class="flex flex-col md:flex-row gap-4">
          <div class="w-full md:w-1/2">
            <div class="flex flex-col gap-1">
              <label>সংবাদ ক্যাটেগরি</label>
              <CustomSelects
                v-model="selectedNewsType"
                :options="categoryOptions"
                placeholder="ক্যাটেগরি নির্বাচন করুন"
                multiple
                :class="{'border-red-500 bg-red-50': errors.categories}"
              />
              <span v-if="errors.categories" class="text-red-500 text-sm">{{ errors.categories }}</span>
            </div>
          </div>

          <div class="w-full md:w-1/2">
            <div class="flex flex-col gap-1">
              <label>সংবাদ ট্যাগ</label>
              <CustomSelects
                v-model="selectedNewsTag"
                :options="tagOptions"
                placeholder="ট্যাগ নির্বাচন করুন"
                multiple
                :class="{'border-red-500 bg-red-50': errors.tags}"
              />
              <span v-if="errors.tags" class="text-red-500 text-sm">{{ errors.tags }}</span>
            </div>
          </div>
        </div>

        <!-- Title -->
        <div class="flex flex-col gap-1">
          <label>সংবাদ শিরোনাম</label>
          <input
            v-model="title"
            type="text"
            placeholder="সংবাদ শিরোনাম লিখুন"
            :class="['w-full h-12 rounded px-4 py-2 shadow-sm transition-all duration-150 outline-none',
                     errors.title ? 'border-red-500 bg-red-50' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white focus:ring-1 focus:ring-green-500']"
          />
          <span v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</span>
        </div>

        <!-- Featured Image -->
        <div class="flex flex-col gap-4">
          <div v-if="!featured.hasImage" class="flex flex-col gap-1">
            <label>প্রধান ছবি</label>
            <button
              type="button"
              @click="openImageModal('featured')"
              class="cursor-pointer relative inline-flex items-center justify-center p-[0.125rem] rounded-md overflow-hidden"
              :class="errors.featured ? 'border border-red-500 bg-red-50' : ''"
            >
              <span class="absolute inset-0 rounded-md p-[0.125rem] bg-[conic-gradient(from_0deg,#f97316,#f59e0b,#eab308,#84cc16,#22c55e,#10b981,#14b8a6,#06b6d4,#0ea5e9,#3b82f6,#6366f1,#8b5cf6,#a855f7,#d946ef,#ec4899,#f43f5e,#f97316)] animate-spin-slow"></span>
              <span class="relative bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md p-[0.125rem] w-full h-12 flex items-center justify-center gap-2 transition-all">
                <Icon icon="bytesize:upload" class="text-2xl text-gray-900 dark:text-white" /> ছবি আপলোড করুন
              </span>
            </button>
            <span v-if="errors.featured" class="text-red-500 text-sm">{{ errors.featured }}</span>
          </div>

          <div v-if="featured.hasImage" class="relative">
            <img :src="featured.url" class="w-full max-h-40 object-contain rounded" />
            <button
              type="button"
              @click="removeFeaturedImage"
              class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
            >
              <Icon icon="solar:close-circle-linear" class="text-2xl" /> Remove
            </button>
            <p class="text-sm text-gray-600 mt-1">Caption: {{ featured.caption }}</p>
            <p class="text-sm text-gray-600 mt-1">Source: {{ featured.source }}</p>
          </div>
        </div>

        <!-- Home Card Text -->
        <div class="flex flex-col gap-1">
          <label>হোম কার্ড টেক্সট</label>
          <textarea
            v-model="homeCardText"
            placeholder="হোম কার্ড টেক্সট লিখুন"
            :class="['w-full rounded px-4 py-2 shadow-sm transition-all duration-150 outline-none resize-none min-h-40',
                     errors.homeCardText ? 'border-red-500 bg-red-50' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white focus:ring-1 focus:ring-green-500']"
          ></textarea>
          <span v-if="errors.homeCardText" class="text-red-500 text-sm">{{ errors.homeCardText }}</span>
        </div>

        <!-- Dynamic Content Blocks -->
        <div v-for="(block, index) in contentBlocks" :key="index" class="relative flex flex-col gap-4">
          <!-- CustomSelects: শুধু তখনই দেখাবে যখন type না আছে -->
          <CustomSelect
            v-if="!block.type"
            v-model="block.type"
            :options="typeOptions"
            placeholder="ব্লক নির্বাচন করুন"
            class="w-full"
          />

          <!-- Text Block -->
          <div v-if="block.type === 'text'" class="flex flex-col gap-1">
            <label>সংবাদ পোস্ট</label>
            <textarea
              v-model="block.text"
              placeholder="সংবাদ পোস্ট লিখুন"
              :class="['w-full rounded px-4 py-2 shadow-sm transition-all duration-150 outline-none resize-none min-h-96',
                        errors.blocks && errors.blocks[index] && errors.blocks[index].text ? 'border-red-500 bg-red-50' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white focus:ring-1 focus:ring-green-500']"
            ></textarea>
            <span v-if="errors.blocks && errors.blocks[index] && errors.blocks[index].text" class="text-red-500 text-sm">
              {{ errors.blocks[index].text }}
            </span>
            <button type="button" @click="removeBlock(index)" class="mt-2 w-24 text-xs px-2 py-1 bg-red-600 text-white rounded">
              ✕ Remove
            </button>
          </div>

          <!-- Subtitle Block -->
          <div v-if="block.type === 'subtitle'">
            <input
              v-model="block.text"
              type="text"
              placeholder="সাবটাইটেল লিখুন"
              :class="['w-full rounded px-4 py-2 shadow-sm transition-all duration-150 outline-none',
                        errors.blocks && errors.blocks[index] && errors.blocks[index].text ? 'border-red-500 bg-red-50' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white focus:ring-1 focus:ring-green-500']"
            />
            <span v-if="errors.blocks && errors.blocks[index] && errors.blocks[index].text" class="text-red-500 text-sm">
              {{ errors.blocks[index].text }}
            </span>
            <button type="button" @click="removeBlock(index)" class="mt-2 w-24 text-xs px-2 py-1 bg-red-600 text-white rounded">
              ✕ Remove
            </button>
          </div>

          <!-- Image Block -->
          <div v-if="block.type === 'image'">
            <button v-if="!block.hasImage" type="button" @click="openImageModal(index)"
              class="w-full h-12 flex items-center justify-center gap-2 border border-sky-500 rounded shadow-md bg-sky-50 dark:bg-sky-700 hover:bg-sky-100 dark:hover:bg-sky-600 transition-all duration-150"
              :class="errors.blocks && errors.blocks[index] && errors.blocks[index].image ? 'border-red-500 bg-red-50' : ''"
            >
              <Icon icon="mingcute:upload-3-fill" class="text-2xl" /> ছবি আপলোড করুন
            </button>

            <div v-if="block.hasImage" class="mt-2 relative">
              <img :src="block.url" class="w-full max-h-40 object-contain rounded" />
              <button type="button" @click="removeBlock(index)" class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
                ✕ Remove
              </button>
              <p class="text-sm text-gray-600 mt-1">Caption: {{ block.caption }}</p>
              <p class="text-sm text-gray-600 mt-1">Source: {{ block.source }}</p>
            </div>
            <span v-if="errors.blocks && errors.blocks[index] && errors.blocks[index].image" class="text-red-500 text-sm">
              {{ errors.blocks[index].image }}
            </span>
          </div>
        </div>

        <div class="flex gap-2 mb-20">
          <button type="button" @click="addBlock" class="font-baloda w-full flex items-center justify-center gap-2 h-12 text-md md:text-lg px-6 py-2 border border-indigo-500 dark:border-indigo-400 rounded shadow-sm focus:ring-1 hover:ring-1 hover:ring-indigo-500 bg-indigo-50 dark:bg-indigo-900 transition-all duration-150">
            <Icon icon="subway:add" class="text-xl" /> সংবাদ ব্লক যোগ করুন
          </button>
        </div>

        <!-- Buttons -->
        <div class="flex items-center justify-center gap-3">
          <button type="button" @click="saveDraft" :disabled="loading" class="font-hind flex items-center justify-center gap-2 h-12 text-md md:text-lg px-4 py-2 border border-cyan-500 dark:border-cyan-400 rounded shadow-md focus:ring-1 hover:ring-1 hover:ring-cyan-500 bg-gray-50 dark:bg-cyan-700 transition-all duration-150">
            <Icon icon="ic:baseline-save" class="text-2xl" /> সংবাদ সংরক্ষণ করুন
          </button>

          <button type="submit" :disabled="loading" class="flex items-center justify-center gap-2 h-12 text-md md:text-lg px-6 py-2 border border-green-500 dark:border-green-400 rounded shadow-sm focus:ring-1 hover:ring-1 hover:ring-green-500 bg-green-50 dark:bg-green-900 transition-all duration-150">
            <Icon icon="lets-icons:done-ring-round-duotone-line" class="text-2xl" /> {{ submitButtonLabel }}
          </button>
        </div>
      </form>
    </client-only>

    <!-- Image Upload Modal -->
    <client-only>
      <ImageUploadModal v-model:visible="imageModalVisible" @submit="handleImageInsert" />
    </client-only>
  </section>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'admin' })
import { Icon } from '@iconify/vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~~/store/auth.store';
import { useCategoriesStore } from '~~/store/categories.store';
import { useDraftsStore } from '~~/store/drafts.store';
import { useNewsStore } from '~~/store/news.store';
import { useTagsStore } from '~~/store/tags.store';

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const newsStore = useNewsStore()
const draftsStore = useDraftsStore()
const categoriesStore = useCategoriesStore()
const tagsStore = useTagsStore()

const pageTitle = ref('সংবাদ তৈরি করুন')
const typeOptions = ref([
  { label: 'টেক্সট ব্লক', value: 'text' },
  { label: 'সাবটাইটেল', value: 'subtitle' },
  { label: 'ইমেজ', value: 'image' }
])

const selectedNewsType = ref([])
const selectedNewsTag = ref([])
const title = ref('')
const homeCardText = ref('')
const featured = ref({ url: '', caption: '', source: '', file: null, hasImage: false })
const contentBlocks = ref<any[]>([])
const imageModalVisible = ref(false)
const currentBlockIndex = ref<number | 'featured' | null>(null)
const errors = ref<any>({
  title: '', homeCardText: '', featured: '', categories: '', tags: '', blocks: []
})

const categoryOptions = computed(() =>
  categoriesStore.categories.map((c: any) => ({ label: c.name, value: c.id }))
)
const tagOptions = computed(() =>
  tagsStore.tags.map((t: any) => ({ label: t.name, value: t.id }))
)
const loading = computed(() => newsStore.loading || draftsStore.loading)
const submitButtonLabel = computed(() =>
  authStore.user?.role === 'super_admin' ? 'সংবাদ প্রকাশ করুন' : 'সংবাদ সাবমিট করুন'
)

const IMAGE_PREVIEW_STORAGE_KEY = 'news_image_previews'

// Restore featured & image blocks on mounted
onMounted(() => {
  if (!categoriesStore.categories.length) categoriesStore.fetchCategories()
  if (!tagsStore.tags.length) tagsStore.fetchTags()

  const saved = localStorage.getItem(IMAGE_PREVIEW_STORAGE_KEY)
  if (saved) {
    const parsed = JSON.parse(saved)
    if (parsed.featured) featured.value = parsed.featured
    if (parsed.blocks) {
      parsed.blocks.forEach((block: any, i: number) => {
        if (!contentBlocks.value[i]) contentBlocks.value.push({})
        contentBlocks.value[i] = { ...contentBlocks.value[i], ...block }
      })
    }
  }
})

// Watch featured image
watch(featured, () => {
  const data = JSON.parse(localStorage.getItem(IMAGE_PREVIEW_STORAGE_KEY) || '{}')
  if (featured.value.hasImage) data.featured = featured.value
  else delete data.featured
  localStorage.setItem(IMAGE_PREVIEW_STORAGE_KEY, JSON.stringify(data))
}, { deep: true })

// Watch image blocks only
watch(contentBlocks, () => {
  const imageBlocks = contentBlocks.value
    .map((b: any) => (b.type === 'image' && b.hasImage ? b : null))
    .filter(Boolean)

  const data = JSON.parse(localStorage.getItem(IMAGE_PREVIEW_STORAGE_KEY) || '{}')
  if (imageBlocks.length) data.blocks = imageBlocks
  else delete data.blocks
  localStorage.setItem(IMAGE_PREVIEW_STORAGE_KEY, JSON.stringify(data))
}, { deep: true })

function addBlock() {
  contentBlocks.value.push({ type: '', text: '', url: '', caption: '', source: '', file: null, hasImage: false })
  errors.value.blocks.push({})
}

function removeBlock(index: number) {
  contentBlocks.value.splice(index, 1)
  errors.value.blocks.splice(index, 1)
}

function removeFeaturedImage() {
  featured.value = { url: '', caption: '', source: '', file: null, hasImage: false }
}

function openImageModal(index: number | 'featured') {
  currentBlockIndex.value = index
  imageModalVisible.value = true
}

function handleImageInsert(payload: any) {
  if (currentBlockIndex.value === 'featured') {
    featured.value = { 
      url: payload.url, 
      caption: payload.caption, 
      source: payload.source, 
      file: payload.file,
      hasImage: true
    }
  } else if (typeof currentBlockIndex.value === 'number') {
    contentBlocks.value[currentBlockIndex.value] = {
      type: 'image',
      url: payload.url,
      caption: payload.caption,
      source: payload.source,
      file: payload.file,
      hasImage: true
    }
  }
  currentBlockIndex.value = null
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/uploads', { method: 'POST', body: formData })
  if (!res.ok) return URL.createObjectURL(file)
  const data = await res.json()
  return data.url || ''
}

function validateForm() {
  let valid = true
  errors.value = { title: '', homeCardText: '', featured: '', categories: '', tags: '', blocks: [] }

  if (!title.value.trim()) { errors.value.title = 'শিরোনাম আবশ্যক'; valid = false }
  if (!homeCardText.value.trim()) { errors.value.homeCardText = 'হোম কার্ড টেক্সট আবশ্যক'; valid = false }
  if (!featured.value.hasImage) { errors.value.featured = 'প্রধান ছবি আবশ্যক'; valid = false }
  if (!selectedNewsType.value.length) { errors.value.categories = 'সংবাদ ধরন আবশ্যক'; valid = false }
  if (!selectedNewsTag.value.length) { errors.value.tags = 'সংবাদ ট্যাগ আবশ্যক'; valid = false }

  contentBlocks.value.forEach((b: any, idx: number) => {
    errors.value.blocks[idx] = {}
    if (b.type === 'text' && !b.text?.trim()) { errors.value.blocks[idx].text = 'টেক্সট ব্লক ফাঁকা হতে পারবে না'; valid = false }
    if (b.type === 'subtitle' && !b.text?.trim()) { errors.value.blocks[idx].text = 'সাবটাইটেল ফাঁকা হতে পারবে না'; valid = false }
    if (b.type === 'image' && !b.hasImage) { errors.value.blocks[idx].image = 'ইমেজ আবশ্যক'; valid = false }
  })

  return valid
}

async function buildPayloadForNewsOrDraft() {
  let featuredUrl = featured.value.url || ''
  if (featured.value.file) featuredUrl = await uploadFile(featured.value.file)

  const normalizedBlocks = await Promise.all(
    contentBlocks.value.map(async (b: any) => {
      if (b.type === 'image') {
        let url = b.url
        if (b.file) url = await uploadFile(b.file)
        return { type: 'image', url, caption: b.caption, source: b.source }
      } else if (b.type === 'subtitle') {
        return { type: 'subtitle', text: b.text }
      } else {
        return { type: 'text', text: b.text }
      }
    })
  )

  return {
    title: title.value,
    home_card_text: homeCardText.value,
    featured_image: {
      url: featuredUrl,
      caption: featured.value.caption,
      source: featured.value.source
    },
    categories: selectedNewsType.value.map((c: any) => c.value),
    tags: selectedNewsTag.value.map((t: any) => t.value),
    content_blocks: normalizedBlocks,
    author: {
      id: authStore.user?.id ?? 'unknown_user',
      name: authStore.user?.name ?? 'Anonymous'
    },
    created_at: new Date().toISOString()
  }
}

async function saveDraft() {
  if (!validateForm()) return
  try {
    const payload = await buildPayloadForNewsOrDraft()
    await draftsStore.createDraft(payload)
    toast.success('সংবাদ সফলভাবে খসড়া হিসেবে সংরক্ষণ হয়েছে!')
    localStorage.removeItem(IMAGE_PREVIEW_STORAGE_KEY)
    router.push('/admin/drafts/')
  } catch (err: any) {
    toast.error(err?.message || 'খসড়া সংরক্ষণ ব্যর্থ হয়েছে!')
  }
}

async function publishContent() {
  if (!validateForm()) return
  try {
    const payload = await buildPayloadForNewsOrDraft()
    const response = await newsStore.createNews(payload)
    if (!response?.data) return toast.error('সংবাদ তৈরি করা যায়নি!')

    toast.success(authStore.user?.role === 'super_admin'
      ? 'সংবাদ প্রকাশ হয়েছে!'
      : 'সংবাদ পর্যালোচনায় পাঠানো হয়েছে!')
    localStorage.removeItem(IMAGE_PREVIEW_STORAGE_KEY)
    router.push('/admin/news/')
  } catch (err: any) {
    toast.error(err?.message || 'সংবাদ প্রকাশ ব্যর্থ হয়েছে!')
  }
}
</script>
