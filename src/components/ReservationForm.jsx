import React, { useState, useEffect } from 'react'
import axios from 'axios';

const TableBooking = () => {
  const [customerId, setCustomerId] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [date, setDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    if (date && numberOfGuests) {
      // Fetch available time slots when the date and number of guests are selected
      axios
        .get(`/api/Reservation/GetReservationsForDate?date=${date}`)
        .then((response) => {
          const availableTimes = getAvailableTimeSlots(response.data, numberOfGuests);
          setTimeSlots(availableTimes);
        });
    }
  }, [date, numberOfGuests]);

  useEffect(() => {
    if (selectedTime) {
      // Fetch available tables when a time slot is selected
      axios
        .get(`/api/Table/all`)
        .then((response) => {
          setTables(response.data);
        });
    }
  }, [selectedTime]);

  const getAvailableTimeSlots = (reservations, guests) => {
    // Logic to filter available time slots based on reservations and guests
    // Example logic: return an array of available time slots
  };

  const handleTableSelection = (tableId) => {
    setSelectedTables((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the booking data to the API
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="customerId">Customer ID</label>
        <input
          type="text"
          className="form-control"
          id="customerId"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="numberOfGuests">Number of Guests</label>
        <input
          type="number"
          className="form-control"
          id="numberOfGuests"
          min="1"
          max="15"
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="reservationDate">Select Date</label>
        <input
          type="date"
          className="form-control"
          id="reservationDate"
          min={new Date().toISOString().split('T')[0]}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="availableTimeSlots">Available Time Slots</label>
        <select
          className="form-control"
          id="availableTimeSlots"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="">Select a time slot</option>
          {timeSlots.map((time, index) => (
            <option key={index} value={time.value}>
              {time.display}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="availableTables">Available Tables</label>
        <div id="availableTables">
          {tables.map((table) => (
            <div key={table.tableId} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`table-${table.tableId}`}
                value={table.tableId}
                onChange={() => handleTableSelection(table.tableId)}
              />
              <label className="form-check-label" htmlFor={`table-${table.tableId}`}>
                Table {table.tableNumber} ({table.seatingCapacity} seats, {table.location})
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="specialRequests">Special Requests</label>
        <textarea
          className="form-control"
          id="specialRequests"
          rows="3"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={!selectedTables.length}>
        Book Table
      </button>
    </form>
  );
};

export default TableBooking;