import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateSelectionStep = ({ selectedDate, onDateChange, onNext, openingDays }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const isDateSelectable = (date) => {
    const day = date.getDay();
    return openingDays.includes(day);
  };

  const handleDateChange = (date) => {
    if (isDateSelectable(date)) {
      // Adjust the date to the local time zone
      const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      const formattedDate = adjustedDate.toISOString().split('T')[0];
      onDateChange(formattedDate);
      setErrorMessage('');
    } else {
      setErrorMessage("Sorry, the restaurant is closed on this day.");
    }
  };

  const handleNextClick = () => {
    if (!selectedDate) {
      setErrorMessage('Please select a date to proceed.');
    } else {
      onNext();
    }
  };

  return (
    <>
    <div className="date-selection-step">
      <h2>Select a Reservation Date</h2>

      <DatePicker
        selected={selectedDate ? new Date(selectedDate) : null}
        onChange={handleDateChange}
        minDate={new Date()}
        filterDate={isDateSelectable}
        inline
        monthsShown={2}
        calendarClassName="custom-calendar"
      />

      {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}

    </div>
    <div>
      <button onClick={handleNextClick} disabled={!selectedDate} className="btn btn-primary mt-1">
        Next
      </button>
    </div>
    
    </>
  );
};

DateSelectionStep.propTypes = {
  selectedDate: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  openingDays: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default DateSelectionStep;