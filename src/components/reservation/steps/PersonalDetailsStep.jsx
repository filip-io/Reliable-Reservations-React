import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { checkUserExists } from '../../../services/customerService';

const PersonalDetailsStep = ({ personalDetails, onChange, onSubmit }) => {
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      if (personalDetails.email) {
        try {
          const { exists, customerId } = await checkUserExists(personalDetails.email);
          setIsExistingUser(exists);
          if (exists) {
            setCustomerId(customerId);
            // Here you could also fetch and set other user details if needed
          }
        } catch (error) {
          console.error('Error checking user:', error);
        }
      }
    };

    checkUser();
  }, [personalDetails.email]);

  const handleSubmit = () => {
    onSubmit({ ...personalDetails, isExistingUser, customerId });
  };

  return (
    <div className="personal-details-step">
      <h2>Your Personal Details</h2>
      <input
        type="text"
        placeholder="First Name"
        value={personalDetails.firstName}
        onChange={(e) => onChange('firstName', e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={personalDetails.lastName}
        onChange={(e) => onChange('lastName', e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={personalDetails.phoneNumber}
        onChange={(e) => onChange('phoneNumber', e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={personalDetails.email}
        onChange={(e) => onChange('email', e.target.value)}
      />
      <button onClick={handleSubmit}>Confirm Reservation</button>
    </div>
  );
};

PersonalDetailsStep.propTypes = {
  personalDetails: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default PersonalDetailsStep;