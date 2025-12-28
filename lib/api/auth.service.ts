import axiosInstance from '../axios';
import { User } from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<User | null> {
    const response = await axiosInstance.get<User[]>(
      `/users?email=${email}&password=${password}`
    );
    return response.data.length > 0 ? response.data[0] : null;
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fakeAccessToken');
      localStorage.removeItem('userData');
    }
  },

  getCurrentUser(): { userId: string | null; role: string | null; userData: User | null } {
    if (typeof window === 'undefined') {
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