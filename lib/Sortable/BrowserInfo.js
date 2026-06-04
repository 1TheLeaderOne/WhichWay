function userAgent(pattern) {
  if (typeof window !== "undefined" && window.navigator) {
    return !!/* @__PURE__ */ navigator.userAgent.match(pattern);
  }
}
const IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
const Edge = userAgent(/Edge/i);
const FireFox = userAgent(/firefox/i);
const Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
const IOS = userAgent(/iP(ad|od|hone)/i);
const ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);
export {
  ChromeForAndroid,
  Edge,
  FireFox,
  IE11OrLess,
  IOS,
  Safari
};
//# sourceMappingURL=BrowserInfo.js.map
