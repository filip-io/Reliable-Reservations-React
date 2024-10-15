import { useState } from 'react';
import { postReservation } from '../services/reservationService';

export const useReservation = () => {
  const [reservationData, setReservationData] = useState({
    numberOfPersons: 0,
    selectedDate: '',
    selectedMeal: '',
    selectedTime: '',
    selectedTables: [],
    specialRequests: '',
    personalDetails: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      customerId: null,
    },
    timeSlotInfo: [],
  });

  const handleInputChange = (field, value) => {
    setReservationData((prevData) => {
      const newData = { ...prevData, [field]: value };

      // Reset selected tables if number of persons changes
      if (field === 'numberOfPersons') {
        newData.selectedTables = [];
      }

      return newData;
    });
  };

  const handlePersonalDetailsChange = (field, value) => {
    setReservationData((prevData) => ({
      ...prevData,
      personalDetails: {
        ...prevData.personalDetails,
        [field]: value,
      },
    }));
  };

  const submitReservation = async () => {
    try {
      const reservationDataToSubmit = {
        customerId: reservationData.personalDetails.customerId,
        reservationDate: `${reservationData.selectedDate}T${reservationData.selectedTime}:00.000Z`,
        numberOfGuests: reservationData.numberOfPersons,
        tableNumbers: reservationData.selectedTables,
        specialRequests: reservationData.specialRequests || 'None'
      };
      console.log('Submitting reservation data:', reservationDataToSubmit);
      const response = await postReservation(reservationDataToSubmit);
      console.log('Reservation created successfully:', response);
      return response;
    } catch (error) {
      console.error("Error posting reservation:", error);
      throw error;
    }
  };

  return {
    reservationData,
    setReservationData,
    handleInputChange,
    handlePersonalDetailsChange,
    submitReservation,
  };
};