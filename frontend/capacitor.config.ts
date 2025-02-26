import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.app.id',
  appName: 'appName',
  webDir: 'dist',
  // server: {
  // 	url: 'http://192.168.80.1:8081',
  // 	cleartext: true
  // },
  plugins: {
    SafeArea: {
      enabled: true,
      customColorsForSystemBars: true,
      statusBarColor: '#ffffff',
      statusBarContent: 'dark',
      navigationBarColor: '#ffffff',
      navigationBarContent: 'dark',
      offset: 0
    }
  }
}

export default config
