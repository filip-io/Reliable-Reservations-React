import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export async function getTables() {
    try {
        const response = await axios.get(`${apiUrl}/Table/all`);   
        console.log("Tables fetched successfully: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching tables: ", error);
        throw error;
    }
}