import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DateSelectionStep = ({ selectedDate, onDateChange, onNext, openingDays }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const today = new Date().toISOString().split('T')[0]; // Today's date in 'YYYY-MM-DD' format

  const isDateSelectable = (date) => {
    const selectedDay = new Date(date).getDay();
    return openingDays.includes(selectedDay); // Check if the day is one of the restaurant's open days
  };

  const handleDateChange = (e) => {
    const date = e.target.value;

    // Check if the selected date is valid
    if (isDateSelectable(date)) {
      onDateChange(date); // Set the selected date in the parent state
      setErrorMessage(''); // Clear error message if any
    } else {
      setErrorMessage("Sorry, the restaurant is closed on this day.");
    }
  };

  const handleNextClick = () => {
    if (!selectedDate) {
      setErrorMessage('Please select a date to proceed.');
    } else if (!isDateSelectable(selectedDate)) {
      setErrorMessage('You cannot select a date when the restaurant is closed.');
    } else {
      onNext(); // Proceed to the next step
    }
  };

  return (
    <div className="date-selection-step">
      <h2>Select a Reservation Date</h2>

      <input
        type="date"
        value={selectedDate}
        min={today} // Block past dates
        onChange={handleDateChange}
      />

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <button onClick={handleNextClick} disabled={!selectedDate}>
        Next
      </button>
    </div>
  );
};

DateSelectionStep.propTypes = {
  selectedDate: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  openingDays: PropTypes.arrayOf(PropTypes.number).isRequired, // Array of open days (0 = Sunday, 6 = Saturday)
};

export default DateSelectionStep;
