import React from 'react';
import PropTypes from 'prop-types';

const ConfirmationStep = ({ reservationData, onConfirm, onEdit }) => {
  return (
    <div className="confirmation-step">
      <h2>Confirm Your Reservation</h2>
      <div className="reservation-summary">
        <p><strong>Meal:</strong> {reservationData.selectedMeal}</p>
        <p><strong>Number of Persons:</strong> {reservationData.numberOfPersons}</p>
        <p><strong>Date:</strong> {reservationData.selectedDate}</p>
        <p><strong>Time:</strong> {reservationData.selectedTime}</p>
        <p><strong>Selected Tables:</strong> {reservationData.selectedTables.join(', ')}</p>
        <p><strong>Special Requests:</strong> {reservationData.specialRequests || 'None'}</p>
        <p><strong>Name:</strong> {reservationData.personalDetails.firstName} {reservationData.personalDetails.lastName}</p>
        <p><strong>Email:</strong> {reservationData.personalDetails.email}</p>
        <p><strong>Phone:</strong> {reservationData.personalDetails.phoneNumber}</p>
      </div>
      <div className="button-group">
        <button onClick={onEdit} className="edit-button">Edit Reservation</button>
        <button onClick={onConfirm} className="confirm-button">Confirm Reservation</button>
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