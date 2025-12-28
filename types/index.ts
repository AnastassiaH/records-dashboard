export interface User {
  id: number;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
}

export interface Record {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}