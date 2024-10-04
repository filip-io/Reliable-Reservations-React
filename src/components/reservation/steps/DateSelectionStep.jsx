import PropTypes from 'prop-types';

const DateSelectionStep = ({ selectedDate, onDateChange, onNext }) => {
  return (
    <div className="date-selection-step">
      <h2>Select a Date</h2>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
      />
      <button onClick={onNext}>Next</button>
    </div>
  );
};

DateSelectionStep.propTypes = {
  selectedDate: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default DateSelectionStep;