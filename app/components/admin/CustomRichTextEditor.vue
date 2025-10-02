<template>
  <div class="editor-wrapper w-full min-h-screen bg-gray-900 text-gray-100">
    <!-- Sticky Bubble Menu -->
    <div
      class="sticky top-0 bg-gray-800 text-gray-100 p-2 flex flex-wrap gap-2 z-30"
    >
      <!-- Custom Font Select -->
      <div class="relative" @click="toggleDropdown('font')">
        <button
          class="bg-gray-700 text-gray-100 px-2 py-1 rounded flex items-center justify-between w-32"
        >
          {{ bubble.font || 'Font' }}
          <span>▼</span>
        </button>
        <div
          v-if="dropdownOpen.font"
          class="absolute top-full left-0 bg-gray-700 text-gray-100 w-32 mt-1 rounded shadow-lg z-30"
        >
          <div
            v-for="f in fonts"
            :key="f"
            class="px-2 py-1 hover:bg-gray-600 cursor-pointer"
            @click.stop="selectFont(f)"
          >
            {{ f }}
          </div>
        </div>
      </div>

      <!-- Custom Size Select -->
      <div class="relative" @click="toggleDropdown('size')">
        <button
          class="bg-gray-700 text-gray-100 px-2 py-1 rounded flex items-center justify-between w-24"
        >
          {{ bubble.size || 'Size' }}
          <span>▼</span>
        </button>
        <div
          v-if="dropdownOpen.size"
          class="absolute top-full left-0 bg-gray-700 text-gray-100 w-24 mt-1 rounded shadow-lg z-30"
        >
          <div
            v-for="s in sizes"
            :key="s"
            class="px-2 py-1 hover:bg-gray-600 cursor-pointer"
            @click.stop="selectSize(s)"
          >
            {{ s }}
          </div>
        </div>
      </div>

      <!-- Custom ListType Select -->
      <div class="relative" @click="toggleDropdown('listType')">
        <button
          class="bg-gray-700 text-gray-100 px-2 py-1 rounded flex items-center justify-between w-32"
        >
          {{ bubble.listType || 'Lists' }}
          <span>▼</span>
        </button>
        <div
          v-if="dropdownOpen.listType"
          class="absolute top-full left-0 bg-gray-700 text-gray-100 w-32 mt-1 rounded shadow-lg z-30"
        >
          <div
            v-for="l in listTypes"
            :key="l.value"
            class="px-2 py-1 hover:bg-gray-600 cursor-pointer"
            @click.stop="selectListType(l.value as '' | 'ul' | 'ol' | 'task')"
          >
            {{ l.label }}
          </div>
        </div>
      </div>

      <!-- Text Styling Buttons -->
      <button
        @click="wrapSelection('strong')"
        class="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
      >
        B
      </button>
      <button
        @click="wrapSelection('em')"
        class="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
      >
        I
      </button>
      <button
        @click="wrapSelection('span', { textDecoration: 'underline' })"
        class="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
      >
        U
      </button>
      <button
        @click="wrapSelection('span', { textDecoration: 'line-through' })"
        class="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
      >
        S
      </button>
      <button
        @click="toggleHighlight"
        class="bg-yellow-400 text-gray-900 px-2 py-1 rounded hover:bg-yellow-300"
      >
        H
      </button>

      <!-- Nodes -->
      <button
        @click="openModal('link')"
        class="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
      >
        Link
      </button>
      <button
        @click="openModal('image')"
        class="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
      >
        Image
      </button>
      <button
        @click="openModal('video')"
        class="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
      >
        Video
      </button>
      <button
        @click="insertNode('code')"
        class="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
      >
        Code
      </button>
      <button
        @click="insertNode('blockquote')"
        class="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
      >
        BQ
      </button>
      <button
        @click="insertNode('hr')"
        class="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
      >
        HR
      </button>

      <!-- Undo / Redo -->
      <button
        @click="undo"
        class="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
      >
        ↺
      </button>
      <button
        @click="redo"
        class="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
      >
        ↻
      </button>
    </div>

    <!-- Scrollable Editor -->
    <div
      ref="editor"
      contenteditable="true"
      @input="updateContent"
      class="editor p-4 min-h-[400px] max-h-[600px] overflow-y-auto bg-gray-900 text-gray-100"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';

  interface Bubble {
    font: string;
    size: string;
    listType: '' | 'ul' | 'ol' | 'task';
  }

  const editor = ref<HTMLDivElement | null>(null);
  const content = ref<string>('');

  const bubble = reactive<Bubble>({ font: '', size: '', listType: '' });
  const dropdownOpen = reactive<{
    font: boolean;
    size: boolean;
    listType: boolean;
  }>({
    font: false,
    size: false,
    listType: false,
  });

  const fonts = ['Arial', 'Courier New', 'Times New Roman'];
  const sizes = ['12px', '16px', '20px', '24px'];
  const listTypes = [
    { label: 'Unordered List', value: 'ul' },
    { label: 'Ordered List', value: 'ol' },
    { label: 'Task List', value: 'task' },
  ];

  // Dropdown
  function toggleDropdown(type: 'font' | 'size' | 'listType') {
    dropdownOpen[type] = !dropdownOpen[type];
  }
  function selectFont(f: string) {
    bubble.font = f;
    applyFont();
    dropdownOpen.font = false;
  }
  function selectSize(s: string) {
    bubble.size = s;
    applyFontSize();
    dropdownOpen.size = false;
  }
  function selectListType(value: '' | 'ul' | 'ol' | 'task') {
    bubble.listType = value;
    applyList();
    dropdownOpen.listType = false;
  }

  // Selection / Formatting
  function getSelectionRange(): Range | null {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    return sel.getRangeAt(0);
  }
  function wrapSelection(tag: string, style: Record<string, string> = {}) {
    const range = getSelectionRange();
    if (!range || range.collapsed) return;
    const wrapper = document.createElement(tag);
    Object.assign(wrapper.style, style);
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);
    selectNode(wrapper);
    updateContent();
  }
  function selectNode(node: Node) {
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    const range = document.createRange();
    range.selectNodeContents(node);
    sel.addRange(range);
  }
  function applyStyleToSelection(style: Record<string, string>) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (range.collapsed) return;
    const span = document.createElement('span');
    Object.assign(span.style, style);
    span.appendChild(range.extractContents());
    range.insertNode(span);
    selectNode(span);
  }
  function applyFont() {
    if (bubble.font) applyStyleToSelection({ fontFamily: bubble.font });
  }
  function applyFontSize() {
    if (bubble.size) applyStyleToSelection({ fontSize: bubble.size });
  }
  function applyList() {
    const type = bubble.listType;
    const range = getSelectionRange();
    if (!range) return;
    const lines = range.toString().split('\n');
    let wrapper: HTMLElement;
    if (type === 'task') {
      wrapper = document.createElement('div');
      lines.forEach((line) => {
        const div = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        div.appendChild(checkbox);
        div.appendChild(document.createTextNode(' ' + line));
        wrapper.appendChild(div);
      });
    } else if (type === 'ul' || type === 'ol') {
      wrapper = document.createElement(type);
      lines.forEach((line) => {
        const li = document.createElement('li');
        li.textContent = line;
        wrapper.appendChild(li);
      });
    } else return;
    range.deleteContents();
    range.insertNode(wrapper);
    bubble.listType = '';
    updateContent();
  }

  function updateContent() {
    if (!editor.value) return;
    content.value = editor.value.innerHTML;
  }

  // --- Fix missing functions ---
  function toggleHighlight() {
    /* add highlight logic */
  }
  function openModal(type: 'link' | 'image' | 'video') {
    /* add modal logic */
  }
  function insertNode(type: 'code' | 'blockquote' | 'hr') {
    /* add insert logic */
  }
  function undo() {
    document.execCommand('undo');
  }
  function redo() {
    document.execCommand('redo');
  }
</script>
