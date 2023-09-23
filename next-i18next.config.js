/** @type {import('next-i18next').UserConfig} */
module.exports = {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: "en",
    // locales: ["en", "de", "zh-CN", "zh-TW", "ja-JP"],
  },
  reloadOnPrerender: process.env.NODE_ENV === "development",
   localeDetection: false,
};
