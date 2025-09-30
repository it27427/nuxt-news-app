<template>
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
        @click="editor?.chain().focus().toggleBold().run()"
      >
        <Icon icon="ic:round-format-bold" />
      </button>
      <button
        :class="{ 'is-active': editor.isActive('italic') }"
        @click="editor?.chain().focus().toggleItalic().run()"
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
        <CustomSelects
          :model-value="
            editor?.isActive('heading')
              ? (editor.getAttributes('heading').level ?? 0).toString()
              : '0'
          "
          :options="
            headingOptions.map((opt) => ({
              label: opt.label,
              value: opt.level.toString(),
            }))
          "
          @update:model-value="toggleHeadingLevel"
          class="w-auto"
        />
      </div>

      <div class="toolbar-group">
        <button
          v-tooltip="'বোল্ড'"
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="editor?.chain().focus().toggleBold().run()"
        >
          <Icon icon="ic:round-format-bold" />
        </button>
        <button
          v-tooltip="'ইটালিক'"
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="editor?.chain().focus().toggleItalic().run()"
        >
          <Icon icon="ic:round-format-italic" />
        </button>
        <button
          v-tooltip="'আন্ডারলাইন'"
          :class="{ 'is-active': editor.isActive('underline') }"
          @click="editor?.chain().focus().toggleUnderline().run()"
        >
          <Icon icon="ic:round-format-underlined" />
        </button>
        <button
          v-tooltip="'স্ট্রাইক'"
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="editor?.chain().focus().toggleStrike().run()"
        >
          <Icon icon="ic:round-format-strikethrough" />
        </button>
        <button
          v-tooltip="'হাইলাইট'"
          :class="{ 'is-active': editor.isActive('highlight') }"
          @click="editor?.chain().focus().toggleHighlight().run()"
        >
          <Icon icon="ic:round-highlight" />
        </button>
      </div>

      <div class="toolbar-group">
        <button
          v-tooltip="'বুলেট লিস্ট'"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          @click="editor?.chain().focus().toggleBulletList().run()"
        >
          <Icon icon="ic:round-list" />
        </button>
        <button
          v-tooltip="'অর্ডার্ড লিস্ট'"
          :class="{ 'is-active': editor.isActive('orderedList') }"
          @click="editor?.chain().focus().toggleOrderedList().run()"
        >
          <Icon icon="ic:round-format-list-numbered" />
        </button>
        <button
          v-tooltip="'টাস্ক লিস্ট'"
          :class="{ 'is-active': editor.isActive('taskList') }"
          @click="editor?.chain().focus().toggleTaskList().run()"
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
          @click="editor?.chain().focus().undo().run()"
          v-tooltip="'পূর্বাবস্থায় ফিরে যান'"
        >
          <Icon icon="ic:round-undo" />
        </button>

        <button
          @click="editor?.chain().focus().redo().run()"
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
    >
      <div class="p-4 bg-white dark:bg-gray-800 rounded-lg w-96">
        <h3 class="text-lg font-bold mb-2">Image Details</h3>
        <input
          type="text"
          v-model="imageForm.caption"
          placeholder="Caption"
          class="w-full mb-2 p-1 border"
        />
        <input
          type="text"
          v-model="imageForm.source"
          placeholder="Source"
          class="w-full mb-2 p-1 border"
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
    >
      <div class="p-4 bg-white dark:bg-gray-800 rounded-lg w-96">
        <h3 class="text-lg font-bold mb-2">YouTube Video Details</h3>
        <input
          type="text"
          v-model="youtubeForm.url"
          placeholder="Video URL"
          class="w-full mb-2 p-1 border"
        />
        <input
          type="text"
          v-model="youtubeForm.caption"
          placeholder="Caption"
          class="w-full mb-2 p-1 border"
        />
        <input
          type="text"
          v-model="youtubeForm.source"
          placeholder="Source"
          class="w-full mb-2 p-1 border"
        />
        <input
          type="text"
          v-model="youtubeForm.videoLength"
          placeholder="Video Length"
          class="w-full mb-2 p-1 border"
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
</template>

<script lang="ts" setup>
  import { Icon } from '@iconify/vue';
  import Blockquote from '@tiptap/extension-blockquote';
  import { BulletList } from '@tiptap/extension-bullet-list';
  import { CharacterCount } from '@tiptap/extension-character-count';
  import { FontFamily } from '@tiptap/extension-font-family';
  import { Heading, type Level } from '@tiptap/extension-heading';
  import { Highlight } from '@tiptap/extension-highlight';
  import { Image, type SetImageOptions } from '@tiptap/extension-image';
  import { Link } from '@tiptap/extension-link';
  import { OrderedList } from '@tiptap/extension-ordered-list';
  import { Paragraph } from '@tiptap/extension-paragraph';
  import { Placeholder } from '@tiptap/extension-placeholder';
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
  import { onBeforeUnmount, ref, watch, type Ref } from 'vue';
  import { VueFinalModal } from 'vue-final-modal';

  const initialContent: JSONContent = {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }],
  };

  interface Props {
    modelValue: JSONContent;
  }
  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'update:modelValue', content: JSONContent): void;
  }>();

  const MAX_CHARACTERS = 100000;
  const defaultFontFamily = ref('Noto Serif Bengali');
  const fontOptions = ref([
    'Noto Serif Bengali',
    'Tiro Bangla',
    'Hind Siliguri',
    'Baloo Da 2',
  ]);
  const headingOptions = ref([
    { label: 'Normal Text', level: 0 },
    { label: 'Heading 1', level: 1 },
    { label: 'Heading 2', level: 2 },
    { label: 'Heading 3', level: 3 },
    { label: 'Heading 4', level: 4 },
    { label: 'Heading 5', level: 5 },
    { label: 'Heading 6', level: 6 },
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

  interface CustomImageOptions extends SetImageOptions {
    caption?: string;
    source?: string;
  }
  interface CustomYoutubeOptions {
    src: string;
    caption?: string;
    source?: string;
    videoLength?: string;
    width?: number;
    height?: number;
  }

  const editor: Ref<Editor | undefined> = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        link: false,
        paragraph: false,
        bulletList: false,
        orderedList: false,
        taskList: false,
        taskItem: false,
      }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Link.configure({ openOnClick: false }),
      Paragraph,
      Image,
      Youtube,
      TextStyle,
      FontFamily.configure({ types: ['textStyle'] }),
      Highlight,
      BulletList,
      Blockquote,
      OrderedList,
      TaskList,
      TaskItem,
      Placeholder.configure({ placeholder: 'Start writing content...' }),
      CharacterCount.configure({ limit: MAX_CHARACTERS }),
    ],
    content:
      props.modelValue?.type === 'doc' ? props.modelValue : initialContent,
    onUpdate: ({ editor }) => emit('update:modelValue', editor.getJSON()),
  });

  watch(
    () => props.modelValue,
    (newValue) => {
      if (!editor.value) return;
      const normalizedValue =
        newValue?.type === 'doc' ? newValue : initialContent;
      if (
        JSON.stringify(normalizedValue) !==
        JSON.stringify(editor.value.getJSON())
      ) {
        editor.value.commands.setContent(normalizedValue, {
          emitUpdate: false,
        });
      }
    },
    { deep: true }
  );

  // Image
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
      const options: CustomImageOptions = {
        src: base64,
        caption: imageForm.value.caption,
        source: imageForm.value.source,
      };
      editor.value?.chain().focus().setImage(options).run();
      imageModalVisible.value = false;
    };
    reader.readAsDataURL(imageForm.value.file);
  };

  // YouTube
  const addYoutubeVideo = () => {
    youtubeForm.value = { url: '', caption: '', source: '', videoLength: '' };
    youtubeModalVisible.value = true;
  };
  const submitYoutubeModal = () => {
    if (!editor.value || !youtubeForm.value.url) return;
    const options: CustomYoutubeOptions = {
      src: youtubeForm.value.url,
      caption: youtubeForm.value.caption,
      source: youtubeForm.value.source,
      videoLength: youtubeForm.value.videoLength,
    };
    editor.value?.chain().focus().deleteSelection().run();
    (editor.value?.commands as any).setYoutube(options);
    youtubeModalVisible.value = false;
  };

  // Font & Heading
  const setFontFamily = (font: string) =>
    editor.value?.chain().focus().setFontFamily(font).run();
  const toggleHeadingLevel = (levelStr: string) => {
    if (!editor.value) return;
    const level = parseInt(levelStr, 10) as Level | 0;
    if (level === 0) editor.value.chain().focus().setParagraph().run();
    else editor.value.chain().focus().toggleHeading({ level }).run();
  };

  // Link
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

<style lang="scss" scoped>
  .editor-content-area {
    @apply min-h-[40rem] max-h-[50rem];

    :deep(.ProseMirror) {
      @apply min-h-[40rem] max-h-[50rem] focus:outline-none border border-green-500 dark:border-slate-700 p-6;

      [style*='font-family: Noto Serif Bengali'] {
        font-family: 'Noto Serif Bengali', serif !important;
      }
      [style*='font-family: Tiro Bangla'] {
        font-family: 'Tiro Bangla', sans-serif !important;
      }
      [style*='font-family: Hind Siliguri'] {
        font-family: 'Hind Siliguri', sans-serif !important;
      }
      [style*='font-family: Baloo Da 2'] {
        font-family: 'Baloo Da 2', sans-serif !important;
      }

      p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        @apply text-gray-400 pointer-events-none h-0;
      }

      img {
        @apply max-w-full h-auto block my-3 rounded-md shadow;
      }

      .youtube-container {
        @apply relative w-full overflow-hidden my-4 rounded-lg shadow-lg;
        padding-bottom: 56.25%;
        height: 0;
      }

      .youtube-container iframe {
        @apply absolute top-0 left-0 w-full h-full;
      }
    }
  }

  .editor-container {
    @apply border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg relative max-h-[40rem] overflow-auto;
  }

  .toolbar {
    @apply sticky top-0 z-10 w-full flex flex-wrap gap-2 sm:gap-3 p-2 border-b border-b-gray-300 dark:border-b-gray-700 bg-white dark:bg-gray-800 shadow-md;
  }

  .toolbar-group {
    @apply flex gap-1 sm:gap-2 pr-3 border-r border-gray-300 dark:border-gray-700;
  }

  .toolbar-group:last-child {
    border-right: none;
  }

  .toolbar button {
    @apply bg-transparent border border-transparent px-2 sm:px-3 py-1 sm:py-2 cursor-pointer rounded-lg transition-all duration-200 flex items-center justify-center text-sm text-gray-700 dark:text-gray-200;
  }

  .toolbar button:hover {
    @apply bg-gray-100 dark:bg-gray-700;
  }

  .toolbar button.is-active {
    @apply bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700;
  }

  .bubble-menu-style,
  .floating-menu-style {
    @apply flex bg-gray-800 dark:bg-gray-900 p-2 rounded-xl gap-2 shadow-2xl z-50;

    button {
      @apply p-2 rounded-lg text-white transition-colors duration-200;
    }

    button:hover {
      @apply bg-gray-600 dark:bg-gray-700;
    }

    button.is-active {
      @apply bg-green-500 hover:bg-green-500;
    }
  }

  .char-count {
    @apply p-3 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-300 dark:border-gray-700;
  }
</style>
