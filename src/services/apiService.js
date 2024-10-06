import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const checkApiStatus = async () => {
    try {
      const response = await axios.get(`${apiUrl}/status`);
      if (response.status === 200 && response.data.status === 'Online') {
        return true;
      } else {
        throw new Error('API is not online');
      }
    } catch (error) {
      console.error("API is not available:", error);
      throw error;
    }
  };