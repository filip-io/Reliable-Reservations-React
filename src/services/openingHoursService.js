import axios from 'axios';

const API_URI = 'https://localhost:7271/api/OpeningHours';

export async function getOpeningHours() {
    try {
        const response = await axios.get(`${API_URI}/all`);
        console.log("Opening hours retrieved successfully: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error retrieving opening hours: ", error);
        throw error;
    }
}
