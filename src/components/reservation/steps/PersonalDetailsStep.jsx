import React, { useState } from 'react';
import { checkUserExists, createUser } from '../../../services/customerService';

const PersonalDetailsStep = ({ personalDetails, onChange, onSubmit }) => {
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async () => {
    setLoading(true);
    try {
      const user = await checkUserExists(personalDetails.email);
      if (user) {
        setIsExistingUser(true);
        setCustomerId(user.customerId);
        onChange('firstName', user.firstName);
        onChange('lastName', user.lastName);
        onChange('phoneNumber', user.phoneNumber);
        // Automatically populate form fields with user data
      } else {
        setIsExistingUser(false);
        setCustomerId(null); // New user, needs to be created
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    let finalCustomerId = customerId;

    // If it's a new user, create them first
    if (!isExistingUser) {
      try {
        const newUser = await createUser(personalDetails);
        finalCustomerId = newUser.customerId;
      } catch (error) {
        console.error('Error creating new user:', error);
        return;
      }
    }

    // Pass customerId (existing or newly created) to the reservation submission
    onSubmit({ personalDetails, isExistingUser, customerId: finalCustomerId });
  };

  return (
    <div>
      <h3>Personal Details</h3>
      <input
        type="email"
        value={personalDetails.email}
        onChange={(e) => onChange('email', e.target.value)}
        placeholder="Email"
      />
      <button type="button" onClick={handleEmailSubmit}>
        {loading ? 'Checking...' : 'Check Email'}
      </button>

      {isExistingUser && (
        <p>User found! Personal details pre-filled below.</p>
      )}

      {!isExistingUser && (
        <>
          <input
            type="text"
            value={personalDetails.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            placeholder="First Name"
          />
          <input
            type="text"
            value={personalDetails.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            placeholder="Last Name"
          />
          <input
            type="tel"
            value={personalDetails.phoneNumber}
            onChange={(e) => onChange('phoneNumber', e.target.value)}
            placeholder="Phone Number"
          />
        </>
      )}

      <button type="button" onClick={handleSubmit}>
        Submit Reservation
      </button>
    </div>
  );
};

export default PersonalDetailsStep;
