import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ConfirmationMessage.css';

const ConfirmationMessage = ({ reservationData, onNewReservation }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`confirmation-message ${isVisible ? 'visible' : ''}`}>
      <div className="confirmation-content">
        <h2>Reservation Confirmed</h2>
        <p>Thank you for your reservation!</p>
        <div className="reservation-details">
          <div className="detail-item">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{reservationData.selectedDate}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Meal:</span>
            <span className="detail-value">{reservationData.selectedMeal}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Time:</span>
            <span className="detail-value">{reservationData.selectedTime}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Guests:</span>
            <span className="detail-value">{reservationData.numberOfPersons}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Table(s):</span>
            <span className="detail-value">{reservationData.selectedTables.join(', ')}</span>
          </div>
        </div>
        <button onClick={onNewReservation} className="new-reservation-button">Make Another Reservation</button>
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