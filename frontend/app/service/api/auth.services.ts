

type ApiResponse = {
    success: boolean;
    message: string;
    token?: string;
    user?: unknown;
};

type RegisterPayload = {
    name: string;
    email: string;
    password: string;
  };
  
