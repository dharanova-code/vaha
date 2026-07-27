export const deepLinkingConfig = {
  prefixes: ["vaha://", "https://vaha.io", "https://*.vaha.io"],
  config: {
    screens: {
      "(tabs)": {
        path: "",
        screens: {
          "home/index": "home",
          "captures/index": "captures",
          "insights/index": "insights",
          "device/index": "device",
          "settings/index": "settings",
        },
      },
      "(modals)/capture-details": "capture/:id",
    },
  },
};
