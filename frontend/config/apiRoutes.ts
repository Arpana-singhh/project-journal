import config from "./config";

const apiRoutes = {
  auth: {
    register: `${config.baseUrl}/register`,
    login: `${config.baseUrl}/login`,
  },
};

export default apiRoutes;
