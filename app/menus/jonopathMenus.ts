// components/menus/jonopathMenus.ts

import type { NavItem } from '~~/types/global';

export const headerMenu: NavItem[] = [
  { label: 'মূলপাতা', to: '/' },
  { label: 'রাজনীতি', to: '/topics/politics' },
  { label: 'সর্বাধিক পঠিত', to: '/popular/read' },
  { label: 'বিশ্ব', to: '/topics/world' },
  { label: 'অর্থনীতি', to: '/topics/economy' },
  { label: 'স্বাস্থ্য', to: '/topics/health' },
  { label: 'খেলা', to: '/topics/game' },
  { label: 'প্রযুক্তি', to: '/topics/technology' },
  { label: 'ভিডিও', to: '/topics/video' },
];

export const footerMenu: NavItem[] = [
  {
    label: 'জনপথের ওপর কেন আপনি আস্থা রাখতে পারেন',
    to: '/institutional/trust-and-transparency',
  },
  { label: 'ব্যবহারের শর্তাবলী', to: '/institutional/terms-of-use' },
  { label: 'জনপথ সম্পর্কে', to: '/institutional/about' },
  { label: 'প্রিভেসি নীতি', to: '/institutional/privacy-policy' },
  { label: 'জনপথের সাথে যোগাযোগ করুন', to: '/institutional/contact' },
];
