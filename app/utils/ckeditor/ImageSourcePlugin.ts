// app/utils/ckeditor/ImageSourcePlugin.ts

import { Plugin } from '@ckeditor/ckeditor5-core';
import { Image, ImageBlock, ImageEditing } from '@ckeditor/ckeditor5-image';

export default class ImageSourcePlugin extends Plugin {
  static get requires() {
    return [Image, ImageBlock, ImageEditing];
  }

  init() {
    const editor = this.editor;

    if (editor.model.schema.isRegistered('imageBlock')) {
      editor.model.schema.extend('imageBlock', {
        allowAttributes: ['imageSource', 'imageCaptionText', 'altText'],
      });
    }

    if (editor.model.schema.isRegistered('imageInline')) {
      editor.model.schema.extend('imageInline', {
        allowAttributes: ['imageSource', 'imageCaptionText', 'altText'],
      });
    }
  }
}
