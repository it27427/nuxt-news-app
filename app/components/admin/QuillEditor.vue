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

  // NOTE: Import EmbedBlot for custom image/video
  const Embed = Quill.import('blots/embed') as any;
  const Block = Quill.import('blots/block') as any; // Block is needed for custom title/subtitle

  // NOTE: Define the Delta type with the isEqual method for reliable comparison
  type DeltaWithIsEqual = Delta & { isEqual: (other: Delta) => boolean };

  // ---------------- Props & Emits ----------------
  const props = defineProps<{
    modelValue?: any;
    contentType?: 'html' | 'json' | 'text';
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void;
  }>();

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

      // Check if the delta content is actually different before updating
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
    // When contentType is 'json', the QuillEditor needs 'delta'
    return props.contentType === 'json' ? 'delta' : props.contentType;
  });

  // ---------------- Custom Block Formats (Title & Subtitle) ----------------
  if (!(Quill as any).registeredCustomBlocks) {
    // const Block = Quill.import('blots/block') as any; // Already imported above

    // NewsTitle Blot
    class NewsTitle extends Block {
      static blotName = 'newsTitle';
      static tagName = 'div';
      // Use static formats for Block-level formats
      static formats(domNode: HTMLElement) {
        return domNode.getAttribute('class') === 'ql-news-title'
          ? { newsTitle: true }
          : {};
      }
      static create(value: any) {
        const node = super.create(value);
        node.setAttribute('class', 'ql-news-title');
        node.setAttribute('data-placeholder', 'Insert News Title...');
        return node;
      }
    }

    // NewsSubtitle Blot
    class NewsSubtitle extends Block {
      static blotName = 'newsSubtitle';
      static tagName = 'div';
      // Use static formats for Block-level formats
      static formats(domNode: HTMLElement) {
        return domNode.getAttribute('class') === 'ql-news-subtitle'
          ? { newsSubtitle: true }
          : {};
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

  // ---------------- Image/Video Blots (FIXED) ----------------
  // The base Image/Video blots in Quill are a type of Embed.
  // We use the imported Embed blot as the base for custom formats.

  if (!(Quill as any).registeredImageWithData) {
    class ImageWithData extends Embed {
      static blotName = 'image';
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
        // Set your custom attributes directly on the DOM node as data-*
        node.dataset.caption = caption || '';
        node.dataset.credit = credit || '';

        // Add a wrapper to help display the caption/credit in the editor/output
        const container = document.createElement('span');
        container.classList.add('image-with-data-wrapper');
        container.setAttribute('contenteditable', 'false'); // Prevent editing inside embed
        container.appendChild(node);

        const captionNode = document.createElement('figcaption');
        captionNode.classList.add('image-caption');
        captionNode.innerText = caption || '';
        container.appendChild(captionNode);

        const creditNode = document.createElement('div');
        creditNode.classList.add('image-credit');
        creditNode.innerText = credit || '';
        container.appendChild(creditNode);

        return container; // Return the wrapper node
      }

      // FIX: Use static formats to read formats from the blot's DOM node
      static formats(domNode: HTMLSpanElement) {
        // Find the actual image node inside the wrapper
        const imgNode = domNode.querySelector('img');
        if (!imgNode) return {};

        return {
          caption: imgNode.dataset.caption,
          credit: imgNode.dataset.credit,
        };
      }

      // Instance format method to update the DOM node
      format(name: string, value: any): void {
        const imgNode = this.domNode.querySelector('img');
        if (!imgNode) return;

        if (name === 'caption') {
          imgNode.dataset.caption = value;
          this.domNode.querySelector('.image-caption').innerText = value || '';
        } else if (name === 'credit') {
          imgNode.dataset.credit = value;
          this.domNode.querySelector('.image-credit').innerText = value || '';
        } else {
          super.format(name, value);
        }
      }
    }

    // FIX: Register the custom image blot with the correct key and keep existing one.
    Quill.register(ImageWithData, true);
    (Quill as any).registeredImageWithData = true;
  }

  if (!(Quill as any).registeredVideoWithData) {
    class VideoWithData extends Embed {
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
        node.setAttribute('frameborder', '0');
        node.setAttribute('allowfullscreen', 'true');

        // Set your custom attributes directly on the DOM node as data-*
        node.dataset.caption = caption || '';
        node.dataset.credit = credit || '';
        node.dataset.length = length || '';

        // Add a wrapper to help display the caption/credit/length in the editor/output
        const container = document.createElement('span');
        container.classList.add('video-with-data-wrapper');
        container.setAttribute('contenteditable', 'false'); // Prevent editing inside embed
        container.appendChild(node);

        const captionNode = document.createElement('figcaption');
        captionNode.classList.add('video-caption');
        captionNode.innerText = caption || '';
        container.appendChild(captionNode);

        const creditNode = document.createElement('div');
        creditNode.classList.add('video-credit');
        creditNode.innerText = `Credit: ${credit || ''}`;
        container.appendChild(creditNode);

        const lengthNode = document.createElement('div');
        lengthNode.classList.add('video-length');
        lengthNode.innerText = `Length: ${length || ''}`;
        container.appendChild(lengthNode);

        return container; // Return the wrapper node
      }

      // FIX: Use static formats to read formats from the blot's DOM node
      static formats(domNode: HTMLSpanElement) {
        const videoNode = domNode.querySelector('iframe');
        if (!videoNode) return {};

        return {
          caption: videoNode.dataset.caption,
          credit: videoNode.dataset.credit,
          length: videoNode.dataset.length,
        };
      }

      // Instance format method to update the DOM node
      format(name: string, value: any): void {
        const videoNode = this.domNode.querySelector('iframe');
        if (!videoNode) return;

        if (name === 'caption') {
          videoNode.dataset.caption = value;
          this.domNode.querySelector('.video-caption').innerText = value || '';
        } else if (name === 'credit') {
          videoNode.dataset.credit = value;
          this.domNode.querySelector('.video-credit').innerText =
            `Credit: ${value || ''}`;
        } else if (name === 'length') {
          videoNode.dataset.length = value;
          this.domNode.querySelector('.video-length').innerText =
            `Length: ${value || ''}`;
        } else {
          super.format(name, value);
        }
      }
    }

    Quill.register(VideoWithData, true);
    (Quill as any).registeredVideoWithData = true;
  }

  // ---------------- Handlers ----------------
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
        if (range && range.index <= this.quill.getLength()) {
          this.quill.insertEmbed(
            range.index,
            'image',
            { url, caption, credit },
            Quill.sources.USER
          );
          this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
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
    if (range && range.index <= this.quill.getLength()) {
      this.quill.insertEmbed(
        range.index,
        'video',
        { url, caption, credit, length },
        Quill.sources.USER
      );
      this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
    }
  }

  function titleHandler(this: any) {
    const range = this.quill.getSelection();
    if (range && range.index <= this.quill.getLength()) {
      const safeLength = Math.min(
        range.length,
        this.quill.getLength() - range.index
      );
      this.quill.formatLine(
        range.index,
        safeLength || 1, // Ensure length is at least 1 for formatLine
        'newsTitle',
        true,
        Quill.sources.USER
      );
    }
  }

  function subtitleHandler(this: any) {
    const range = this.quill.getSelection();
    if (range && range.index <= this.quill.getLength()) {
      const safeLength = Math.min(
        range.length,
        this.quill.getLength() - range.index
      );
      this.quill.formatLine(
        range.index,
        safeLength || 1, // Ensure length is at least 1 for formatLine
        'newsSubtitle',
        true,
        Quill.sources.USER
      );
    }
  }

  // ---------------- Toolbar & Options ----------------
  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: customFonts }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ color: [] }, { background: [] }],
    // Add custom formats to the toolbar
    [{ newsTitle: 'News Title' }, { newsSubtitle: 'News Subtitle' }],
    ['clean'],
  ];

  const options = ref({
    modules: {
      toolbar: {
        container: toolbarOptions,
        handlers: {
          image: imageHandler,
          video: videoHandler,
          newsTitle: titleHandler,
          newsSubtitle: subtitleHandler,
        },
      },
      // FIX: Add keyboard module to handle 'Enter' key press in custom blocks
      keyboard: {
        bindings: {
          // Handle 'Enter' key specifically for 'newsTitle' format
          newsTitleEnter: {
            key: 'enter',
            format: ['newsTitle'],
            handler: function (this: any, range: any) {
              // 1. Insert a new line break at the current position
              this.quill.insertText(range.index, '\n', Quill.sources.USER);

              // 2. Move the selection to the newly created line
              this.quill.setSelection(range.index + 1, Quill.sources.SILENT);

              // 3. Remove the 'newsTitle' format from the new line, defaulting to paragraph
              this.quill.formatLine(
                range.index + 1,
                1,
                'newsTitle',
                false,
                Quill.sources.USER
              );

              return false; // Prevent default Quill 'Enter' behavior
            },
          },
          // Handle 'Enter' key specifically for 'newsSubtitle' format
          newsSubtitleEnter: {
            key: 'enter',
            format: ['newsSubtitle'],
            handler: function (this: any, range: any) {
              // 1. Insert a new line break at the current position
              this.quill.insertText(range.index, '\n', Quill.sources.USER);

              // 2. Move the selection to the newly created line
              this.quill.setSelection(range.index + 1, Quill.sources.SILENT);

              // 3. Remove the 'newsSubtitle' format from the new line, defaulting to paragraph
              this.quill.formatLine(
                range.index + 1,
                1,
                'newsSubtitle',
                false,
                Quill.sources.USER
              );

              return false;
            },
          },
        },
      },
    },
    theme: 'snow',
  });
</script>

<style lang="scss">
  /* Editor text styles */
  .ql-font-NotoSerif {
    font-family: 'Noto Serif Bengali', serif;
  }
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
