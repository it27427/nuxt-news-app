<template>
  <main id="sample">
    <client-only>
      <Editor
        :init="editorConfig"
        initial-value="সংবাদ লিখা শুরু করুন..."
      />
    </client-only>
  </main>
</template>

<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';

// TinyMCE কোর প্রথমে ইম্পোর্ট করুন
import 'tinymce/tinymce';

// তারপর প্লাগিনগুলো ইম্পোর্ট করুন
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/wordcount';

// সkin এবং theme ইম্পোর্ট করুন
import 'tinymce/skins/ui/oxide/skin.css';
import 'tinymce/themes/silver';

// TinyMCE editor configuration
const editorConfig = {
  license_key: 'gpl',
  toolbar_mode: 'sliding',
  plugins: [
    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 
    'link', 'lists', 'media', 'searchreplace', 'table', 
    'visualblocks', 'wordcount'
  ],
  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
  height: 500,
  menubar: 'file edit view insert format tools',
  menu: {
    file: { title: 'File', items: 'newdocument restoredraft | preview | print' },
    edit: { title: 'Edit', items: 'undo redo | cut copy paste | selectall | searchreplace' },
    view: { title: 'View', items: 'code | visualaid visualchars visualblocks | preview fullscreen' },
    insert: { title: 'Insert', items: 'image link media codesample | charmap emoticons | inserttable' },
    format: { title: 'Format', items: 'bold italic underline strikethrough | fontfamily fontsize | forecolor backcolor | align lineheight | removeformat' },
    tools: { title: 'Tools', items: 'wordcount' }
  },
  font_formats: 
    'Nirmala UI=Nirmala UI, sans-serif; ' +
    'Kalpurush=Kalpurush, sans-serif; ' +
    'Solaiman Lipi=Solaiman Lipi, serif; ' +
    'Arial=Arial, Helvetica, sans-serif; ' +
    'Times New Roman=Times New Roman, serif; ' +
    'Courier New=Courier New, monospace;',
  content_style: `
    body {
      font-family: 'Nirmala UI', 'Kalpurush', sans-serif;
      font-size: 14px;
      line-height: 1.6;
    }
  `,
  browser_spellcheck: false,
  contextmenu: 'link image table',
  mobile: {
    theme: 'mobile',
    toolbar: ['undo', 'redo', 'bold', 'italic', 'underline', 'link']
  }
};
</script>

<style scoped>
#sample {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>