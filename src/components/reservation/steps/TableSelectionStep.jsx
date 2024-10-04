import PropTypes from 'prop-types';

const TableSelectionStep = ({ availableTables, selectedTables, onSelect, onNext }) => {
  const handleTableSelection = (table) => {
    const updatedSelection = selectedTables.includes(table.tableNumber)
      ? selectedTables.filter(t => t !== table.tableNumber)
      : [...selectedTables, table.tableNumber];
    onSelect(updatedSelection);
  };

  return (
    <div className="table-selection-step">
      <h2>Select Tables</h2>
      {availableTables.map((table) => (
        <button
          key={table.tableId}
          onClick={() => handleTableSelection(table)}
          className={selectedTables.includes(table.tableNumber) ? 'selected' : ''}
        >
          Table {table.tableNumber} (Seats {table.seatingCapacity}, {table.location})
        </button>
      ))}
      <button onClick={onNext}>Next</button>
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
  selectedTables: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default TableSelectionStep;