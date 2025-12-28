import axiosInstance from '../axios';
import { User } from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const response = await axiosInstance.get<User[]>(`/users?email=${email}`);
    if (response.data.length === 0) return null;

    const user = response.data[0];

    if (user.password !== password) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fakeAccessToken');
      localStorage.removeItem('userData');
    }
  },

  getCurrentUser(): { userId: string | null; role: string | null; userData: User | null } {
    const token = localStorage.getItem('fakeAccessToken');
    if (!token) {
      return { userId: null, role: null, userData: null };
    }
    const userData = localStorage.getItem('userData');
    const parsedUser = userData ? JSON.parse(userData) : null;

    return {
      userId: parsedUser?.id?.toString() || null,
      role: parsedUser?.role || null,
      userData: parsedUser
    };
  },
};