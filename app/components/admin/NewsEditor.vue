<template>
  <div class="w-full">
    <div ref="editorRef" class="editor-container"></div>
    <p class="license-note">
      Running with GPL 2+ license configuration (Self-hosted, No premium features).
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@ckeditor/ckeditor5-core';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import {
	BlockQuote,
	Bold,
	ClassicEditor,
	CodeBlock,
	Essentials,
	Font,
	Heading,
	Highlight,
	HorizontalLine,
	Image,
	ImageCaption,
	ImageInsert,
	ImageResize,
	ImageStyle,
	ImageTextAlternative,
	ImageToolbar,
	ImageUpload,
	Indent,
	IndentBlock,
	Italic,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	RemoveFormat,
	SourceEditing,
	Strikethrough,
	Table,
	Underline
} from 'ckeditor5';

import CustomUploadAdapterPlugin from '~/utils/ckeditor/CustomUploadAdapter';

import 'ckeditor5/ckeditor5.css';

const data = ref( '<p>Hello world!</p>' );
const editorRef = ref<HTMLElement | null>(null);
const ckeditorInstance = ref<Editor | null>(null);

const config = computed( () => {
  return {
    licenseKey: 'GPL',
    plugins: [ 
      Essentials, 
      Paragraph, 
      Bold, 
      Italic, 
      Underline, 
      Strikethrough, 
      RemoveFormat, 
      Heading, 
      BlockQuote, 
      CodeBlock, 
      HorizontalLine, 
      Link, 
      SourceEditing, 
      List, 
      Indent, 
      IndentBlock, 
      
      Image, 
      ImageInsert, 
      ImageUpload, 
      ImageCaption, 
      ImageToolbar, 
      ImageStyle, 
      ImageResize, 
      ImageTextAlternative, 

      MediaEmbed, 
      Table,
      Font, 
      Highlight 
    ],
    toolbar: [ 
      'heading', '|', 
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'link', 
      'blockquote', 'codeBlock', 'horizontalLine', '|',
      'bulletedList', 'numberedList', 'outdent', 'indent', '|', 
      'insertImage', 'mediaEmbed', 'insertTable', '|',
      'undo', 'redo'
    ],
    
    image: {
      toolbar: [
        'imageTextAlternative',
        'toggleImageCaption',
        '|',
        'imageStyle:inline', 
        'imageStyle:block', 
        'imageStyle:side',
        '|',
        'linkImage'
      ],
      resizeOptions: [
        {
          name: 'resizeImage:original',
          label: 'Original',
          value: null
        },
        {
          name: 'resizeImage:25',
          label: '25%',
          value: '25'
        },
        {
          name: 'resizeImage:50',
          label: '50%',
          value: '50'
        },
        {
          name: 'resizeImage:75',
          label: '75%',
          value: '75'
        }
      ],
      styles: [
        { name: 'full', icon: 'full', title: 'Full size image' },
        { name: 'side', icon: 'side', title: 'Side image' },
        { name: 'alignLeft', icon: 'alignLeft', title: 'Align left' },
        { name: 'alignRight', icon: 'alignRight', title: 'Align right' }
      ]
    },

    extraPlugins: [ CustomUploadAdapterPlugin ]
  } as any;
});

onMounted(async () => {
  if (!editorRef.value) return;

  try {
    const CustomAdapterModule = await import('~/utils/ckeditor/CustomUploadAdapter');
    const CustomUploadAdapterPlugin = CustomAdapterModule.default;

    // আপনার ImageSourcePlugin ব্যবহার করতে চাইলে নিচে যোগ করুন
    // const ImageSourceModule = await import('~/utils/ckeditor/ImageSourcePlugin');
    // const ImageSourcePluginClass = ImageSourceModule.default;

    const editorConfig = {
      ...config.value,
      extraPlugins: [ 
        CustomUploadAdapterPlugin, 
        // ImageSourcePluginClass // যদি প্রয়োজন হয় তবে এটি আনকমেন্ট করুন
      ]
    };

    const editor = await ClassicEditor.create(editorRef.value, editorConfig);
    
    editor.model.document.on('change:data', () => {
      data.value = editor.getData();
    });

    ckeditorInstance.value = editor;
  } catch (error) {
    console.error("CKEditor initialization failed:", error);
  }
});

onBeforeUnmount(() => {
  if (ckeditorInstance.value) {
    ckeditorInstance.value.destroy();
  }
});
</script>

<style lang="scss">
.ck.ck-balloon-panel.ck-powered-by-balloon 
  .ck.ck-powered-by,
.ck.ck-balloon-panel.ck-balloon-panel_visible {
  display: none;
}

.ck.ck-editor__editable.ck-focused {
  .ck.ck-balloon-panel.ck-powered-by-balloon 
  .ck.ck-powered-by,
  .ck.ck-balloon-panel.ck-balloon-panel_visible {
    display: none;
  }
}

.editor-container .ck.ck-editor__main .ck-content {
  min-height: 400px; 
}
</style>