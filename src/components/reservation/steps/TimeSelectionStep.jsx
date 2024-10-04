import PropTypes from 'prop-types';

const TimeSelectionStep = ({ availableTimes, onSelect }) => {
  return (
    <div className="time-selection-step">
      <h2>Select a Time</h2>
      {availableTimes.map((time) => (
        <button key={time} onClick={() => onSelect(time)}>
          {time}
        </button>
      ))}
    </div>
  );
};

TimeSelectionStep.propTypes = {
  availableTimes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default TimeSelectionStep;