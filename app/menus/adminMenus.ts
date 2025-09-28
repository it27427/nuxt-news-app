// components/menus/adminMenus.ts

import type { AdminMenuType } from '~~/types/admin';

export const adminMenus: AdminMenuType[] = [
  {
    label: 'ড্যাশবোর্ড',
    to: '/admin/dashboard',
    icon: 'streamline-freehand:dashboard-browser-gauge',
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'সংবাদ তৈরি করুন',
    to: '/admin/news/create',
    icon: 'basil:edit-outline',
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'সংবাদ তালিকা',
    to: '/admin/news',
    icon: 'fluent-mdl2:product-list',
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'ধরন তৈরি করুন',
    to: '/admin/categories/create',
    icon: 'oui:ml-create-single-metric-job',
    roles: ['super_admin'],
  },
  {
    label: 'ধরন তালিকা',
    to: '/admin/categories',
    icon: 'carbon:categories',
    roles: ['super_admin'],
  },
  {
    label: 'ট্যাগ তৈরি করুন',
    to: '/admin/tags/create',
    icon: 'oui:tag',
    roles: ['super_admin'],
  },
  {
    label: 'ট্যাগ তালিকা',
    to: '/admin/tags',
    icon: 'streamline-freehand:task-list-pin-1',
    roles: ['super_admin'],
  },
  {
    label: 'স্বয়ংক্রিয়তা',
    to: '/admin/automations',
    icon: 'carbon:ibm-event-automation',
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'ব্যবহারকারী তৈরি করুন',
    to: '/admin/users/create',
    icon: 'famicons:create-outline',
    roles: ['super_admin'],
  },
  {
    label: 'ব্যবহারকারীর তালিকা',
    to: '/admin/users',
    icon: 'garden:user-list-stroke-16',
    roles: ['super_admin'],
  },
  {
    label: 'সংরক্ষণাগার',
    to: '/admin/drafts',
    icon: 'fluent:drafts-20-regular',
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'বিজ্ঞপ্তি',
    to: '/admin/notifications',
    icon: 'carbon:notification',
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'অনুমোদন',
    to: '/admin/approval',
    icon: 'fluent:approvals-app-32-regular',
    roles: ['super_admin'],
  },
  {
    label: 'লগ আউট',
    action: 'logout',
    icon: 'ri:logout-circle-r-line',
    roles: ['super_admin', 'admin'],
  },
];
