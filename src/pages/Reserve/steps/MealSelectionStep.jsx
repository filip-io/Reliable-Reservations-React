import React from 'react';
import PropTypes from 'prop-types';

const MealSelectionStep = ({ onSelect }) => {
  const availableMeals = ['Brunch', 'Lunch', 'Dinner'];

  return (
    <div className="meal-selection-step">
      <h3>Select a Meal</h3>
      <div className="button-group">
        {availableMeals.map((meal) => (
          <button
            key={meal}
            onClick={() => onSelect(meal)}
            className="meal-button"
          >
            {meal}
          </button>
        ))}
      </div>
    </div>
  );
};

MealSelectionStep.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default MealSelectionStep;