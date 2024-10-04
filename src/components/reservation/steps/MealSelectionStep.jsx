import PropTypes from 'prop-types';

const MealSelectionStep = ({ onSelect }) => {
  const availableMeals = ['Brunch', 'Lunch', 'Dinner'];

  return (
    <div className="meal-selection-step">
      <h2>Select a Meal</h2>
      {availableMeals.map((meal) => (
        <button key={meal} onClick={() => onSelect(meal)}>
          {meal}
        </button>
      ))}
    </div>
  );
};

MealSelectionStep.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default MealSelectionStep;