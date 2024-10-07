import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export async function getExistingReservations(date) {
    try {
        const response = await axios.get(`${apiUrl}/Reservation/existing`, {
            params: { date: date }
        });
        console.log("Existing reservations fetched successfully: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching existing reservations: ", error);
        throw error;
    }
}

export async function postReservation(reservationData) {
    console.log(reservationData)
    try {
        const response = await axios.post(`${apiUrl}/Reservation/create`, reservationData);
        console.log("Reservation created successfully: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating reservation: ", error);
        throw error;
    }
}