export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type Session = { token: string; user: User };
