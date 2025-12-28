import axiosInstance from '../axios';
import { Record } from '@/types';

export const recordsService = {
  async getAll(): Promise<Record[]> {
    const response = await axiosInstance.get<Record[]>('/records');
    return response.data;
  },

  async getById(id: number): Promise<Record> {
    const response = await axiosInstance.get<Record>(`/records/${id}`);
    return response.data;
  },

  async create(data: Omit<Record, 'id'>): Promise<Record> {
    const response = await axiosInstance.post<Record>('/records', data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/records/${id}`);
  },

  async update(id: number, data: Partial<Record>): Promise<Record> {
    const response = await axiosInstance.put<Record>(`/records/${id}`, data);
    return response.data;
  },
};