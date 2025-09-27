<template>
  <QuillEditor
    :options="options"
    contentType="html"
    data-gramm="false"
    data-gramm_editor="false"
    data-enable-grammarly="false"
  />
</template>

<script lang="ts" setup>
  import { Quill, QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';

  const customFonts = ['NotoSerif', 'TiroBangla', 'HindSiliguri', 'BalooDa2'];

  const Font = Quill.import('formats/font') as any;
  Font.whitelist = customFonts;
  Quill.register(Font, true);

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

  const options = ref({
    modules: { toolbar: toolbarOptions },
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
