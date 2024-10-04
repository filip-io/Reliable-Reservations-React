import PropTypes from 'prop-types';

const NumberOfPersonsStep = ({ onSelect }) => {
  const personOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="number-of-persons-step">
      <h2>Select Number of Persons</h2>
      <div className="button-group">
        {personOptions.map((num) => (
          <button
            key={num}
            className="person-button"
            onClick={() => onSelect(num)}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

NumberOfPersonsStep.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default NumberOfPersonsStep;