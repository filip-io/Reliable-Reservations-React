import React, { useState, useEffect } from 'react';
import { getExistingReservations, postReservation } from '../../services/reservationService';
import { getTables } from '../../services/tableService';
import { getOpeningHours } from '../../services/openingHoursService';
import ReservationProgress from './components/ReservationProgress';
import NumberOfPersonsStep from './steps/NumberOfPersonsStep';
import DateSelectionStep from './steps/DateSelectionStep';
import MealSelectionStep from './steps/MealSelectionStep';
import TimeSelectionStep from './steps/TimeSelectionStep';
import TableSelectionStep from './steps/TableSelectionStep';
import SpecialRequestsStep from './steps/SpecialRequestsStep';
import PersonalDetailsStep from './steps/PersonalDetailsStep';
import ConfirmationStep from './steps/ConfirmationStep';
import ConfirmationMessage from './components/ConfirmationMessage';
import './ReservePage.css';

function ReservePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;
  const [availableTablesForSelectedTime, setAvailableTablesForSelectedTime] = useState([]);
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

  const [isReservationConfirmed, setIsReservationConfirmed] = useState(false);
  const [isPageFading, setIsPageFading] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [openingDays, setOpeningDays] = useState([]);
  const [openingHours, setOpeningHours] = useState([]);

  // Fetch once on mount or when tables and openinghours have been reset to 0
  useEffect(() => {
    if (availableTables.length === 0) fetchTables();
    if (openingHours.length === 0) fetchOpeningHours();
  }, []);

  useEffect(() => {
    if (reservationData.selectedDate && reservationData.selectedMeal && availableTables.length > 0) {
      fetchReservations();
    }
  }, [reservationData.selectedDate, reservationData.selectedMeal, availableTables]);

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
      console.log("Raw opening hours data:", hours);

      const openDays = hours
        .filter(hour => !hour.isClosed)
        .map(hour => {
          const [openHour, openMinute] = hour.openTime.split(':').map(Number);
          const [closeHour, closeMinute] = hour.closeTime.split(':').map(Number);
          return {
            dayOfWeek: hour.dayOfWeek,
            openingHour: openHour,
            openingMinute: openMinute,
            closingHour: closeHour,
            closingMinute: closeMinute
          };
        });

      console.log("Parsed opening hours:", openDays);
      setOpeningHours(openDays);

      const numericDays = openDays.map(day => {
        switch (day.dayOfWeek) {
          case "Sunday": return 0;
          case "Monday": return 1;
          case "Tuesday": return 2;
          case "Wednesday": return 3;
          case "Thursday": return 4;
          case "Friday": return 5;
          case "Saturday": return 6;
          default: return null;
        }
      }).filter(day => day !== null);

      console.log("Numeric days:", numericDays);
      setOpeningDays(numericDays);

    } catch (error) {
      console.error("Error fetching opening hours:", error);
    }
  };

  const getSelectedDayOpeningHours = () => {
    if (!reservationData.selectedDate) return null;
    const selectedDay = new Date(reservationData.selectedDate).toLocaleString('en-us', { weekday: 'long' });
    return openingHours.find(day => day.dayOfWeek === selectedDay) || null;
  };

  const fetchReservations = async () => {
    try {
      const existingReservations = await getExistingReservations(reservationData.selectedDate);
      setReservations(existingReservations);
      updateAvailableTimes(existingReservations);
    } catch (error) {
      console.error("Error fetching existing reservations:", error);
    }
  };

  const updateAvailableTimes = (existingReservations) => {
    console.log("Starting updateAvailableTimes");
    const { selectedMeal, selectedDate, numberOfPersons } = reservationData;
    console.log("Selected meal:", selectedMeal);
    console.log("Selected date:", selectedDate);
    console.log("Number of persons:", numberOfPersons);

    const selectedDay = new Date(selectedDate).toLocaleString('en-us', { weekday: 'long' });
    const selectedDayHours = openingHours.find(day => day.dayOfWeek === selectedDay);
    console.table(selectedDayHours);

    if (!selectedDayHours) {
      console.error("No opening hours found for selected date");
      return;
    }

    let startHour, endHour;

    switch (selectedMeal) {
      case 'Brunch':
        startHour = Math.max(selectedDayHours.openingHour, 10);
        endHour = Math.min(selectedDayHours.closingHour, 12);
        break;
      case 'Lunch':
        startHour = Math.max(selectedDayHours.openingHour, 12);
        endHour = Math.min(selectedDayHours.closingHour, 14);
        break;
      case 'Dinner':
        startHour = Math.max(selectedDayHours.openingHour, 15);
        endHour = selectedDayHours.closingHour;
        break;
      default:
        console.error("Invalid meal selection:", selectedMeal);
        return;
    }

    console.log("Start hour:", startHour);
    console.log("End hour:", endHour);

    const generateTimeSlots = (start, end) => {
      const slots = [];
      const closingTime = selectedDayHours.closingHour * 60 + selectedDayHours.closingMinute;
      for (let hour = start; hour < end; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const slotTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const slotEndMinutes = hour * 60 + minute + 90; // 90 minutes later
          if (slotEndMinutes <= closingTime) {
            slots.push(slotTime);
          }
        }
      }
      return slots;
    };

    const timeSlots = generateTimeSlots(startHour, endHour);
    console.log("Generated time slots:", timeSlots);

    const selectedDateObj = new Date(selectedDate);

    const availableTimeSlots = timeSlots.filter(time => {
      const [hour, minute] = time.split(':').map(Number);
      const slotStart = new Date(selectedDateObj);
      slotStart.setHours(hour, minute, 0, 0);
      const slotEnd = new Date(slotStart.getTime() + 90 * 60000); // 90 minutes later
      const availableTables = getAvailableTables(slotStart, slotEnd);

      // Calculate total seating capacity
      const totalCapacity = availableTables.reduce((sum, table) => sum + table.seatingCapacity, 0);

      // Check if the total capacity is sufficient for the number of persons
      return totalCapacity >= numberOfPersons;
    });

    console.log("Available time slots:", availableTimeSlots);
    setAvailableTimes(availableTimeSlots);
  };

  const handleTimeSelection = (time) => {
    const selectedDateObj = new Date(reservationData.selectedDate);
    const [hour, minute] = time.split(':').map(Number);
    const slotStart = new Date(selectedDateObj);
    slotStart.setHours(hour, minute, 0, 0);
    const slotEnd = new Date(slotStart.getTime() + 90 * 60000); // 90 minutes later

    const availableTables = getAvailableTables(slotStart, slotEnd);
    setAvailableTablesForSelectedTime(availableTables);

    handleInputChange('selectedTime', time);
    handleNextStep();
  };

  const getAvailableTables = (slotStart, slotEnd) => {
    const reservedTableNumbers = new Set();
    reservations.forEach(reservation => {
      const resStart = new Date(reservation.startTime);
      const resEnd = new Date(reservation.endTime);
      if (slotStart < resEnd && slotEnd > resStart) {
        reservation.tableNumbers.forEach(tableNumber => reservedTableNumbers.add(tableNumber));
      }
    });
    return availableTables.filter(table => !reservedTableNumbers.has(table.tableNumber));
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

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

  const handleSubmit = async () => {
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
      setIsPageFading(true);
      setTimeout(() => {
        setIsReservationConfirmed(true);
      }, 300);
    } catch (error) {
      console.error("Error posting reservation:", error);
    }
  };

  const handleEdit = () => {
    setReservationData(prevData => ({
      ...prevData,
      personalDetails: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
      },
    }));
    setCurrentStep(1);
  };

  const handleNewReservation = () => {
    setReservationData({
      numberOfPersons: 0,
      selectedDate: '',
      selectedTime: '',
      selectedMeal: '',
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
    setCurrentStep(1);
    setIsReservationConfirmed(false);
    setIsPageFading(false);
  };

  if (isReservationConfirmed) {
    return (
      <ConfirmationMessage
        reservationData={reservationData}
        onNewReservation={handleNewReservation}
      />
    );
  }

  return (
    <div className={`reserve-page ${isPageFading ? 'fading' : ''}`}>
      
      {currentStep > 1 && currentStep < 8 && (
        <h1 className="lead">Reserve a Table</h1>
      )}

      {currentStep > 1 && currentStep < 8 && (
        <ReservationProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          reservationData={reservationData}
        />
      )}

      {currentStep > 1 && currentStep < 8 && (
        <button onClick={handlePreviousStep} className="back-button mb-4">
          Back
        </button>
      )}

      {currentStep === 1 && (
        <MealSelectionStep
          onSelect={(meal) => {
            handleInputChange('selectedMeal', meal);
            handleNextStep();
          }}
        />
      )}

      {currentStep === 2 && (
        <NumberOfPersonsStep
          onSelect={(number) => {
            handleInputChange('numberOfPersons', number);
            handleNextStep();
          }}
        />
      )}

      {currentStep === 3 && (
        <DateSelectionStep
          selectedDate={reservationData.selectedDate}
          onDateChange={(date) => handleInputChange('selectedDate', date)}
          onNext={handleNextStep}
          openingDays={openingDays}
        />
      )}

      {currentStep === 4 && (
        <TimeSelectionStep
          availableTimes={availableTimes}
          onSelect={handleTimeSelection}
        />
      )}

      {currentStep === 5 && (
        <TableSelectionStep
          availableTables={availableTablesForSelectedTime}
          selectedTables={reservationData.selectedTables}
          numberOfPersons={reservationData.numberOfPersons}
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
          onNext={handleNextStep}
        />
      )}

      {currentStep === 8 && (
        <ConfirmationStep
          reservationData={reservationData}
          onConfirm={handleSubmit}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

export default ReservePage;