<template>
  <div class="editor-container">
    <ClientOnly>
      <component
        v-if="BubbleMenuComponent && editor"
        :is="BubbleMenuComponent"
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
      </component>
    </ClientOnly>
    <div v-if="editor" class="toolbar">
      <div class="toolbar-group">
        <CustomSelects
          :model-value="
            editor.getAttributes('textStyle').fontFamily || defaultFontFamily
          "
          :options="fontOptions"
          @update:model-value="setFontFamily"
          class="w-auto"
        />

        <CustomSelects
          :model-value="
            editor.isActive('heading')
              ? editor.getAttributes('heading').level.toString()
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

  const MAX_CHARACTERS = 100000;

  const defaultFontFamily = ref('Noto Serif Bengali');

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

  const fontOptions = [
    { label: 'Noto Serif Bengali', value: 'Noto Serif Bengali' },
    { label: 'Tiro Bangla', value: 'Tiro Bangla' },
    { label: 'Hind Siliguri', value: 'Hind Siliguri' },
    { label: 'Baloo Da 2', value: 'Baloo Da 2' },
    { label: 'Serif', value: 'serif' },
    { label: 'Monospace', value: 'monospace' },
    { label: 'Comic Sans MS', value: 'Comic Sans MS, Comic Sans' },
  ];

  // Options for the heading level dropdown
  const headingOptions = [
    { label: 'Paragraph', level: 0, icon: 'ic:round-notes' },
    { label: 'Heading 1', level: 1, icon: 'ic:round-title' },
    { label: 'Heading 2', level: 2, icon: 'ic:round-title' },
    { label: 'Heading 3', level: 3, icon: 'ic:round-title' },
    { label: 'Heading 4', level: 4, icon: 'ic:round-title' },
    { label: 'Heading 5', level: 5, icon: 'ic:round-title' },
    { label: 'Heading 6', level: 6, icon: 'ic:round-title' },
  ];

  const jsonOutput = ref<JSONContent>(content);
  const fileInputRef: Ref<HTMLInputElement | null> = ref(null);
  const levels = [1, 2, 3, 4, 5, 6] as Level[];

  const BubbleMenuComponent = ref<any>(null);

  if (import.meta.client) {
    import('@tiptap/vue-3')
      .then((mod) => {
        BubbleMenuComponent.value =
          (mod as any).BubbleMenu || (mod as any).default?.BubbleMenu;
      })
      .catch((err) => {
        console.warn(
          'Could not load BubbleMenu from @tiptap/vue-3 dynamically:',
          err
        );
      });
  }

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
    editorProps: {
      attributes: {
        style: `font-family: ${defaultFontFamily.value};`,
      },
    },
    extensions: [
      StarterKit.configure({
        heading: false, // Disable default heading as we configure it below
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
      // Removed duplicate TableCell configuration to fix the warning
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

  /**
   * Toggles the heading level or sets it to paragraph based on the selected value.
   * @param value The selected heading level as a string ('1' to '6') or '0' for Paragraph.
   */
  const toggleHeadingLevel = (value: string) => {
    if (!editor.value) return;

    // TypeScript Fix: Compare 'value' as a string to '0'.
    if (value === '0') {
      // If 'Paragraph' is selected, set to paragraph
      editor.value.chain().focus().setParagraph().run();
    } else {
      // Toggle heading for the selected level. Convert the string '1'-'6' to Level type.
      const level = parseInt(value) as Level;
      editor.value.chain().focus().toggleHeading({ level }).run();
    }
  };

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

  const setFontFamily = (value: string) => {
    if (!editor.value) return;
    editor.value.chain().focus().setFontFamily(value).run();
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
      @apply min-h-[300px] p-4 focus:outline-none;

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
    @apply border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden;
  }

  .toolbar {
    @apply flex flex-wrap gap-2 sm:gap-3 p-2 border-b border-b-gray-300 dark:border-b-gray-700 bg-white dark:bg-gray-800 shadow-md;
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
    @apply bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700;
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
      @apply bg-blue-500 hover:bg-blue-500;
    }
  }

  .char-count {
    @apply p-3 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-300 dark:border-gray-700;
  }

  .json-output {
    @apply mt-5 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-inner;

    pre {
      @apply whitespace-pre-wrap break-words max-h-52 overflow-y-auto text-sm text-gray-800 dark:text-gray-200;
    }
  }
</style>
