import { Platform } from 'react-native';

/** Android emulator → host machine; iOS simulator → localhost */
const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const api = {
  baseUrl: `http://${host}:4000/api`,
};

export const apiMethod = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  patch: 'PATCH',
  delete: 'DELETE',
} as const;

export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  households: {
    list: '/households',
    detail: (id: string) => `/households/${id}`,
    create: '/households',
  },
  members: {
    byHousehold: (householdId: string) =>
      `/households/${householdId}/members`,
    detail: (id: string) => `/members/${id}`,
  },
  assessments: {
    byMember: (memberId: string) => `/members/${memberId}/assessments`,
    detail: (id: string) => `/assessments/${id}`,
  },
  sync: {
    push: '/sync/push',
    pull: '/sync/pull',
  },
};
