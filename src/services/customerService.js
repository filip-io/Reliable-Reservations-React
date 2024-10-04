import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const checkUserExists = async (email) => {
  try {
    const response = await axios.get(`${apiUrl}/customer/email/${email}`);
    return response.data; // Return user data if found
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // User not found
    } else {
      throw error; // Some other error
    }
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${apiUrl}/customer/create`, userData);
    return response.data; // Return newly created user data
  } catch (error) {
    throw error;
  }
};