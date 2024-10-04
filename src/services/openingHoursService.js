import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export async function getOpeningHours() {
    try {
        const response = await axios.get(`${apiUrl}/OpeningHours/all`);
        console.log("Opening hours retrieved successfully: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error retrieving opening hours: ", error);
        throw error;
    }
}
