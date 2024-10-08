import PropTypes from 'prop-types';

const SpecialRequestsStep = ({ specialRequests, onChange, onNext }) => {
  return (
    <div className="special-requests-step">
      <h2>Any Special Requests?</h2>
      <textarea
        value={specialRequests}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter any special requests here..."
      />
      <button onClick={onNext}>Next</button>
    </div>
  );
};

SpecialRequestsStep.propTypes = {
  specialRequests: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default SpecialRequestsStep;