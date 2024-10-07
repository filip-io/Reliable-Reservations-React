import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ConfirmationMessage.css';

const ConfirmationMessage = ({ reservationData, onNewReservation }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the animation after the component mounts
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`confirmation-message ${isVisible ? 'visible' : ''}`}>
      <div className="confirmation-content">
        <h2>Reservation Confirmed!</h2>
        <p>Thank you for your reservation.</p>
        <ul>
          <li>Date: {reservationData.selectedDate}</li>
          <li>Meal: {reservationData.selectedMeal}</li>
          <li>Time: {reservationData.selectedTime}</li>
          <li>Guests: {reservationData.numberOfPersons}</li>
          <li>Table(s): {reservationData.selectedTables.join(', ')}</li>
        </ul>
        <button onClick={onNewReservation}>Make Another Reservation</button>
      </div>
    </div>
  );
};

ConfirmationMessage.propTypes = {
  reservationData: PropTypes.shape({
    selectedDate: PropTypes.string.isRequired,
    selectedTime: PropTypes.string.isRequired,
    numberOfPersons: PropTypes.number.isRequired,
    selectedTables: PropTypes.arrayOf(PropTypes.number).isRequired,
    selectedMeal: PropTypes.string.isRequired,
    personalDetails: PropTypes.shape({
      email: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onNewReservation: PropTypes.func.isRequired,
};

export default ConfirmationMessage;