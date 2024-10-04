import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export async function getReservationsByDate(date) {
    try {
        const response = await axios.get(`${apiUrl}/date/${date}`);
        console.log("Reservations fetched successfully: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching reservations: ", error);
        throw error;
    }
}

export async function postReservation(reservationData) {
    try {
        const response = await axios.post(`${apiUrl}/create`, reservationData);
        console.log("Reservation created successfully: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating reservation: ", error);
        throw error;
    }
}