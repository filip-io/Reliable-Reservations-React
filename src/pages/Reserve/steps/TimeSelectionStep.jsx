import React from 'react';
import PropTypes from 'prop-types';

const TimeSelectionStep = ({ availableTimes, numberOfPersons, onSelect }) => {
  const getSuitableTablesCount = (tables) => {
    let totalCapacity = 0;
    let tableCount = 0;
    for (const table of tables) {
      if (totalCapacity >= numberOfPersons) break;
      totalCapacity += table.seatingCapacity;
      tableCount++;
    }
    return totalCapacity >= numberOfPersons ? tableCount : 0;
  };

  return (
    <div className="time-selection-step">
      <h2>Select a Time</h2>
      {availableTimes.length > 0 ? (
        <div className="time-slots">
          {availableTimes.map(({ time, availableTables }) => {
            const suitableTablesCount = getSuitableTablesCount(availableTables);
            return (
              <button 
                key={time} 
                onClick={() => onSelect(time)}
                disabled={suitableTablesCount === 0}
                className={`time-slot ${suitableTablesCount === 0 ? 'disabled' : ''}`}
              >
                {time}
                <span className="table-count">
                  {suitableTablesCount > 0
                    ? `${suitableTablesCount} suitable ${suitableTablesCount === 1 ? 'table' : 'tables'} available`
                    : 'No suitable tables'}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <p>No available time slots for the selected date. Please choose another date.</p>
      )}
    </div>
  );
};

TimeSelectionStep.propTypes = {
  availableTimes: PropTypes.arrayOf(PropTypes.shape({
    time: PropTypes.string.isRequired,
    availableTables: PropTypes.arrayOf(PropTypes.shape({
      tableId: PropTypes.number.isRequired,
      tableNumber: PropTypes.number.isRequired,
      seatingCapacity: PropTypes.number.isRequired,
      location: PropTypes.string.isRequired,
    })).isRequired,
  })).isRequired,
  numberOfPersons: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default TimeSelectionStep;