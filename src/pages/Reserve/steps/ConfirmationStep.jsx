import React from 'react';
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';

const ConfirmationStep = ({ reservationData, onConfirm, onEdit }) => {
  const [buttonsEnabled, setButtonsEnabled] = useState(false);

  // Enable buttons after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonsEnabled(true);
    }, 3000); // 3 second delay

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="confirmation-step">
      <h2>Confirm Your Reservation</h2>
      <div className="reservation-summary">
        <div className="reservation-details">
          {reservationData.selectedMeal && (
            <div className="detail-item">
              <span className="detail-label">Meal:</span>
              <span className="detail-value">{reservationData.selectedMeal}</span>
            </div>
          )}
          {reservationData.numberOfPersons > 0 && (
            <div className="detail-item">
              <span className="detail-label">Guests:</span>
              <span className="detail-value">{reservationData.numberOfPersons}</span>
            </div>
          )}
          {reservationData.selectedDate && (
            <div className="detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{reservationData.selectedDate}</span>
            </div>
          )}
          {reservationData.selectedTime && (
            <div className="detail-item">
              <span className="detail-label">Time:</span>
              <span className="detail-value">{reservationData.selectedTime}</span>
            </div>
          )}
          {reservationData.selectedTables.length > 0 && (
            <div className="detail-item">
              <span className="detail-label">Table nr(s):</span>
              <span className="detail-value">{reservationData.selectedTables.join(', ')}</span>
            </div>
          )}
          {reservationData.specialRequests !== '' && (
            <div className="detail-item">
              <span className="detail-label">Special Requests:</span>
              <span className="detail-value">{reservationData.specialRequests || 'None'}</span>
            </div>
          )}
          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{reservationData.personalDetails.firstName} {reservationData.personalDetails.lastName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{reservationData.personalDetails.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{reservationData.personalDetails.phoneNumber}</span>
          </div>
        </div>
      </div>
      <div className="button-group">
      <button
          onClick={onEdit}
          className="edit-button"
          disabled={!buttonsEnabled} // Disable button until enabled
        >
          Edit Reservation
        </button>
        <button
          onClick={onConfirm}
          className="confirm-button"
          disabled={!buttonsEnabled} // Disable button until enabled
        >
          Confirm Reservation
        </button>
      </div>
    </div>
  );
};

ConfirmationStep.propTypes = {
  reservationData: PropTypes.shape({
    selectedMeal: PropTypes.string.isRequired,
    numberOfPersons: PropTypes.number.isRequired,
    selectedDate: PropTypes.string.isRequired,
    selectedTime: PropTypes.string.isRequired,
    selectedTables: PropTypes.arrayOf(PropTypes.number).isRequired,
    specialRequests: PropTypes.string,
    personalDetails: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ConfirmationStep;