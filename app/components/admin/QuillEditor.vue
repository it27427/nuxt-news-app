<template>
  <QuillEditor :options="options" contentType="html" />
</template>

<script lang="ts" setup>
  import { QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'image'],

    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],

    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }],
    [
      {
        font: [
          '"Noto Serif Bengali"',
          '"Tiro Bangla"',
          '"Hind Siliguri"',
          '"Baloo Da 2"',
          'sans-serif',
          'serif',
        ],
      },
    ],
    [{ align: [] }],

    ['clean'],
  ];

  const options = ref({
    modules: {
      toolbar: toolbarOptions,
    },
    placeholder: 'Write message',
    readOnly: false,
    theme: 'snow',
  });
</script>
