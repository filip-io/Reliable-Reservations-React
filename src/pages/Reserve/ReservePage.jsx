import React, { useState, useEffect, useCallback } from 'react';
import { useReservation } from '../../hooks/useReservation';
import { useTables } from '../../hooks/useTables';
import { useOpeningHours } from '../../hooks/useOpeningHours';
import ReservationProgress from './components/ReservationProgress';
import {
  NumberOfPersonsStep,
  DateSelectionStep,
  MealSelectionStep,
  TimeSelectionStep,
  TableSelectionStep,
  SpecialRequestsStep,
  PersonalDetailsStep,
  ConfirmationStep
} from './steps';
import ConfirmationMessage from './components/ConfirmationMessage';
import './ReservePage.css';
import InitialStep from './steps/InitialStep';

function ReservePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 8;

  const {
    reservationData,
    setReservationData,
    handleInputChange,
    handlePersonalDetailsChange,
    submitReservation
  } = useReservation();

  const {
    availableTables,
    availableTablesForSelectedTime,
    setAvailableTablesForSelectedTime,
    fetchReservations,
    getAvailableTables
  } = useTables();

  const {
    openingDays,
    openingHours,
    getSelectedDayOpeningHours
  } = useOpeningHours();

  const [availableTimes, setAvailableTimes] = useState([]);
  const [isReservationConfirmed, setIsReservationConfirmed] = useState(false);
  const [reservationError, setReservationError] = useState(null);
  const [isPageFading, setIsPageFading] = useState(false);

  // Update available times when date, meal, or tables change
  useEffect(() => {
    if (reservationData.selectedDate && reservationData.selectedMeal && availableTables.length > 0) {
      updateAvailableTimes();
      fetchReservations(reservationData.selectedDate);
    }
  }, [reservationData.selectedDate, reservationData.selectedMeal, availableTables, fetchReservations]);

  const updateAvailableTimes = useCallback(() => {
    console.log("Starting updateAvailableTimes");
    const { selectedMeal, selectedDate, numberOfPersons } = reservationData;
    console.log("Selected meal:", selectedMeal);
    console.log("Selected date:", selectedDate);
    console.log("Number of persons:", numberOfPersons);

    const selectedDayHours = getSelectedDayOpeningHours(selectedDate);
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
  }, [reservationData, getSelectedDayOpeningHours, getAvailableTables]);

  const handleTimeSelection = useCallback((time) => {
    const selectedDateObj = new Date(reservationData.selectedDate);
    const [hour, minute] = time.split(':').map(Number);
    const slotStart = new Date(selectedDateObj);
    slotStart.setHours(hour, minute, 0, 0);
    const slotEnd = new Date(slotStart.getTime() + 90 * 60000); // 90 minutes later

    const availableTables = getAvailableTables(slotStart, slotEnd);
    setAvailableTablesForSelectedTime(availableTables);

    handleInputChange('selectedTime', time);
    handleNextStep();
  }, [reservationData.selectedDate, getAvailableTables, setAvailableTablesForSelectedTime, handleInputChange]);

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

  const handleSubmit = async () => {
    try {
      await submitReservation();
      setIsPageFading(true);
      setTimeout(() => {
        setIsReservationConfirmed(true);
      }, 300);
    } catch (error) {
      console.error("Error posting reservation:", error);
      console.log("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setReservationError(error.message || "An error occurred while submitting your reservation.");
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
    setTimeout(() => {
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
      setIsReservationConfirmed(false);
      setCurrentStep(0);
      setIsPageFading(false);
    }, 0);
  };

  if (isReservationConfirmed) {
    console.log('Restervation confirmed: ', isReservationConfirmed)
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

      {currentStep === 0 && (
        <InitialStep
          onBegin={handleNextStep} // Call the next step handler when Begin is clicked
        />
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
          error={reservationError}
        />
      )}
    </div>
  );
}

export default ReservePage;