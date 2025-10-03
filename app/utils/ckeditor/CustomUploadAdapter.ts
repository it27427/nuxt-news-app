// app/utils/ckeditor/CustomUploadAdapter.ts

import type { Editor } from '@ckeditor/ckeditor5-core';
import type { FileLoader } from '@ckeditor/ckeditor5-upload';

export default class CustomUploadAdapter {
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

export function CustomUploadAdapterPlugin(editor: Editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new CustomUploadAdapter(loader, editor);
  };
}
