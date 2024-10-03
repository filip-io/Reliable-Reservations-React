import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getReservationsByDate } from '../services/reservationService';
import { getTables } from '../services/tableService';
import { getOpeningHours } from '../services/openingHoursService';
import { postReservation } from '../services/reservationService';

function ReservePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [numberOfPersons, setNumberOfPersons] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableMeals, setAvailableMeals] = useState(['Brunch', 'Lunch', 'Dinner']);
  const [selectedMeal, setSelectedMeal] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [personalDetails, setPersonalDetails] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
  });
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      const response = await axios.get(`${API_URI}/all`);
      console.log("Tables fetched successfully: ", response.data);
      setAvailableTables(response.data);
    };
    fetchTables();
  }, []);

  useEffect(() => {
    const fetchOpeningHours = async () => {
      const response = await axios.get(`${API_URI}/all`);
      console.log("Opening hours retrieved successfully: ", response.data);
      // Add logic to handle opening hours
    };
    fetchOpeningHours();
  }, []);

  const handleNextStep = () => {
    if (currentStep < 7) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      // Handle the final step
    }
  };

  const handleMealSelection = () => {
    if (!selectedMeal) {
      console.log("No meal selected.");
      return;
    }

    let timeSlots = [];
    let startHour, endHour;

    // Determine start and end hours based on the selected meal
    switch (selectedMeal) {
      case 'Brunch':
        startHour = 10;
        endHour = 12; // Brunch ends at 12
        break;
      case 'Lunch':
        startHour = 12;
        endHour = 14; // Lunch ends at 14
        break;
      case 'Dinner':
        startHour = 15;
        endHour = 23; // Dinner ends at 23
        break;
      default:
        console.log("Invalid meal selection:", selectedMeal);
        return;
    }

    console.log(`Generating time slots from ${startHour}:00 to ${endHour}:00`);

    // Generate available time slots in 30-minute increments
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute === 0 ? '00' : '30'}`;
        timeSlots.push(timeSlot);
      }
    }

    // Log the generated time slots before filtering
    console.log("Generated Time Slots Before Filtering:", timeSlots);

    // Remove booked times from timeSlots
    const bookedTimes = reservations.map((reservation) => reservation.time);
    const filteredTimes = timeSlots.filter((time) => !bookedTimes.includes(time) && time <= '21:30');

    // Update availableTimes with the filtered times
    setAvailableTimes(filteredTimes);
  };

  return (
    <div className="reserve-page">
      <h1>Reserve a Table</h1>
      <p>Book a table at our restaurant and enjoy an amazing dining experience.</p>

      {currentStep === 1 && (
        <div>
          <h2>Select Number of Persons</h2>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <button
              key={num}
              onClick={() => {
                setNumberOfPersons(num);
                handleNextStep();
              }}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h2>Select a Date</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button onClick={handleNextStep}>Next</button>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h2>Select a Meal</h2>
          {availableMeals.map((meal) => (
            <button
              key={meal}
              onClick={() => {
                setSelectedMeal(meal);
                handleMealSelection();
              }}
            >
              {meal}
            </button>
          ))}
        </div>
      )}

      {currentStep === 4 && (
        <div>
          <h2>Select a Time</h2>
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => {
                handleNextStep();
              }}
            >
              {time}
            </button>
          ))}
        </div>
      )}

      {currentStep === 5 && (
        <div>
          <h2>Select Tables</h2>
          {availableTables.map((table) => (
            <button
              key={table.id}
              onClick={() => {
                setSelectedTables((prev) => [...prev, table]);
              }}
            >
              Table {table.number}
            </button>
          ))}
          <button onClick={handleNextStep}>Next</button>
        </div>
      )}

      {currentStep === 6 && (
        <div>
          <h2>Special Requests</h2>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
          />
          <button onClick={handleNextStep}>Next</button>
        </div>
      )}

      {currentStep === 7 && (
        <div>
          <h2>Your Personal Details</h2>
          <input
            type="text"
            placeholder="First Name"
            value={personalDetails.firstName}
            onChange={(e) => setPersonalDetails({ ...personalDetails, firstName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={personalDetails.lastName}
            onChange={(e) => setPersonalDetails({ ...personalDetails, lastName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={personalDetails.phoneNumber}
            onChange={(e) => setPersonalDetails({ ...personalDetails, phoneNumber: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={personalDetails.email}
            onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
          />
          <button onClick={postReservation}>Confirm Reservation</button>
        </div>
      )}
    </div>
  );
}

export default ReservePage;