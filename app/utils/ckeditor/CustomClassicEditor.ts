// app/utils/ckeditor/CustomClassicEditor.ts

import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
} from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import { ClassicEditor as ClassicEditorBase } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Font } from '@ckeditor/ckeditor5-font';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Highlight } from '@ckeditor/ckeditor5-highlight';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import {
  Image,
  ImageBlock,
  ImageEditing,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
} from '@ckeditor/ckeditor5-image';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { Table } from '@ckeditor/ckeditor5-table';
import { FileRepository } from '@ckeditor/ckeditor5-upload';

export default class CustomClassicEditor extends ClassicEditorBase {
  public static override builtinPlugins = [
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
    ImageBlock,
    ImageEditing,
    ImageInsert,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    MediaEmbed,
    Table,
    Font,
    Highlight,
    SourceEditing,
    FileRepository,
  ];

  public static override defaultConfig = {
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
        'linkImage',
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
}
