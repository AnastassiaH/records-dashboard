import axiosInstance from '../axios';
import { User } from '@/types';

export const usersService = {
  async getAll(): Promise<User[]> {
    const response = await axiosInstance.get<User[]>('/users');
    return response.data;
  },

  async getById(id: number): Promise<User> {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  },

  async update(id: number, data: Partial<User>): Promise<User> {
    const response = await axiosInstance.put<User>(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/users/${id}`);
  },
};