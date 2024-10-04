import React, { useState, useEffect } from 'react';
import { getReservationsByDate, postReservation } from '../services/reservationService';
import { getTables } from '../services/tableService';
import { getOpeningHours } from '../services/openingHoursService';
import { createUser } from '../services/customerService';
import NumberOfPersonsStep from '../components/reservation/steps/NumberOfPersonsStep';
import DateSelectionStep from '../components/reservation/steps/DateSelectionStep';
import MealSelectionStep from '../components/reservation/steps/MealSelectionStep';
import TimeSelectionStep from '../components/reservation/steps/TimeSelectionStep';
import TableSelectionStep from '../components/reservation/steps/TableSelectionStep';
import SpecialRequestsStep from '../components/reservation/steps/SpecialRequestsStep';
import PersonalDetailsStep from '../components/reservation/steps/PersonalDetailsStep';

function ReservePage() {
  const [currentStep, setCurrentStep] = useState(1);
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
    },
  });
  const [availableTables, setAvailableTables] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchTables();
    fetchOpeningHours();
  }, []);

  useEffect(() => {
    if (reservationData.selectedDate && reservationData.selectedMeal) {
      fetchReservations();
    }
  }, [reservationData.selectedDate, reservationData.selectedMeal]);

  const fetchTables = async () => {
    try {
      const tables = await getTables();
      setAvailableTables(tables);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const fetchOpeningHours = async () => {
    try {
      const hours = await getOpeningHours();
      // Handle opening hours logic here
    } catch (error) {
      console.error("Error fetching opening hours:", error);
    }
  };

  const fetchReservations = async () => {
    try {
      const fetchedReservations = await getReservationsByDate(reservationData.selectedDate);
      setReservations(fetchedReservations);
      updateAvailableTimes();
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const updateAvailableTimes = () => {
    const { selectedMeal } = reservationData;
    let startHour, endHour;

    switch (selectedMeal) {
      case 'Brunch':
        startHour = 10;
        endHour = 12;
        break;
      case 'Lunch':
        startHour = 12;
        endHour = 14;
        break;
      case 'Dinner':
        startHour = 15;
        endHour = 23;
        break;
      default:
        console.log("Invalid meal selection:", selectedMeal);
        return;
    }

    const timeSlots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute === 0 ? '00' : '30'}`;
        timeSlots.push(timeSlot);
      }
    }

    const bookedTimes = reservations.map((reservation) => reservation.time);
    const filteredTimes = timeSlots.filter((time) => !bookedTimes.includes(time) && time <= '21:30');

    setAvailableTimes(filteredTimes);
  };

  const handleNextStep = () => {
    if (currentStep < 7) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handleInputChange = (field, value) => {
    setReservationData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
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

  const handleSubmit = async (personalDetails) => {
    try {
      let customerId = personalDetails.customerId;

      if (!personalDetails.isExistingUser) {
        const newUser = await createUser(personalDetails);
        customerId = newUser.customerId;
      }

      const reservationData = {
        customerId: customerId,
        reservationDate: `${reservationData.selectedDate}T${reservationData.selectedTime}:00.000Z`,
        numberOfGuests: reservationData.numberOfPersons,
        tableNumbers: reservationData.selectedTables.map(table => table.number),
        specialRequests: reservationData.specialRequests
      };

      await postReservation(reservationData);
      // Handle successful reservation (e.g., show confirmation, reset form)
    } catch (error) {
      console.error("Error posting reservation:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="reserve-page">
      <h1>Reserve a Table</h1>
      <p>Book a table at our restaurant and enjoy an amazing dining experience.</p>

      {currentStep === 1 && (
        <NumberOfPersonsStep
          onSelect={(number) => {
            handleInputChange('numberOfPersons', number);
            handleNextStep();
          }}
        />
      )}

      {currentStep === 2 && (
        <DateSelectionStep
          selectedDate={reservationData.selectedDate}
          onDateChange={(date) => handleInputChange('selectedDate', date)}
          onNext={handleNextStep}
        />
      )}

      {currentStep === 3 && (
        <MealSelectionStep
          onSelect={(meal) => {
            handleInputChange('selectedMeal', meal);
            handleNextStep();
          }}
        />
      )}

      {currentStep === 4 && (
        <TimeSelectionStep
          availableTimes={availableTimes}
          onSelect={(time) => {
            handleInputChange('selectedTime', time);
            handleNextStep();
          }}
        />
      )}

      {currentStep === 5 && (
        <TableSelectionStep
          availableTables={availableTables}
          selectedTables={reservationData.selectedTables}
          onSelect={(tables) => handleInputChange('selectedTables', tables)}
          onNext={handleNextStep}
        />
      )}

      {currentStep === 6 && (
        <SpecialRequestsStep
          specialRequests={reservationData.specialRequests}
          onChange={(requests) => handleInputChange('specialRequests', requests)}
          onNext={handleNextStep}
        />
      )}

      {currentStep === 7 && (
        <PersonalDetailsStep
          personalDetails={reservationData.personalDetails}
          onChange={handlePersonalDetailsChange}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default ReservePage;