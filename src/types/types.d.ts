export type signupUserType = {
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
};

export type responseType = {
  status: number;
  message?: string;
  body?: any;
};
