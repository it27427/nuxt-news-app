// menus/adminMenus.ts
export const adminMenus = [
  {
    label: 'ড্যাশবোর্ড',
    to: '/admin/dashboard',
    icon: 'streamline-freehand:dashboard-browser-gauge',
    roles: ['super_admin', 'publisher'],
  },
  {
    label: 'সংবাদ তৈরি করুন',
    to: '/admin/create-news',
    icon: 'basil:edit-outline',
    roles: ['super_admin', 'publisher'],
  },
  {
    label: 'সংবাদ তালিকা',
    to: '/admin/news-list',
    icon: 'fluent-mdl2:product-list',
    roles: ['super_admin', 'publisher'],
  },
  {
    label: 'ট্যাগ তৈরি করুন',
    to: '/admin/create-tag',
    icon: 'oui:tag',
    roles: ['super_admin'],
  },
  {
    label: 'ট্যাগ তালিকা',
    to: '/admin/tag-list',
    icon: 'streamline-freehand:task-list-pin-1',
    roles: ['super_admin'],
  },
  {
    label: 'স্বয়ংক্রিয়তা',
    to: '/admin/automations',
    icon: 'carbon:ibm-event-automation',
    roles: ['super_admin'],
  },
  {
    label: 'ব্যবহারকারী তৈরি করুন',
    to: '/admin/create-user',
    icon: 'famicons:create-outline',
    roles: ['super_admin'],
  },
  {
    label: 'ব্যবহারকারীর তালিকা',
    to: '/admin/users-list',
    icon: 'garden:user-list-stroke-16',
    roles: ['super_admin'],
  },
  {
    label: 'সংরক্ষণাগার',
    to: '/admin/drafts',
    icon: 'fluent:drafts-20-regular',
    roles: ['super_admin', 'publisher'],
  },
  {
    label: 'বিজ্ঞপ্তি',
    to: '/admin/notifications',
    icon: 'carbon:notification',
    roles: ['super_admin', 'publisher'],
  },
  {
    label: 'অনুমোদন',
    to: '/admin/approval',
    icon: 'fluent:approvals-app-32-regular',
    roles: ['super_admin', 'publisher'],
  },
  {
    label: 'লগ আউট',
    action: 'logout',
    icon: 'ri:logout-circle-r-line',
    roles: ['super_admin', 'publisher'],
  },
];
