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
  },
};

export default apiRoutes;
