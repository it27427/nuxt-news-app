// app/utils/ckeditor/CustomUploadAdapter.ts

import type { Editor } from '@ckeditor/ckeditor5-core';
import type { FileLoader } from '@ckeditor/ckeditor5-upload/src/filerepository';

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
          if (!file) {
            reject('File is null, upload cannot proceed.');
            return;
          }

          const reader = new FileReader();

          reader.onload = function (e) {
            if (e.target && e.target.result) {
              const uploadedUrl = e.target.result as string;
              resolve({ default: uploadedUrl });
            } else {
              reject('Failed to read file data.');
            }
          };
          reader.readAsDataURL(file);
        })
    );
  }

  abort(): void {}
}

export default class CustomUploadAdapterPlugin {
  editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  init() {
    this.editor.plugins.get('FileRepository').createUploadAdapter = (
      loader
    ) => {
      return new CustomUploadAdapter(loader, this.editor);
    };
  }
}
