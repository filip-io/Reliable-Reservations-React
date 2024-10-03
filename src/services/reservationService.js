import axios from 'axios';

const API_URI = 'https://localhost:7271/api/Reservation';

export async function getReservationsByDate(date) {
    try {
        const response = await axios.get(`${API_URI}/date/${date}`);
        console.log("Reservations fetched successfully: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching reservations: ", error);
        throw error;
    }
}

export async function postReservation(reservationData) {
    try {
        const response = await axios.post(`${API_URI}/create`, reservationData);
        console.log("Reservation created successfully: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating reservation: ", error);
        throw error;
    }
}