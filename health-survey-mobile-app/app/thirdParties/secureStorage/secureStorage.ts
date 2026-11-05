import { NativeModules } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { secureStorageKeys } from './storageKeys';

export type SecureTokens = {
  accessToken: string;
  refreshToken: string;
};

const service = secureStorageKeys.authTokens;

const isKeychainAvailable = () =>
  Boolean(NativeModules.RNKeychainManager);

export const secureStorage = {
  async saveTokens(tokens: SecureTokens): Promise<void> {
    if (!isKeychainAvailable()) {
      console.warn('[secureStorage] Keychain native module missing — rebuild the app');
      return;
    }

    try {
      await Keychain.setGenericPassword('auth', JSON.stringify(tokens), {
        service,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } catch (error) {
      console.warn('[secureStorage] saveTokens failed', error);
    }
  },

  async getTokens(): Promise<SecureTokens | null> {
    if (!isKeychainAvailable()) {
      console.warn('[secureStorage] Keychain native module missing — rebuild the app');
      return null;
    }

    try {
      const credentials = await Keychain.getGenericPassword({ service });
      if (!credentials) return null;

      const parsed = JSON.parse(credentials.password) as SecureTokens;
      if (!parsed?.accessToken || !parsed?.refreshToken) return null;
      return parsed;
    } catch (error) {
      console.warn('[secureStorage] getTokens failed', error);
      return null;
    }
  },

  async clearTokens(): Promise<void> {
    if (!isKeychainAvailable()) return;

    try {
      await Keychain.resetGenericPassword({ service });
    } catch (error) {
      console.warn('[secureStorage] clearTokens failed', error);
    }
  },
};
