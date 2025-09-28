<template>
  <QuillEditor
    v-model:content="localContent"
    :options="options"
    :contentType="saveContentType"
  />
</template>

<script lang="ts" setup>
  import { Quill, QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  import Delta from 'quill-delta';
  import { computed, ref, watch } from 'vue';

  // NOTE: Define the Delta type with the isEqual method for reliable comparison
  type DeltaWithIsEqual = Delta & { isEqual: (other: Delta) => boolean };

  // ---------------- Props & Emits ----------------
  const props = defineProps<{
    modelValue?: any;
    contentType?: 'html' | 'json' | 'text';
  }>();

  const emit = new Function() as (e: 'update:modelValue', value: any) => void;

  // Local state: Always initialize as a Delta object for internal use
  const initialDelta = new Delta(
    props.modelValue && props.modelValue.ops
      ? props.modelValue.ops
      : props.modelValue
  );

  const localContent = ref<DeltaWithIsEqual>(initialDelta as DeltaWithIsEqual);

  // ---------------- Watch Sync Fix ----------------
  watch(
    () => props.modelValue,
    (newVal) => {
      let incomingDelta: DeltaWithIsEqual;

      try {
        if (newVal instanceof Delta) {
          incomingDelta = newVal as DeltaWithIsEqual;
        } else if (newVal && newVal.ops) {
          incomingDelta = new Delta(newVal.ops) as DeltaWithIsEqual;
        } else {
          incomingDelta = new Delta() as DeltaWithIsEqual;
        }
      } catch (e) {
        console.error('Delta Conversion Error:', e);
        return;
      }

      if (!localContent.value.isEqual(incomingDelta)) {
        localContent.value = incomingDelta;
      }
    }
  );

  // Child → Parent Sync: Emit the content in the required format
  watch(localContent, (val) => {
    let outputValue: any;
    const type = props.contentType || 'delta';

    if (type === 'json') {
      outputValue = val.ops; // Delta ops for JSON output
    } else {
      outputValue = val; // Delta or text
    }

    // Explicitly call the emit function
    emit('update:modelValue', outputValue);
  });

  const saveContentType = computed(() => {
    return props.contentType === 'json' ? 'delta' : props.contentType;
  });

  // ---------------- Custom Block Formats (Title & Subtitle) ----------------
  if (!(Quill as any).registeredCustomBlocks) {
    const Block = Quill.import('blots/block') as any;

    class NewsTitle extends Block {
      static blotName = 'newsTitle';
      static tagName = 'div'; // Use a generic tag like div or p, no inherent semantics
      // Override default formats if needed
      static formats(domNode: HTMLElement) {
        return { newsTitle: true };
      }
      static create(value: any) {
        const node = super.create(value);
        node.setAttribute('class', 'ql-news-title');
        node.setAttribute('data-placeholder', 'Insert News Title...');
        return node;
      }
    }

    class NewsSubtitle extends Block {
      static blotName = 'newsSubtitle';
      static tagName = 'div';
      static formats(domNode: HTMLElement) {
        return { newsSubtitle: true };
      }
      static create(value: any) {
        const node = super.create(value);
        node.setAttribute('class', 'ql-news-subtitle');
        node.setAttribute('data-placeholder', 'Insert News Subtitle...');
        return node;
      }
    }

    Quill.register(NewsTitle, true);
    Quill.register(NewsSubtitle, true);
    (Quill as any).registeredCustomBlocks = true;
  }

  // ---------------- Custom Fonts ----------------
  const customFonts = ['NotoSerif', 'TiroBangla', 'HindSiliguri', 'BalooDa2'];
  const Font = Quill.import('formats/font') as any;
  Font.whitelist = customFonts;
  Quill.register(Font, true);

  // ---------------- Image/Video Blots (Overriding default to store extra data) ----------------

  // 1. ImageWithData (Overriding the default 'image' blot)
  if (!(Quill as any).registeredImageWithData) {
    const ImageBlot = Quill.import('formats/image') as any;

    class ImageWithData extends ImageBlot {
      static blotName = 'image'; // MUST use the name 'image' to replace the default
      static tagName = 'img';

      static value(node: HTMLImageElement) {
        return {
          url: node.getAttribute('src'),
          caption: node.dataset.caption || '',
          credit: node.dataset.credit || '',
        };
      }

      static create(
        value: { url: string; caption?: string; credit?: string } | string
      ) {
        const node = super.create(value) as HTMLImageElement;

        let url, caption, credit;

        if (typeof value === 'object') {
          url = value.url;
          caption = value.caption;
          credit = value.credit;
        } else {
          url = value;
          caption = '';
          credit = '';
        }

        node.setAttribute('src', url);
        node.setAttribute('data-caption', caption || '');
        node.setAttribute('data-credit', credit || '');

        return node;
      }

      formats(domNode: HTMLImageElement) {
        const formats = super.formats(domNode);
        formats.caption = domNode.dataset.caption;
        formats.credit = domNode.dataset.credit;
        return formats;
      }
    }

    Quill.register(ImageWithData, true);
    (Quill as any).registeredImageWithData = true;
  }

  // 2. VideoWithData (Overriding the default 'video' blot)
  if (!(Quill as any).registeredVideoWithData) {
    const VideoBlot = Quill.import('formats/video') as any;

    class VideoWithData extends VideoBlot {
      static blotName = 'video';
      static tagName = 'iframe';

      static value(node: HTMLIFrameElement) {
        return {
          url: node.getAttribute('src'),
          caption: node.dataset.caption || '',
          credit: node.dataset.credit || '',
          length: node.dataset.length || '',
        };
      }

      static create(
        value:
          | { url: string; caption?: string; credit?: string; length?: string }
          | string
      ) {
        const node = super.create(value) as HTMLIFrameElement;

        let url, caption, credit, length;

        if (typeof value === 'object') {
          url = value.url;
          caption = value.caption;
          credit = value.credit;
          length = value.length;
        } else {
          url = value;
          caption = '';
          credit = '';
          length = '';
        }

        node.setAttribute('src', url);
        node.setAttribute('data-caption', caption || '');
        node.setAttribute('data-credit', credit || '');
        node.setAttribute('data-length', length || '');

        return node;
      }

      formats(domNode: HTMLIFrameElement) {
        const formats = super.formats(domNode);
        formats.caption = domNode.dataset.caption;
        formats.credit = domNode.dataset.credit;
        formats.length = domNode.dataset.length;
        return formats;
      }
    }

    Quill.register(VideoWithData, true);
    (Quill as any).registeredVideoWithData = true;
  }

  // ---------------- Handlers (Custom Logic without inserting newline) ----------------

  function imageHandler(this: any) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;

        const caption = prompt('Enter image caption:');
        const credit = prompt('Enter image source/credit:');

        const range = this.quill.getSelection(true);
        if (range) {
          this.quill.insertEmbed(
            range.index,
            'image',
            { url, caption, credit },
            Quill.sources.USER
          );
          // Move cursor after the embed
          this.quill.setSelection(
            range.index + 1,
            range.index + 1,
            Quill.sources.SILENT
          );
        }
      };
      reader.readAsDataURL(file);
    };
  }

  function videoHandler(this: any) {
    const url = prompt('Enter video URL (YouTube/etc):');
    if (!url) return;

    const caption = prompt('Enter video caption:');
    const credit = prompt('Enter video source/credit:');
    const length = prompt('Enter video length (e.g., 03:45):');

    const range = this.quill.getSelection();
    if (range) {
      this.quill.insertEmbed(
        range.index,
        'video',
        { url, caption, credit, length },
        Quill.sources.USER
      );
      // Move cursor after the embed
      this.quill.setSelection(
        range.index + 1,
        range.index + 1,
        Quill.sources.SILENT
      );
    }
  }

  // Custom Handler to apply 'newsTitle' format
  function titleHandler(this: any) {
    const range = this.quill.getSelection();
    if (range) {
      this.quill.formatLine(
        range.index,
        range.length,
        'newsTitle',
        true,
        Quill.sources.USER
      );
    }
  }

  // Custom Handler to apply 'newsSubtitle' format
  function subtitleHandler(this: any) {
    const range = this.quill.getSelection();
    if (range) {
      this.quill.formatLine(
        range.index,
        range.length,
        'newsSubtitle',
        true,
        Quill.sources.USER
      );
    }
  }

  // ---------------- Toolbar ----------------
  const toolbarOptions = [
    // Custom Title/Subtitle buttons
    [{ header: 'newsTitle' }, { header: 'newsSubtitle' }],
    // Standard formats
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    [{ font: customFonts }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ color: [] }, { background: [] }],
    ['clean'],
  ];

  // ---------------- Options ----------------
  const options = ref({
    modules: {
      toolbar: {
        container: toolbarOptions,
        handlers: {
          image: imageHandler, // Custom handler for local upload + data
          video: videoHandler, // Custom handler for URL prompt + data
          // Map toolbar button to custom handlers
          newsTitle: titleHandler,
          newsSubtitle: subtitleHandler,
        },
      },
    },
    theme: 'snow',
  });
</script>

<style lang="scss" scoped>
  /* Editor text styles */
  .ql-font-NotoSerif {
    font-family: 'Noto Serif Bengali', serif;
  }
  // ... (Other font definitions) ...

  /* Custom block styles for the editor UI */
  :deep(.ql-editor .ql-news-title) {
    font-size: 2.2rem;
    font-weight: 700;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    color: #1a202c; /* Dark text for prominence */
  }

  :deep(.ql-editor .ql-news-subtitle) {
    font-size: 1.5rem;
    font-weight: 500;
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #4a5568; /* Slightly lighter text */
  }

  // ... (Other toolbar and default styles) ...
  .ql-font-TiroBangla {
    font-family: 'Tiro Bangla', sans-serif;
  }
  .ql-font-HindSiliguri {
    font-family: 'Hind Siliguri', sans-serif;
  }
  .ql-font-BalooDa2 {
    font-family: 'Baloo Da 2', sans-serif;
  }

  /* Toolbar dropdown labels */
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='NotoSerif']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='NotoSerif']::before {
    content: 'Noto Serif';
    font-family: 'Noto Serif Bengali', serif;
  }

  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='TiroBangla']::before,
  .ql-snow
    .ql-picker.ql-font
    .ql-picker-label[data-value='TiroBangla']::before {
    content: 'Tiro Bangla';
    font-family: 'Tiro Bangla', sans-serif;
  }

  .ql-snow
    .ql-picker.ql-font
    .ql-picker-item[data-value='HindSiliguri']::before,
  .ql-snow
    .ql-picker.ql-font
    .ql-picker-label[data-value='HindSiliguri']::before {
    content: 'Hind Siliguri';
    font-family: 'Hind Siliguri', sans-serif;
  }

  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='BalooDa2']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='BalooDa2']::before {
    content: 'Baloo Da 2';
    font-family: 'Baloo Da 2', sans-serif;
  }
</style>
