import React from 'react';
import PropTypes from 'prop-types';

const TimeSelectionStep = ({ availableTimes, onSelect }) => {
  return (
    <div className="time-selection-step">
      <h2>Select a Time</h2>
      {availableTimes.length > 0 ? (
        <div className="time-slots">
          {availableTimes.map((time) => (
            <button 
              key={time} 
              onClick={() => onSelect(time)}
              className="time-slot"
            >
              {time}
            </button>
          ))}
        </div>
      ) : (
        <p>No available time slots for the selected date. Please choose another date.</p>
      )}
    </div>
  );
};

TimeSelectionStep.propTypes = {
  availableTimes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default TimeSelectionStep;