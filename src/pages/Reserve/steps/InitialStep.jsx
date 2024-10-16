import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { checkApiStatus } from '../../../services/apiService';

const InitialStep = ({ onBegin }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);

  const handleBegin = async () => {
    setIsChecking(true);
    setError(null);
    try {
      const isOnline = await checkApiStatus();
      if (isOnline) {
        onBegin();
      } else {
        setError("Sorry, our reservation system is currently unavailable. Please check back later.");
      }
    } catch (error) {
      setError("Sorry, our reservation system is currently unavailable. Please check back later.");
    } finally {
      setIsChecking(false);
    }
  };

  const errorStyle = {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    border: '1px solid #ffcdd2',
    fontSize: '14px',
    lineHeight: '1.5',
    display: 'flex',
    alignItems: 'center',
  };

  const errorIconStyle = {
    marginRight: '10px',
    fontSize: '20px',
  };

  return (
    <div className="initial-step">
      <h4 className="mb-3">
        Let's get started with your reservation!
      </h4>
      {error && (
        <div style={errorStyle} role="alert">
          <span style={errorIconStyle} aria-hidden="true">⚠️</span>
          <span>{error}</span>
        </div>
      )}
      <button
        onClick={handleBegin}
        disabled={isChecking}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: isChecking ? '#cccccc' : '#2dll23',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isChecking ? 'not-allowed' : 'pointer',
        }}
      >
        {isChecking ? 'CHECKING...' : 'START'}
      </button>
    </div>
  );
};

InitialStep.propTypes = {
  onBegin: PropTypes.func.isRequired,
};

export default InitialStep;