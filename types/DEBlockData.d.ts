// types/DEBlockData

type DEDecoration = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code';

type DETextalign = 'left' | 'right' | 'center' | 'justify';

type DEBlockData =
  | DETextBlock
  | DEHeadingBlock
  | DEListBlock
  | DEImageBlock
  | DECodeBlock
  | DECustomBlock;

interface DETextBlock {
  type: 'text';
  classList: string[];
  depth?: number;
  textContent: string;
}

interface DEHeadingBlock {
  type: 'heading';
  level: number;
  id: string;
  depth?: number;
  classList: string[];
  textContent: string;
}

interface DEListItem {
  classList: string[];
  textContent: string;
}

interface DEListBlock {
  type: 'list';
  element: DEListElementName;
  depth?: number;
  style: DEListStyle;
  child: DEListItem[];
}

interface DEImageBlock {
  type: 'image';
  maxWidth: number;
  src: string;
  width: number;
  height: number;
  caption: string;
  classList: string[];
}

interface DECodeBlock {
  type: 'code';
  language: DECodeblockLang;
  theme: DECodeblockTheme;
  filename: string;
  textContent: string;
}

interface DECustomBlock {
  type: 'custom';
  classList: string[];
  textContent: string;
}
