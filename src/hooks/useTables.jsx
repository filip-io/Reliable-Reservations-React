import { useState, useEffect, useCallback } from 'react';
import { getTables } from '../services/tableService';
import { getExistingReservations } from '../services/reservationService';

export const useTables = () => {
  const [availableTables, setAvailableTables] = useState([]);
  const [availableTablesForSelectedTime, setAvailableTablesForSelectedTime] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const tables = await getTables();
      setAvailableTables(tables);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const fetchReservations = useCallback(async (date) => {
    try {
      const existingReservations = await getExistingReservations(date);
      setReservations(existingReservations);
    } catch (error) {
      console.error("Error fetching existing reservations:", error);
    }
  }, []);

  const getAvailableTables = useCallback((slotStart, slotEnd) => {
    const reservedTableNumbers = new Set();
    reservations.forEach(reservation => {
      const resStart = new Date(reservation.startTime);
      const resEnd = new Date(reservation.endTime);
      if (slotStart < resEnd && slotEnd > resStart) {
        reservation.tableNumbers.forEach(tableNumber => reservedTableNumbers.add(tableNumber));
      }
    });
    return availableTables.filter(table => !reservedTableNumbers.has(table.tableNumber));
  }, [availableTables, reservations]);

  return {
    availableTables,
    availableTablesForSelectedTime,
    setAvailableTablesForSelectedTime,
    fetchReservations,
    getAvailableTables,
  };
};