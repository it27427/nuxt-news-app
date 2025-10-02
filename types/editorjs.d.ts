// types/editorjs.d.ts

declare module '@editorjs/editorjs' {
  export interface BlockToolConstructorOptions<T = any> {
    data?: T;
    api?: any;
    config?: any;
  }

  export interface BlockTool<T = any> {
    data: T;
    wrapper: HTMLElement;
    render(): HTMLElement;
    save?(block: HTMLElement): T;
  }

  const EditorJS: any;
  export default EditorJS;
}

declare module '@editorjs/editorjs';
declare module '@editorjs/header';
declare module '@editorjs/list';
declare module '@editorjs/checklist';
declare module '@editorjs/table';
declare module '@editorjs/quote';
declare module '@editorjs/code';
declare module '@editorjs/delimiter';
declare module '@editorjs/inline-code';
declare module '@editorjs/embed';
declare module '@editorjs/link';
declare module '@editorjs/warning';
declare module '@editorjs/raw';
declare module '@editorjs/marker';
declare module '@editorjs/paragraph';
