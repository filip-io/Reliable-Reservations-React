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
      onDateChange(date.toISOString().split('T')[0]);
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
    <div className="date-selection-step">
      <h2>Select a Reservation Date</h2>

      <DatePicker
        selected={selectedDate ? new Date(selectedDate) : null}
        onChange={handleDateChange}
        minDate={new Date()}
        filterDate={isDateSelectable}
        dateFormat="yyyy-MM-dd"
        className="form-control"
        placeholderText="Select a date"
      />

      {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}

      <button onClick={handleNextClick} disabled={!selectedDate} className="btn btn-primary mt-3">
        Next
      </button>
    </div>
  );
};

DateSelectionStep.propTypes = {
  selectedDate: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  openingDays: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default DateSelectionStep;