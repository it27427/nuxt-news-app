<template>
  <div class="w-full">
    <Ckeditor
      v-model="data"
      :editor="ClassicEditor"
      :config="editorConfig"
      @ready="onEditorReady"
    />
    <pre class="w-full h-40 overflow-auto bg-gray-100 p-3 rounded-lg text-xs break-all whitespace-pre-wrap font-mono border border-gray-300">
      {{ jsonOutput }}
    </pre>
  </div>
</template>

<script setup lang="ts">
import type { Editor, EditorConfig } from '@ckeditor/ckeditor5-core';
import type { FileLoader } from '@ckeditor/ckeditor5-upload';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import { ref, watch } from 'vue';

// ===== CKEditor Free Plugins (Named Imports) =====
import { Bold, Italic, Strikethrough, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import { ClassicEditor as ClassicEditorBase } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Font } from '@ckeditor/ckeditor5-font';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Highlight } from '@ckeditor/ckeditor5-highlight';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import { Image, ImageToolbar, ImageUpload } from '@ckeditor/ckeditor5-image';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { Table } from '@ckeditor/ckeditor5-table';
import { FileRepository } from '@ckeditor/ckeditor5-upload';

// ===== Custom Classic Editor =====
class ClassicEditor extends ClassicEditorBase {}
// @ts-ignore
ClassicEditor.builtinPlugins = [
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
  List,
  Image,
  ImageToolbar,
  ImageUpload,
  MediaEmbed,
  Table,
  Font,
  Highlight,
  SourceEditing,
  FileRepository,
];

// @ts-ignore
ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      '|',
      'link',
      'blockquote',
      'codeBlock',
      'horizontalLine',
      '|',
      'bulletedList',
      'numberedList',
      'imageUpload',
      'mediaEmbed',
      '|',
      'undo',
      'redo',
      'sourceEditing',
    ],
  },
  image: {
    toolbar: [
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',
      '|',
      'toggleImageCaption',
      'imageTextAlternative',
    ],
  },
  licenseKey: 'GPL',
};

// ===== Custom Upload Adapter =====
class CustomUploadAdapter {
  loader: FileLoader;
  editor: Editor;

  constructor(loader: FileLoader, editor: Editor) {
    this.loader = loader;
    this.editor = editor;
  }

  upload(): Promise<{ default: string }> {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          if (!file) return reject('File is null');
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result)
              resolve({ default: e.target.result as string });
            else reject('Failed to read file');
          };
          reader.readAsDataURL(file);
        })
    );
  }

  abort(): void {}
}

function CustomUploadAdapterPlugin(editor: Editor) {
  if (editor.plugins.has('FileRepository')) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader, editor);
    };
  }
}

// ===== Editor Data & JSON Output =====
const data = ref('<h1>Hello CKEditor!</h1>');
const jsonOutput = ref('');

watch(
  data,
  (newHtml) => {
    jsonOutput.value = JSON.stringify(
      [{ articleId: 1001, contentHTML: newHtml, timestamp: new Date().toISOString() }],
      null,
      2
    );
  },
  { immediate: true }
);

// ===== Editor Ready =====
function onEditorReady(editor: Editor) {
  CustomUploadAdapterPlugin(editor);
}

// ===== Editor Config =====
const editorConfig: EditorConfig = ClassicEditor.defaultConfig;
</script>
