import axios from 'axios';

export interface HttpClient {
  getJson<T = unknown>(url: string): Promise<T>;
}

export const axiosHttpClient: HttpClient = {
  async getJson<T = unknown>(url: string): Promise<T> {
    const response = await axios.get<T>(url);
    return response.data;
  },
};
