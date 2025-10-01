<template>
  <client-only>
    <div class="editor-container scrollbar-none">
      <!-- Bubble Menu -->
      <BubbleMenu
        v-if="editor"
        :editor="editor"
        :tippy-options="{ duration: 100 }"
        class="bubble-menu-style"
      >
        <button
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <Icon icon="ic:round-format-bold" />
        </button>
        <button
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <Icon icon="ic:round-format-italic" />
        </button>
        <button
          :class="{ 'is-active': editor.isActive('link') }"
          @click="setLink"
        >
          <Icon icon="ic:round-link" />
        </button>
      </BubbleMenu>

      <!-- Toolbar -->
      <div v-if="editor" class="toolbar">
        <div class="toolbar-group">
          <CustomSelects
            :model-value="
              editor?.getAttributes('textStyle').fontFamily || defaultFontFamily
            "
            :options="fontOptions.map((f) => ({ label: f, value: f }))"
            @update:model-value="setFontFamily"
            class="w-auto"
          />

          <button
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          >
            H1
          </button>

          <button
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          >
            H2
          </button>

          <button
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          >
            H3
          </button>

          <button
            @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
          >
            H4
          </button>

          <button
            @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
          >
            H5
          </button>

          <button
            @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
          >
            H6
          </button>

          <button
            @click="editor.chain().focus().setParagraph().run()"
            :class="{ 'is-active': editor.isActive('paragraph') }"
          >
            Paragraph
          </button>
        </div>

        <div class="toolbar-group">
          <button
            v-tooltip="'বোল্ড'"
            :class="{ 'is-active': editor.isActive('bold') }"
            @click="editor.chain().focus().toggleBold().run()"
          >
            <Icon icon="ic:round-format-bold" />
          </button>

          <button
            v-tooltip="'ইটালিক'"
            :class="{ 'is-active': editor.isActive('italic') }"
            @click="editor.chain().focus().toggleItalic().run()"
          >
            <Icon icon="ic:round-format-italic" />
          </button>

          <button
            v-tooltip="'আন্ডারলাইন'"
            :class="{ 'is-active': editor.isActive('underline') }"
            @click="editor.chain().focus().toggleUnderline().run()"
          >
            <Icon icon="ic:round-format-underlined" />
          </button>

          <button
            v-tooltip="'স্ট্রাইক'"
            :class="{ 'is-active': editor.isActive('strike') }"
            @click="editor.chain().focus().toggleStrike().run()"
          >
            <Icon icon="ic:round-format-strikethrough" />
          </button>

          <button
            v-tooltip="'হাইলাইট'"
            :class="{ 'is-active': editor.isActive('highlight') }"
            @click="editor.chain().focus().toggleHighlight().run()"
          >
            <Icon icon="ic:round-highlight" />
          </button>

          <button
            v-tooltip="'ব্লককোট'"
            :class="{ 'is-active': editor.isActive('blockquote') }"
            @click="editor.chain().focus().toggleBlockquote().run()"
          >
            <Icon icon="ic:round-format-quote" />
          </button>

          <button
            v-tooltip="'কোডব্লক'"
            @click="editor.chain().focus().setCodeBlock().run()"
            :class="{ 'is-active': editor.isActive('codeblock') }"
          >
            <Icon icon="fluent:code-block-48-regular" />
          </button>

          <button
            v-tooltip="'হরাইজন্টাল রোলার'"
            @click="editor.chain().focus().setHorizontalRule().run()"
            :class="{ 'is-active': editor.isActive('horizontalrule') }"
          >
            <Icon icon="codicon:horizontal-rule" />
          </button>
        </div>

        <div class="toolbar-group">
          <button
            v-tooltip="'বুলেট লিস্ট'"
            :class="{ 'is-active': editor.isActive('bulletList') }"
            @click="editor.chain().focus().toggleBulletList().run()"
          >
            <Icon icon="ic:round-list" />
          </button>

          <button
            v-tooltip="'অর্ডার্ড লিস্ট'"
            :class="{ 'is-active': editor.isActive('orderedList') }"
            @click="editor.chain().focus().toggleOrderedList().run()"
          >
            <Icon icon="ic:round-format-list-numbered" />
          </button>

          <button
            v-tooltip="'টাস্ক লিস্ট'"
            :class="{ 'is-active': editor.isActive('taskList') }"
            @click="editor.chain().focus().toggleTaskList().run()"
          >
            <Icon icon="ic:round-task" />
          </button>
        </div>

        <div class="toolbar-group">
          <button @click="openImageFileInput" v-tooltip="'ইমেজ আপলোড'">
            <Icon icon="ic:round-image" />
          </button>

          <button @click="addYoutubeVideo" v-tooltip="'ইউটিউব ভিডিও আপলোড'">
            <Icon icon="ic:round-ondemand-video" />
          </button>

          <button
            v-tooltip="'লিংক সেট করুন'"
            :class="{ 'is-active': editor.isActive('link') }"
            @click="setLink"
          >
            <Icon icon="ic:round-link" />
          </button>
        </div>

        <div class="toolbar-group">
          <button
            @click="editor.chain().focus().undo().run()"
            v-tooltip="'পূর্বাবস্থায় ফিরে যান'"
          >
            <Icon icon="ic:round-undo" />
          </button>

          <button
            @click="editor.chain().focus().redo().run()"
            v-tooltip="'পুনরায় ফিরে যান'"
          >
            <Icon icon="ic:round-redo" />
          </button>
        </div>
      </div>

      <!-- Hidden File Input -->
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileInputChange"
      />

      <!-- Editor Content -->
      <EditorContent :editor="editor" class="editor-content-area" />

      <!-- Character Count -->
      <div v-if="editor" class="char-count">
        {{ editor.storage.characterCount.characters() }}/{{ MAX_CHARACTERS }}
        Characters
      </div>

      <!-- Image Modal -->
      <VueFinalModal
        v-model="imageModalVisible"
        :clickToClose="false"
        :escToClose="true"
        class="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
      >
        <div
          class="p-8 bg-white dark:bg-dark-divider rounded-lg shadow-lg max-w-96 text-center"
        >
          <h3 class="text-lg font-bold mb-2">Image Details</h3>
          <input
            type="text"
            v-model="imageForm.caption"
            placeholder="Caption"
            class="w-full mb-2 p-1 border border-slate-500 bg-transparent focus:outline-none focus:border-green-500 transition-colors duration-400"
          />
          <input
            type="text"
            v-model="imageForm.source"
            placeholder="Source"
            class="w-full mb-2 p-1 border border-slate-500 bg-transparent focus:outline-none focus:border-green-500 transition-colors duration-400"
          />
          <div class="flex justify-end gap-2">
            <button
              @click="imageModalVisible = false"
              class="px-3 py-1 border rounded"
            >
              Cancel
            </button>
            <button
              @click="submitImageModal"
              class="px-3 py-1 bg-green-600 text-white rounded"
            >
              Insert
            </button>
          </div>
        </div>
      </VueFinalModal>

      <!-- YouTube Modal -->
      <VueFinalModal
        v-model="youtubeModalVisible"
        :clickToClose="false"
        :escToClose="true"
        class="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
      >
        <div
          class="p-8 bg-white dark:bg-dark-divider rounded-lg shadow-lg max-w-96 text-center"
        >
          <h3 class="text-lg font-bold mb-2">YouTube Video Details</h3>
          <input
            type="text"
            v-model="youtubeForm.url"
            placeholder="Video URL"
            class="w-full mb-2 p-1 border border-slate-500 bg-transparent focus:outline-none focus:border-green-500 transition-colors duration-400"
          />
          <input
            type="text"
            v-model="youtubeForm.caption"
            placeholder="Caption"
            class="w-full mb-2 p-1 border border-slate-500 bg-transparent focus:outline-none focus:border-green-500 transition-colors duration-400"
          />
          <input
            type="text"
            v-model="youtubeForm.source"
            placeholder="Source"
            class="w-full mb-2 p-1 border border-slate-500 bg-transparent focus:outline-none focus:border-green-500 transition-colors duration-400"
          />
          <input
            type="text"
            v-model="youtubeForm.videoLength"
            placeholder="Video Length"
            class="w-full mb-2 p-1 border border-slate-500 bg-transparent focus:outline-none focus:border-green-500 transition-colors duration-400"
          />
          <div class="flex justify-end gap-2">
            <button
              @click="youtubeModalVisible = false"
              class="px-3 py-1 border rounded"
            >
              Cancel
            </button>
            <button
              @click="submitYoutubeModal"
              class="px-3 py-1 bg-green-600 text-white rounded"
            >
              Insert
            </button>
          </div>
        </div>
      </VueFinalModal>
    </div>
  </client-only>
</template>

<script lang="ts" setup>
  import { Icon } from '@iconify/vue';
  import { CharacterCount } from '@tiptap/extension-character-count';
  import { FontFamily } from '@tiptap/extension-font-family';
  import { Highlight } from '@tiptap/extension-highlight';
  import { Image } from '@tiptap/extension-image';
  import { Link } from '@tiptap/extension-link';
  import Placeholder from '@tiptap/extension-placeholder';
  import { TaskItem } from '@tiptap/extension-task-item';
  import { TaskList } from '@tiptap/extension-task-list';
  import { TextStyle } from '@tiptap/extension-text-style';
  import Youtube from '@tiptap/extension-youtube';
  import StarterKit from '@tiptap/starter-kit';
  import {
    Editor,
    EditorContent,
    useEditor,
    type JSONContent,
  } from '@tiptap/vue-3';
  import { BubbleMenu } from '@tiptap/vue-3/menus';
  import { onBeforeUnmount, ref, watch } from 'vue';
  import { VueFinalModal } from 'vue-final-modal';

  import { useDraftsStore } from '~~/store/drafts.store';

  type PlaceholderContent = (options: {
    node: any;
    editor: Editor;
    pos: number;
  }) => string | false | null | undefined;

  const MAX_CHARACTERS = 100000;
  const defaultFontFamily = ref('Noto Serif Bengali');
  const fontOptions = ref([
    'Noto Serif Bengali',
    'Tiro Bangla',
    'Hind Siliguri',
    'Baloo Da 2',
  ]);

  const fileInputRef = ref<HTMLInputElement | null>(null);
  const imageModalVisible = ref(false);
  const youtubeModalVisible = ref(false);

  const imageForm = ref<{ caption: string; source: string; file: File | null }>(
    { caption: '', source: '', file: null }
  );
  const youtubeForm = ref<{
    url: string;
    caption: string;
    source: string;
    videoLength: string;
  }>({ url: '', caption: '', source: '', videoLength: '' });

  const draftsStore = useDraftsStore();

  const initialContent: JSONContent = {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: '\u200B' }],
      },
    ],
  };

  interface Props {
    modelValue: JSONContent;
  }
  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'update:modelValue', content: JSONContent): void;
  }>();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false }),
      Image,
      Youtube,
      TextStyle,
      FontFamily.configure({ types: ['textStyle'] }),
      TaskList,
      TaskItem,
      Highlight,
      Placeholder.configure({
        placeholder: 'সংবাদ লিখা শুরু করুন...',
      }),
      CharacterCount.configure({ limit: MAX_CHARACTERS }),
    ],
    content:
      props.modelValue?.type === 'doc' ? props.modelValue : initialContent,
    onUpdate: ({ editor }) => {
      emit('update:modelValue', editor.getJSON());
      draftsStore.updateCurrentDraftContent(editor.getJSON());
    },
    onCreate: ({ editor }) => {
      editor.chain().focus().setHeading({ level: 1 }).run();
    },
  });

  watch(
    () => props.modelValue,
    (newVal) => {
      if (!editor.value) return;
      const normalizedValue = newVal?.type === 'doc' ? newVal : initialContent;
      const current = editor.value.getJSON();
      if (JSON.stringify(normalizedValue) !== JSON.stringify(current)) {
        editor.value.commands.setContent(normalizedValue, {
          emitUpdate: false,
        });
      }
    },
    { deep: true }
  );

  // Image handlers
  const openImageFileInput = () => fileInputRef.value?.click();
  const handleFileInputChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    imageForm.value = { caption: '', source: '', file };
    imageModalVisible.value = true;
    if (fileInputRef.value) fileInputRef.value.value = '';
  };
  const submitImageModal = () => {
    if (!editor.value || !imageForm.value.file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      editor.value
        ?.chain()
        .focus()
        .setImage({ src: base64, ...imageForm.value })
        .run();
      imageModalVisible.value = false;
    };
    reader.readAsDataURL(imageForm.value.file);
  };

  // YouTube handlers
  const addYoutubeVideo = () => {
    youtubeForm.value = { url: '', caption: '', source: '', videoLength: '' };
    youtubeModalVisible.value = true;
  };
  const submitYoutubeModal = () => {
    if (!editor.value || !youtubeForm.value.url) return;
    (editor.value?.commands as any).setYoutube({
      src: youtubeForm.value.url,
      caption: youtubeForm.value.caption,
      source: youtubeForm.value.source,
      videoLength: youtubeForm.value.videoLength,
    });
    youtubeModalVisible.value = false;
  };

  // Font & link
  const setFontFamily = (font: string) =>
    editor.value?.chain().focus().setFontFamily(font).run();
  const setLink = () => {
    if (!editor.value) return;
    const previousUrl = editor.value.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl ?? '');
    if (url === null) return;
    if (url === '') {
      editor.value.chain().focus().unsetLink().run();
      return;
    }
    const formattedUrl =
      /^https?:\/\//i.test(url) || /^mailto:/i.test(url) || /^tel:/i.test(url)
        ? url
        : `http://${url}`;
    editor.value.chain().focus().setLink({ href: formattedUrl }).run();
  };

  onBeforeUnmount(() => editor.value?.destroy());
</script>

<style scoped lang="scss">
  .editor-container {
    @apply border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg relative max-h-[40rem] overflow-auto;
  }
  .editor-content-area {
    @apply min-h-[40rem] max-h-[50rem] p-6 border border-green-500 dark:border-slate-700 focus:outline-none;
  }
  .tiptap,
  .ProseMirror {
    @apply min-h-[40rem] max-h-[50rem] p-6 border border-green-500 dark:border-slate-700 focus:outline-none;
  }
  .toolbar {
    @apply sticky top-0 z-10 flex flex-wrap gap-2 p-2 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md;
  }
  .toolbar-group {
    @apply flex gap-1 pr-3 border-r border-gray-300 dark:border-gray-700;
  }
  .toolbar-group:last-child {
    border-right: none;
  }
  .toolbar button {
    @apply bg-transparent border border-transparent px-2 py-1 cursor-pointer rounded-lg text-sm text-gray-700 dark:text-gray-200 flex items-center justify-center transition-all duration-200;
  }
  .toolbar button:hover {
    @apply bg-gray-100 dark:bg-gray-700;
  }
  .toolbar button.is-active {
    @apply bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700;
  }
  .bubble-menu-style {
    @apply flex bg-gray-800 dark:bg-gray-900 p-2 rounded-xl gap-2 shadow-2xl z-50;
  }
  .bubble-menu-style button {
    @apply p-2 rounded-lg text-white;
  }
  .bubble-menu-style button:hover {
    @apply bg-gray-600 dark:bg-gray-700;
  }
  .bubble-menu-style button.is-active {
    @apply bg-green-500 hover:bg-green-500;
  }
  .char-count {
    @apply p-3 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-300 dark:border-gray-700;
  }
</style>
