// app/utils/ckeditor/ImageSourceUI.ts

import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';
import ImageSourceEditing from '~/utils/ckeditor/ImageSourcePlugin';

export interface ImageDetails {
  caption: string;
  source: string;
}

export interface ImageDetailsModalEvent {
  currentCaption: string;
  currentSource: string;
  callback: (details: ImageDetails | null) => void;
}

export default class ImageSourceUI extends Plugin {
  static get requires() {
    return [ImageSourceEditing];
  }

  init() {
    const editor = this.editor;
    const t = editor.t;

    editor.ui.componentFactory.add('imageSource', (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: t('Set Image Details') as string,
        icon: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M16 4H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 6h12v8H4V6zm2 3h8v1H6V9zm0 2h6v1H6v-1z"/></svg>',
        tooltip: true,
      });

      button.on('execute', () => {
        const imageElement =
          editor.model.document.selection.getSelectedElement();

        if (
          imageElement &&
          (imageElement.name === 'imageBlock' ||
            imageElement.name === 'imageInline')
        ) {
          const currentSource =
            (imageElement.getAttribute('imageSource') as string) || '';
          const currentCaption =
            (imageElement.getAttribute('imageCaptionText') as string) || ''; // ধরে নিলাম আপনি ImageSourcePlugin এ 'imageCaptionText' অ্যাট্রিবিউট যোগ করেছেন

          const callback = (details: ImageDetails | null) => {
            if (details) {
              editor.model.change((writer) => {
                writer.setAttribute(
                  'imageSource',
                  details.source,
                  imageElement
                );
                writer.setAttribute(
                  'imageCaptionText',
                  details.caption,
                  imageElement
                );
              });
            } else {
              console.log('Image details input cancelled.');
            }
          };

          editor.fire('request:imageDetailsModal', {
            currentCaption: currentCaption,
            currentSource: currentSource,
            callback: callback,
          });
        } else {
          editor.fire('request:alert', {
            message: t('Please select an image first.') as string,
          });
        }
      });

      return button;
    });
  }
}
