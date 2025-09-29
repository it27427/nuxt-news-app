<template>
  <div class="editor-container">
    <ClientOnly>
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
    </ClientOnly>

    <div v-if="editor" class="toolbar">
      <div class="toolbar-group">
        <select
          class="select-control"
          :value="editor.getAttributes('textStyle').fontFamily || 'Inter'"
          @change="
            editor
              .chain()
              .focus()
              .setFontFamily(($event.target as HTMLSelectElement).value)
              .run()
          "
        >
          <option value="Noto Serif Bengali">Noto Serif Bengali</option>
          <option value="Tiro Bangla">Tiro Bangla</option>
          <option value="Hind Siliguri">Hind Siliguri</option>
          <option value="Baloo Da 2">Baloo Da 2</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
          <option value="Comic Sans MS, Comic Sans">Comic Sans</option>
        </select>

        <button
          v-for="level in [1, 2, 3, 4, 5, 6]"
          :key="level"
          :class="{ 'is-active': editor.isActive('heading', { level }) }"
          @click="editor.chain().focus().toggleHeading({ level }).run()"
        >
          H{{ level }}
        </button>
      </div>

      <div class="toolbar-group">
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
          :class="{ 'is-active': editor.isActive('underline') }"
          @click="editor.chain().focus().toggleUnderline().run()"
        >
          <Icon icon="ic:round-format-underlined" />
        </button>
        <button
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="editor.chain().focus().toggleStrike().run()"
        >
          <Icon icon="ic:round-format-strikethrough" />
        </button>
        <button
          :class="{ 'is-active': editor.isActive('highlight') }"
          @click="editor.chain().focus().toggleHighlight().run()"
        >
          <Icon icon="ic:round-highlight" />
        </button>
      </div>

      <div class="toolbar-group">
        <button
          :class="{ 'is-active': editor.isActive('bulletList') }"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <Icon icon="ic:round-list" />
        </button>
        <button
          :class="{ 'is-active': editor.isActive('orderedList') }"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <Icon icon="ic:round-format-list-numbered" />
        </button>
        <button
          :class="{ 'is-active': editor.isActive('taskList') }"
          @click="editor.chain().focus().toggleTaskList().run()"
        >
          <Icon icon="ic:round-task" />
        </button>
      </div>

      <div class="toolbar-group">
        <button @click="openImageFileInput">
          <Icon icon="ic:round-image" />
        </button>
        <button @click="addYoutubeVideo">
          <Icon icon="ic:round-ondemand-video" />
        </button>
        <button
          :class="{ 'is-active': editor.isActive('link') }"
          @click="setLink"
        >
          <Icon icon="ic:round-link" />
        </button>
        <button
          @click="
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          "
        >
          <Icon icon="ic:round-table-chart" />
        </button>
      </div>

      <div class="toolbar-group">
        <button @click="editor.chain().focus().undo().run()">
          <Icon icon="ic:round-undo" />
        </button>
        <button @click="editor.chain().focus().redo().run()">
          <Icon icon="ic:round-redo" />
        </button>
      </div>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileInputChange"
    />

    <EditorContent :editor="editor" class="editor-content-area" />

    <div v-if="editor" class="char-count">
      {{ editor.storage.characterCount.characters() }}/{{ MAX_CHARACTERS }}
      Characters
    </div>

    <div class="json-output">
      <h3>JSON Data (For Database)</h3>
      <pre>{{ jsonOutput }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Icon } from '@iconify/vue';
  import StarterKit from '@tiptap/starter-kit';
  import {
    BubbleMenu,
    EditorContent,
    useEditor,
    type Editor,
    type JSONContent,
  } from '@tiptap/vue-3';

  import { CharacterCount } from '@tiptap/extension-character-count';
  import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
  import { Color } from '@tiptap/extension-color';
  import { FontFamily } from '@tiptap/extension-font-family';
  import { Heading, type Level } from '@tiptap/extension-heading';
  import { Highlight } from '@tiptap/extension-highlight';
  import { Image } from '@tiptap/extension-image';
  import { Link } from '@tiptap/extension-link';
  import { TaskList } from '@tiptap/extension-list';
  import { Placeholder } from '@tiptap/extension-placeholder';
  import { Subscript } from '@tiptap/extension-subscript';
  import { Superscript } from '@tiptap/extension-superscript';
  import { Table } from '@tiptap/extension-table';
  import { TableCell } from '@tiptap/extension-table-cell';
  import { TableHeader } from '@tiptap/extension-table-header';
  import { TableRow } from '@tiptap/extension-table-row';
  import { TaskItem } from '@tiptap/extension-task-item';
  import { TextStyle } from '@tiptap/extension-text-style';
  import { Typography } from '@tiptap/extension-typography';
  import { Underline } from '@tiptap/extension-underline';
  import { Youtube } from '@tiptap/extension-youtube';

  import { createLowlight } from 'lowlight';
  const lowlight = createLowlight();

  import { onBeforeUnmount, ref, type Ref } from 'vue';

  import type {
    CustomImageOptions,
    CustomYoutubeOptions,
  } from '~~/types/tiptap';

  const MAX_CHARACTERS = 10000;

  const content: JSONContent = {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Tiptap Editor with Bengali Fonts' }],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'এখানে আপনি আপনার বাংলা ফন্টগুলি নির্বাচন করতে পারবেন।',
          },
        ],
      },
    ],
  };

  const jsonOutput = ref<JSONContent>(content);
  const fileInputRef: Ref<HTMLInputElement | null> = ref(null);

  const CustomImage = Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        caption: { default: null },
        source: { default: null },
      };
    },
  });

  const CustomYoutube = Youtube.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        caption: { default: null },
        source: { default: null },
        videoLength: { default: null },
      };
    },
  });

  const editor: Ref<Editor | undefined> = useEditor({
    content: content,
    extensions: [
      StarterKit.configure({
        heading: false,
        link: false,
        codeBlock: false,
        underline: false,
      }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] as Level[] }),
      Link.configure({ openOnClick: false }),
      CustomImage.configure({ inline: true, allowBase64: true }),
      CustomYoutube.configure({ allowFullscreen: true, modestBranding: true }),
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      FontFamily.configure({ types: ['textStyle'] }),
      Color,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({ placeholder: 'Write something amazing...' }),
      CharacterCount.configure({ limit: MAX_CHARACTERS }),
      Typography,
    ],
    onUpdate: ({ editor }) => {
      jsonOutput.value = editor.getJSON();
    },
  });

  onBeforeUnmount(() => {
    editor.value?.destroy();
  });

  const setLink = () => {
    if (!editor.value) return;
    const previousUrl = editor.value.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.value.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.value
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  };

  const openImageFileInput = () => {
    if (fileInputRef.value) {
      fileInputRef.value.click();
    }
  };

  const handleFileInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file || !editor.value) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const src = reader.result as string;
      const caption = window.prompt('Caption (Optional)');
      const source = window.prompt('Source (Optional)');
      editor.value?.commands.setImage({
        src,
        caption,
        source,
      } as CustomImageOptions);
      target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const addYoutubeVideo = () => {
    if (!editor.value) return;
    const url = window.prompt('YouTube URL');
    const caption = window.prompt('Caption (Optional)');
    const source = window.prompt('Source (Optional)');
    const length = window.prompt('Video Length (e.g., 5:30) (Optional)');
    if (url) {
      editor.value.commands.setYoutubeVideo({
        src: url,
        caption,
        source,
        videoLength: length,
      } as CustomYoutubeOptions);
    }
  };
</script>

<style lang="scss" scoped>
  .editor-content-area {
    :deep(.ProseMirror) {
      /* ProseMirror base styles: min-height, padding, outline-none */
      @apply min-h-[300px] p-4 focus:outline-none;

      /* Bengali Font Styles inside ProseMirror (Must remain custom due to deep attribute selectors) */
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

      /* Placeholder Text (Must remain custom due to pseudo-element) */
      p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        @apply text-gray-400 pointer-events-none h-0;
      }

      /* Image Styling */
      img {
        @apply max-w-full h-auto block my-3 rounded-md shadow;
      }

      /* YouTube Container Styling (Tailwind + custom aspect ratio CSS) */
      .youtube-container {
        @apply relative w-full overflow-hidden my-4 rounded-lg shadow-lg;
        padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
        height: 0;
      }

      /* YouTube Iframe (Must remain custom CSS for absolute positioning) */
      .youtube-container iframe {
        @apply absolute top-0 left-0 w-full h-full;
      }
    }
  }

  .select-control {
    /* Tailwind for the select box itself */
    @apply px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 shadow-sm transition-colors;

    /* Styling the font within the select dropdown options (Must remain custom due to attribute selectors) */
    option[value='Noto Serif Bengali'] {
      font-family: 'Noto Serif Bengali', serif;
    }
    option[value='Tiro Bangla'] {
      font-family: 'Tiro Bangla', sans-serif;
    }
    option[value='Hind Siliguri'] {
      font-family: 'Hind Siliguri', sans-serif;
    }
    option[value='Baloo Da 2'] {
      font-family: 'Baloo Da 2', sans-serif;
    }
  }

  /* Editor container styles */
  .editor-container {
    @apply border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden;
  }

  /* Toolbar styles */
  .toolbar {
    @apply flex flex-wrap gap-2 sm:gap-3 p-2 border-b border-b-gray-300 dark:border-b-gray-700 bg-white dark:bg-gray-800 shadow-md;
  }

  /* Toolbar Group styles */
  .toolbar-group {
    @apply flex gap-1 sm:gap-2 pr-3 border-r border-gray-300 dark:border-gray-700;
  }

  /* Toolbar Group Last Child (Must remain custom CSS) */
  .toolbar-group:last-child {
    border-right: none;
  }

  /* Toolbar Buttons and Selects */
  .toolbar button,
  .toolbar select {
    @apply bg-transparent border border-transparent px-2 sm:px-3 py-1 sm:py-2 cursor-pointer rounded-lg transition-all duration-200 flex items-center justify-center text-sm text-gray-700 dark:text-gray-200;
  }

  /* Toolbar Button/Select Hover State */
  .toolbar button:hover,
  .toolbar select:hover {
    @apply bg-gray-100 dark:bg-gray-700;
  }

  /* Toolbar Button Active State */
  .toolbar button.is-active {
    @apply bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700;
  }

  /* Bubble and Floating Menu Styles */
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
      @apply bg-blue-500 hover:bg-blue-500;
    }
  }

  /* Character Count */
  .char-count {
    @apply p-3 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-300 dark:border-gray-700;
  }

  /* JSON Output Block */
  .json-output {
    @apply mt-5 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-inner;

    pre {
      @apply whitespace-pre-wrap break-words max-h-52 overflow-y-auto text-sm text-gray-800 dark:text-gray-200;
    }
  }
</style>
