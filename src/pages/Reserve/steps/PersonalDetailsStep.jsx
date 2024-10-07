import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { checkCustomerExists, createCustomer } from '../../../services/customerService';

const PersonalDetailsStep = ({ personalDetails, onChange, onNext }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setShowFullForm(false);
    setError(null);
  }, [personalDetails.email]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsChecking(true);
    setError(null);
    try {
      const user = await checkCustomerExists(personalDetails.email);
      if (user) {
        onChange('firstName', user.firstName);
        onChange('lastName', user.lastName);
        onChange('phoneNumber', user.phoneNumber);
        onChange('customerId', user.customerId);
        onNext();
      } else {
        setShowFullForm(true);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setError("An error occurred while checking user information. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleFullFormSubmit = async (e) => {
    e.preventDefault();
    setIsChecking(true);
    setError(null);
    try {
      const newCustomer = await createCustomer(personalDetails);
      onChange('customerId', newCustomer.customerId);
      onNext();
    } catch (error) {
      console.error('Error creating customer:', error);
      setError("An error occurred while saving your information. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="personal-details-step">
      <h2>Personal Details</h2>
      {!showFullForm ? (
        <form onSubmit={handleEmailSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={personalDetails.email}
              onChange={(e) => onChange('email', e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isChecking}>
            {isChecking ? 'Checking...' : 'Continue'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleFullFormSubmit}>
          <div>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={personalDetails.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              value={personalDetails.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              value={personalDetails.phoneNumber}
              onChange={(e) => onChange('phoneNumber', e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isChecking}>
            {isChecking ? 'Saving...' : 'Save and Continue'}
          </button>
        </form>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

PersonalDetailsStep.propTypes = {
  personalDetails: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default PersonalDetailsStep;