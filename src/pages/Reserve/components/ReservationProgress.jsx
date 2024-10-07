import React from 'react';
import PropTypes from 'prop-types';
import './ReservationProgress.css';

const ReservationProgress = ({ currentStep, totalSteps, reservationData }) => {
  const progress = (currentStep / totalSteps) * 100;

  const stepLabels = [
    'Meal',
    'Number of Persons',
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
      <div className="reservation-summary">
        <h4>Your Reservation:</h4>
        <ul>
          {reservationData.selectedMeal && (
            <li>Meal: {reservationData.selectedMeal}</li>
          )}
          {reservationData.numberOfPersons > 0 && (
            <li>Number of Persons: {reservationData.numberOfPersons}</li>
          )}
          {reservationData.selectedDate && (
            <li>Date: {reservationData.selectedDate}</li>
          )}
          {reservationData.selectedTime && (
            <li>Time: {reservationData.selectedTime}</li>
          )}
          {reservationData.selectedTables.length > 0 && (
            <li>Table(s): {reservationData.selectedTables.join(', ')}</li>
          )}
          {reservationData.specialRequests !== 'None' && (
            <li>Special Requests: {reservationData.specialRequests}</li>
          )}
        </ul>
      </div>
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