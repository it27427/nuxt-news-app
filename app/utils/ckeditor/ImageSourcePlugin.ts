// app/utils/ckeditor/ImageSourcePlugin.ts

import type { Editor } from '@ckeditor/ckeditor5-core';
import { Plugin } from '@ckeditor/ckeditor5-core';
import type { ViewDowncastWriter } from '@ckeditor/ckeditor5-engine/src/view/downcastwriter';
import type { ViewElement } from '@ckeditor/ckeditor5-engine/src/view/element';

const IMAGE_SOURCE_ATTRIBUTE = 'imageSource';
const IMAGE_SIZE_ATTRIBUTE = 'imageSize';
const IMAGE_CAPTION_TEXT_ATTRIBUTE = 'imageCaptionText';

export default class ImageSourcePlugin extends Plugin {
  static get requires() {
    return ['ImageEditing'];
  }

  constructor(editor: Editor) {
    super(editor);
  }

  init() {
    const editor = this.editor;

    editor.model.schema.extend('imageBlock', {
      allowAttributes: [
        IMAGE_SOURCE_ATTRIBUTE,
        IMAGE_SIZE_ATTRIBUTE,
        IMAGE_CAPTION_TEXT_ATTRIBUTE,
      ],
    });
    editor.model.schema.extend('imageInline', {
      allowAttributes: [
        IMAGE_SOURCE_ATTRIBUTE,
        IMAGE_SIZE_ATTRIBUTE,
        IMAGE_CAPTION_TEXT_ATTRIBUTE,
      ],
    });

    this._defineConversion(IMAGE_SOURCE_ATTRIBUTE, 'data-image-source');
    this._defineConversion(IMAGE_SIZE_ATTRIBUTE, 'data-image-size');
    this._defineConversion(
      IMAGE_CAPTION_TEXT_ATTRIBUTE,
      'data-image-caption-text'
    );
  }

  _defineConversion(modelAttribute: string, viewAttribute: string) {
    const editor = this.editor;

    editor.conversion.for('upcast').attributeToAttribute({
      view: {
        name: /^(img|figure)$/,
        key: viewAttribute,
      },
      model: modelAttribute,
    });

    editor.conversion.for('downcast').attributeToAttribute({
      model: modelAttribute,
      view: (modelAttributeValue: string | null, api: any) => {
        const { writer, element } = api as {
          writer: ViewDowncastWriter;
          element: ViewElement;
        };

        if (!modelAttributeValue) {
          return null;
        }

        return writer.setAttribute(viewAttribute, modelAttributeValue, element);
      },
    } as any);
  }
}
