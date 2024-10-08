import React from 'react';
import PropTypes from 'prop-types';
import './ReservationProgress.css';

const ReservationProgress = ({ currentStep, totalSteps, reservationData }) => {
  const progress = (currentStep / totalSteps) * 100;

  const stepLabels = [
    'Meal',
    'Number of Guests',
    'Date',
    'Time',
    'Table',
    'Special Requests',
    'Personal Details'
  ];

  return (
    <div className="reservation-progress">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="step-info">
        Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}
      </p>
      {currentStep > 1 && (
        <div className="reservation-summary">
          <h4>Your Reservation:</h4>
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
                <span className="detail-value">{reservationData.specialRequests}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

ReservationProgress.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
  reservationData: PropTypes.shape({
    selectedMeal: PropTypes.string,
    numberOfPersons: PropTypes.number,
    selectedDate: PropTypes.string,
    selectedTime: PropTypes.string,
    selectedTables: PropTypes.arrayOf(PropTypes.number),
    specialRequests: PropTypes.string,
  }).isRequired,
};

export default ReservationProgress;