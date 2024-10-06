import React, { useState, useEffect } from 'react';
import { getReservationsByDate, postReservation } from '../../services/reservationService';
import { getTables } from '../../services/tableService';
import { getOpeningHours } from '../../services/openingHoursService';
import { createUser } from '../../services/customerService';
import NumberOfPersonsStep from './steps/NumberOfPersonsStep';
import DateSelectionStep from './steps/DateSelectionStep';
import MealSelectionStep from './steps/MealSelectionStep';
import TimeSelectionStep from './steps/TimeSelectionStep';
import TableSelectionStep from './steps/TableSelectionStep';
import SpecialRequestsStep from './steps/SpecialRequestsStep';
import PersonalDetailsStep from './steps/PersonalDetailsStep';

function ReservePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [reservationData, setReservationData] = useState({
    numberOfPersons: 0,
    selectedDate: '',
    selectedMeal: '',
    selectedTime: '',
    selectedTables: [],
    specialRequests: 'None',
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
  const [openingDays, setOpeningDays] = useState([]);

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
      // Convert the response into an array of open days
      const openDays = hours
        .filter(hour => !hour.isClosed) // Filter out closed days
        .map(hour => {
          switch (hour.dayOfWeek) {
            case "Sunday": return 0;
            case "Monday": return 1;
            case "Tuesday": return 2;
            case "Wednesday": return 3;
            case "Thursday": return 4;
            case "Friday": return 5;
            case "Saturday": return 6;
            default: return null;
          }
        })
        .filter(day => day !== null);
      
      setOpeningDays(openDays); // Store the array of open days
    } catch (error) {
      console.error("Error fetching opening hours:", error);
    }
  };

  
  const fetchReservations = async () => {
    try {
      const fetchedReservations = await getReservationsByDate(reservationData.selectedDate);
      setReservations(fetchedReservations);
      updateAvailableTimes(fetchedReservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  // Update available time slots based on selected meal and existing reservations
  const updateAvailableTimes = (reservationsForDate) => {
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

    // Get booked time slots from the reservations response
    const bookedTimeSlots = reservationsForDate.flatMap((reservation) => {
      return reservation.timeSlots.map((slot) => ({
        startTime: slot.startTime.slice(11, 16), // Extract time from datetime
        endTime: slot.endTime.slice(11, 16),
      }));
    });

    // Filter time slots to exclude those overlapping with booked slots
    const filteredTimes = timeSlots.filter((time) => {
      // Check if the time overlaps with any booked slots
      return !bookedTimeSlots.some((slot) => {
        const [startHour, startMinute] = slot.startTime.split(':').map(Number);
        const [endHour, endMinute] = slot.endTime.split(':').map(Number);
        const start = startHour * 60 + startMinute;
        const end = endHour * 60 + endMinute;
        const selectedTime = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);

        return selectedTime >= start && selectedTime < end;
      });
    });

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

  const handleSubmit = async ({ personalDetails, isExistingUser, customerId }) => {
    try {
      const reservationDataToSubmit = {
        customerId,
        reservationDate: `${reservationData.selectedDate}T${reservationData.selectedTime}:00.000Z`,
        numberOfGuests: reservationData.numberOfPersons,
        tableNumbers: reservationData.selectedTables,
        specialRequests: reservationData.specialRequests
      };

      const response = await postReservation(reservationDataToSubmit);
      console.log('Reservation created successfully:', response);
      // Handle success (e.g., show confirmation, reset form)
    } catch (error) {
      console.error("Error posting reservation:", error);
      // Handle error (e.g., show error message)
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
          openingDays={openingDays}
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