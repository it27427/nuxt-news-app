// app/utils/ckeditor/CustomClassicEditor.d.ts

declare module '~/utils/ckeditor/CustomClassicEditor' {
  import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
  const CustomClassicEditor: typeof ClassicEditorBase;
  export default CustomClassicEditor;
}
