import PropTypes from 'prop-types';

const TableSelectionStep = ({ availableTables, selectedTables, onSelect, onNext }) => {
  const handleTableSelection = (table) => {
    const updatedSelection = selectedTables.includes(table)
      ? selectedTables.filter(t => t !== table)
      : [...selectedTables, table];
    onSelect(updatedSelection);
  };

  return (
    <div className="table-selection-step">
      <h2>Select Tables</h2>
      {availableTables.map((table) => (
        <button
          key={table.id}
          onClick={() => handleTableSelection(table)}
          className={selectedTables.includes(table) ? 'selected' : ''}
        >
          Table {table.number}
        </button>
      ))}
      <button onClick={onNext}>Next</button>
    </div>
  );
};

TableSelectionStep.propTypes = {
  availableTables: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
  })).isRequired,
  selectedTables: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default TableSelectionStep;