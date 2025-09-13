export const errorMessages = {
  // Validation messages
  userName: {
    required: 'ব্যবহারকারীর নাম আবশ্যক।',
    minLength: 'ব্যবহারকারীর নাম কমপক্ষে ৩ অক্ষরের হতে হবে।',
  },
  email: {
    required: 'ইমেইল আবশ্যক।',
    invalid: 'ইমেইল ফরম্যাট ভুল হয়েছে। উদাহরণ: user@example.com',
    exists: 'এই ইমেলটি ইতিমধ্যেই নিবন্ধিত।',
    notFound: 'এই ইমেল দিয়ে কোনো ব্যবহারকারী পাওয়া যায়নি।',
  },
  password: {
    required: 'পাসওয়ার্ড আবশ্যক।',
    minLength: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।',
    incorrect: 'পাসওয়ার্ড ভুল হয়েছে।',
  },

  // API/general messages
  server: 'সার্ভার ত্রুটি: অনুরোধটি সম্পন্ন করা যায়নি।',
  validationFailed: 'যাচাইকরণ ব্যর্থ হয়েছে।',
  registrationSuccess: 'ব্যবহারকারী সফলভাবে নিবন্ধিত হয়েছে।',
  emailAlreadyUsed: 'এই ইমেলটি ইতিমধ্যেই ব্যবহৃত হয়েছে।',
  loginSuccess: 'সফলভাবে লগইন হয়েছে।',
  loginFailed: 'লগইন ব্যর্থ হয়েছে। ইমেল অথবা পাসওয়ার্ড ভুল হয়েছে।',
};
