import axios from 'axios';

const API_URI = 'https://localhost:7271/api/Table';

export async function getTables() {
    try {
        const response = await axios.get(`${API_URI}/all`);
        console.log("Tables fetched successfully: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching tables: ", error);
        throw error;
    }
}