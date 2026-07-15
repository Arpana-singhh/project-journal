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
};

export default apiRoutes;
