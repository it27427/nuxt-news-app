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
              <label for="tagsselect">সংবাদ ধরন</label>
              <CustomSelect
                v-model="selectedNewsType"
                :options="categoryOptions"
                placeholder="সংবাদ ধরন নির্বাচন করুন"
                multiple
              />
            </div>
          </div>

          <div class="w-full md:w-1/2">
            <div class="flex flex-col gap-1">
              <label for="tagsselect">সংবাদ ট্যাগ</label>
              <CustomSelect
                id="tagsselect"
                v-model="selectedNewsTag"
                :options="tagOptions"
                placeholder="ট্যাগ নির্বাচন করুন"
                multiple
              />
            </div>
          </div>
        </div>

        <!-- Title -->
        <div class="flex flex-col gap-1">
          <label for="newstitle">সংবাদ শিরোনাম</label>

          <input
            id="newstitle"
            v-model="title"
            type="text"
            placeholder="সংবাদ শিরোনাম লিখুন"
            class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded px-4 py-2 gap-2 shadow-sm ring-1 focus:ring-green-500 active:ring-green-500 focus:border-green-500 active:border-green-500 focus:bg-green-50 dark:focus:bg-green-900 transition-all duration-150 outline-none"
          />
        </div>

        <!-- Featured Image -->
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label>প্রধান ছবি</label>
            <button
              type="button"
              @click="openImageModal('featured')"
              class="relative inline-flex items-center justify-center p-[0.125rem] rounded-md overflow-hidden"
            >
              <span class="absolute inset-0 rounded-md p-[0.125rem] bg-[conic-gradient(from_0deg,#f97316,#f59e0b,#eab308,#84cc16,#22c55e,#10b981,#14b8a6,#06b6d4,#0ea5e9,#3b82f6,#6366f1,#8b5cf6,#a855f7,#d946ef,#ec4899,#f43f5e,#f97316)] animate-spin-slow"></span>

              <span class="relative bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md p-[0.125rem] w-full h-12 flex items-center justify-center">
                ছবি আপলোড করুন
              </span>
            </button>
          </div>

          <div v-if="featured.url" class="relative">
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

        <!-- Home Card Text -->
        <div class="flex flex-col gap-1">
          <label for="homecard">হোম কার্ড টেক্সট</label>
          <textarea
            id="homecard"
            v-model="homeCardText"
            placeholder="হোম কার্ড টেক্সট লিখুন"
            class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded px-4 py-2 gap-2 shadow-sm ring-1 focus:ring-green-500 active:ring-green-500 focus:border-green-500 active:border-green-500 focus:bg-green-50 dark:focus:bg-green-900 transition-all duration-150 outline-none resize-none min-h-40"
          ></textarea>
        </div>

        <!-- Dynamic Content Blocks -->
        <div
          v-for="(block, index) in contentBlocks"
          :key="index"
          class="relative flex flex-col gap-4"
        >
          <CustomSelects
            v-model="block.type"
            :options="typeOptions"
            placeholder="ব্লক নির্বাচন করুন"
            class="w-full"
          />

          <!-- Text -->
          <div v-if="block.type === 'text'" class="flex flex-col gap-1">
            <label for="posttexts">সংবাদ পোস্ট</label>
            <textarea
              id="posttexts"
              v-model="block.text"
              placeholder="সংবাদ পোস্ট লিখুন"
              class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded px-4 py-2 gap-2 shadow-sm ring-1 focus:ring-green-500 active:ring-green-500 focus:border-green-500 active:border-green-500 focus:bg-green-50 dark:focus:bg-green-900 transition-all duration-150 outline-none resize-none min-h-96"
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
              class="font-semibold font-hind text-md md:text-lg px-4 py-2 border border-sky-500 dark:border-sky-400 rounded shadow-md focus:ring-1 hover:ring-1 hover:ring-sky-500 bg-sky-50 dark:bg-sky-700 focus:ring-sky-500 active:ring-sky-500 focus:border-sky-500 active:border-sky-500 focus:bg-sky-50 dark:focus:bg-sky-700 transition-all duration-150"
            >
              ছবি আপলোড করুন
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
        <div class="flex items-center justify-center gap-3">
          <button
            type="button"
            @click="saveDraft"
            :disabled="loading"
            class="font-semibold font-hind text-md md:text-lg px-4 py-2 border border-cyan-500 dark:border-cyan-400 rounded shadow-md focus:ring-1 hover:ring-1 hover:ring-cyan-500 bg-gray-50 dark:bg-cyan-700 focus:ring-cyan-500 active:ring-cyan-500 focus:border-cyan-500 active:border-cyan-500 focus:bg-cyan-50 dark:focus:bg-cyan-700 transition-all duration-150"
          >
            সংবাদ সংরক্ষণ করুন
          </button>

          <button
            type="submit"
            :disabled="loading"
            class="font-semibold text-md md:text-lg px-6 py-2 border border-green-500 dark:border-green-400 rounded shadow-sm focus:ring-1 hover:ring-1 hover:ring-green-500 bg-red-50 dark:bg-green-900 focus:ring-green-500 active:ring-green-500 focus:border-green-500 active:border-green-500 focus:bg-green-50 dark:focus:bg-green-900 transition-all duration-150"
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

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const newsStore = useNewsStore()
const draftsStore = useDraftsStore()
const categoriesStore = useCategoriesStore()
const tagsStore = useTagsStore()

const pageTitle = ref('সংবাদ তৈরি করুন')

// ব্লক টাইপ অপশনস (label = বাংলা, value = ইংরেজি)
const typeOptions = ref([
  { label: 'টেক্সট ব্লক', value: 'text' },
  { label: 'সাবটাইটেল', value: 'subtitle' },
  { label: 'ইমেজ', value: 'image' }
])

const selectedNewsType = ref([])
const selectedNewsTag = ref([])
const title = ref('')
const homeCardText = ref('')
const featured = ref({ url: '', caption: '', source: '', file: null })
const contentBlocks = ref<any[]>([])
const imageModalVisible = ref(false)
const currentBlockIndex = ref<number | 'featured' | null>(null)

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

onMounted(async () => {
  if (!categoriesStore.categories.length) await categoriesStore.fetchCategories()
  if (!tagsStore.tags.length) await tagsStore.fetchTags()
})

/* Block Functions */
function addBlock() {
  contentBlocks.value.push({ type: '', text: '', url: '', caption: '', source: '', file: null })
}
function removeBlock(index: number) {
  contentBlocks.value.splice(index, 1)
}
function removeFeaturedImage() {
  featured.value = { url: '', caption: '', source: '', file: null }
}

/* Modal Open */
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

/* Upload Helper */
async function uploadFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/uploads', { method: 'POST', body: formData })
  if (!res.ok) return URL.createObjectURL(file)
  const data = await res.json()
  return data.url || ''
}

/* Build Payload */
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

/* Save Draft */
async function saveDraft() {
  try {
    const payload = await buildPayloadForNewsOrDraft()
    await draftsStore.createDraft(payload)
    toast.success('সংবাদ সফলভাবে খসড়া হিসেবে সংরক্ষণ হয়েছে!')
    router.push('/admin/drafts/')
  } catch (err: any) {
    toast.error(err?.message || 'খসড়া সংরক্ষণ ব্যর্থ হয়েছে!')
  }
}

/* Publish */
async function publishContent() {
  try {
    const payload = await buildPayloadForNewsOrDraft()
    if (!payload.title.trim()) return toast.error('শিরোনাম লিখুন!')
    if (!payload.categories.length) return toast.error('অন্তত একটি ক্যাটেগরি নির্বাচন করুন!')
    if (!payload.content_blocks.length) return toast.error('কমপক্ষে একটি ব্লক যোগ করুন!')

    const response = await newsStore.createNews(payload)
    if (!response?.data) return toast.error('সংবাদ তৈরি করা যায়নি!')

    toast.success(authStore.user?.role === 'super_admin'
      ? 'সংবাদ প্রকাশ হয়েছে!'
      : 'সংবাদ পর্যালোচনায় পাঠানো হয়েছে!')
    router.push('/admin/news/')
  } catch (err: any) {
    toast.error(err?.message || 'সংবাদ প্রকাশ ব্যর্থ হয়েছে!')
  }
}
</script>

