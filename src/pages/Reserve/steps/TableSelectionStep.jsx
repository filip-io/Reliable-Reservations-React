import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TableSelectionStep = ({ availableTables, selectedTables, numberOfPersons, onSelect, onNext }) => {
  const [totalSelectedCapacity, setTotalSelectedCapacity] = useState(0);

  useEffect(() => {
    const capacity = selectedTables.reduce((total, tableNumber) => {
      const table = availableTables.find(t => t.tableNumber === tableNumber);
      return total + (table ? table.seatingCapacity : 0);
    }, 0);
    setTotalSelectedCapacity(capacity);
  }, [selectedTables, availableTables]);

  const handleTableSelection = (table) => {
    let updatedSelection;
    if (selectedTables.includes(table.tableNumber)) {
      updatedSelection = selectedTables.filter(t => t !== table.tableNumber);
    } else {
      if (totalSelectedCapacity >= numberOfPersons) {
        // If we already have enough capacity, don't allow more selections
        return;
      }
      updatedSelection = [...selectedTables, table.tableNumber];
    }
    onSelect(updatedSelection);
  };

  const isNextDisabled = totalSelectedCapacity < numberOfPersons;

  return (
    <div className="table-selection-step">
      <h2>Select Table(s)</h2>
      <p>Please select table(s) that can accommodate {numberOfPersons} person(s).</p>
      <p>Current capacity: {totalSelectedCapacity} / {numberOfPersons}</p>
      <div className="table-grid">
        {availableTables.map((table) => (
          <button
            key={table.tableId}
            onClick={() => handleTableSelection(table)}
            className={`table-button ${selectedTables.includes(table.tableNumber) ? 'selected' : ''} ${totalSelectedCapacity >= numberOfPersons && !selectedTables.includes(table.tableNumber) ? 'disabled' : ''}`}
            disabled={totalSelectedCapacity >= numberOfPersons && !selectedTables.includes(table.tableNumber)}
          >
            Table {table.tableNumber}
            <br />
            Seats: {table.seatingCapacity}
            <br />
            {table.location}
          </button>
        ))}
      </div>
      <button onClick={onNext} disabled={isNextDisabled} className="next-button">
        {isNextDisabled ? 'Please select enough tables' : 'Next'}
      </button>
    </div>
  );
};

TableSelectionStep.propTypes = {
  availableTables: PropTypes.arrayOf(PropTypes.shape({
    tableId: PropTypes.number.isRequired,
    tableNumber: PropTypes.number.isRequired,
    seatingCapacity: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
  })).isRequired,
  selectedTables: PropTypes.arrayOf(PropTypes.number).isRequired,
  numberOfPersons: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default TableSelectionStep;