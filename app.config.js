
export default {
  name: 'smartuzapp-mobile',
  slug: 'smartuzapp-mobile',
  scheme: 'smartuzapp',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#1ab94d'
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'app.lovable.86b34e30d76a4d429ddf5844032efe12'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#1ab94d'
    },
    package: 'app.lovable.86b34e30d76a4d429ddf5844032efe12'
  },
  web: {
    favicon: './assets/favicon.png'
  }
};
