export const api = {
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
};

export const apiMethod = {
  get: "GET",
  post: "POST",
  put: "PUT",
  patch: "PATCH",
  delete: "DELETE",
} as const;

export const apiEndpoints = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    me: "/auth/me",
  },
  dashboard: {
    stats: "/dashboard/stats",
  },
  activities: {
    list: "/activities",
    markRead: (id: string) => `/activities/${id}/read`,
  },
  areas: {
    list: "/areas",
    create: "/areas",
    detail: (id: string) => `/areas/${id}`,
  },
  fieldWorkers: {
    list: "/field-workers",
    create: "/field-workers",
    detail: (id: string) => `/field-workers/${id}`,
    status: (id: string) => `/field-workers/${id}/status`,
    area: (id: string) => `/field-workers/${id}/area`,
  },
  households: {
    list: "/households",
    detail: (id: string) => `/households/${id}`,
  },
  members: {
    byHousehold: (householdId: string) => `/households/${householdId}/members`,
    detail: (id: string) => `/members/${id}`,
  },
  assessments: {
    byMember: (memberId: string) => `/members/${memberId}/assessments`,
    detail: (id: string) => `/assessments/${id}`,
  },
};
