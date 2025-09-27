<template>
  <QuillEditor :options="options" contentType="html" />
</template>

<script lang="ts" setup>
  import { Quill, QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';

  // Custom fonts
  const customFonts = ['NotoSerif', 'TiroBangla', 'HindSiliguri', 'BalooDa2'];
  const Font = Quill.import('formats/font') as any;
  Font.whitelist = customFonts;
  Quill.register(Font, true);

  // BlockEmbed type fix
  const BlockEmbed = Quill.import('blots/block/embed') as any;

  // Custom ImageWithCaption Blot
  class ImageWithCaption extends BlockEmbed {
    static blotName = 'imageWithCaption';
    static tagName = 'div';

    static create(value: { url: string; caption?: string }) {
      const node = super.create();

      const figure = document.createElement('figure');

      const img = document.createElement('img');
      img.setAttribute('src', value.url);

      const caption = document.createElement('figcaption');
      caption.innerText = value.caption || 'Image Source';

      figure.appendChild(img);
      figure.appendChild(caption);

      node.appendChild(figure);
      return node;
    }

    static value(node: HTMLElement) {
      const img = node.querySelector('img');
      const caption = node.querySelector('figcaption');
      return {
        url: img?.getAttribute('src') || '',
        caption: caption?.innerText || '',
      };
    }
  }

  Quill.register({ 'formats/imageWithCaption': ImageWithCaption });

  // Toolbar options
  const toolbarOptions = [
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

  // Custom image handler (Base64 + Caption)
  function imageHandler(this: any) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string; // Base64 URL
        const caption = prompt('Enter image source/credit:');
        const range = this.quill.getSelection();
        this.quill.insertEmbed(range.index, 'imageWithCaption', {
          url,
          caption,
        });
      };
      reader.readAsDataURL(file);
    };

    input.click();
  }

  const options = ref({
    modules: {
      toolbar: {
        container: toolbarOptions,
        handlers: { image: imageHandler },
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
