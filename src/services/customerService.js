import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const checkCustomerExists = async (email) => {
  try {
    const response = await axios.get(`${apiUrl}/customer/email/${email}`);
    return response.data; // Return user data if found, including customerId
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // User not found
    } else {
      throw error; // Some other error
    }
  }
};

export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(`${apiUrl}/customer/create`, customerData);
    return response.data; // Return newly created customer data, including customerId
  } catch (error) {
    throw error;
  }
};