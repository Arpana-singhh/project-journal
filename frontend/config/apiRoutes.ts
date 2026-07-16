const apiRoutes = {
  auth: {
    register: "/register",
    login: "/login",
  },
  projects: {
    create: "/projects",
    list: "/projects",
    getById: (id: string) => `/projects/${id}`,
  },
  invites: {
    create: (projectId: string) => `/projects/${projectId}/invite`,
    accept: (token: string) => `/invite/${token}/accept`,
    members: (projectId: string) => `/projects/${projectId}/members`,
  },
  meetings: {
    create: (projectId: string) => `/projects/${projectId}/meetings`,
    list: (projectId: string) => `/projects/${projectId}/meetings`,
    update: (meetingId: string) => `/meetings/${meetingId}`,
    delete: (meetingId: string) => `/meetings/${meetingId}`,
  },
};

export default apiRoutes;
