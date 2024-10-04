import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const checkUserExists = async (email) => {
  try {
    const response = await axios.get(`${apiUrl}/customer/check?email=${email}`);
    return response.data; // This should return { exists: boolean, customerId: number | null }
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${apiUrl}/customer/create`, userData);
    return response.data; // This should return the created user object including customerId
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};