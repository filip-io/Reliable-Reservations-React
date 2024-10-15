import { useState, useEffect, useCallback } from 'react';
import { getOpeningHours } from '../services/openingHoursService';

export const useOpeningHours = () => {
  const [openingHours, setOpeningHours] = useState([]);
  const [openingDays, setOpeningDays] = useState([]);

  useEffect(() => {
    fetchOpeningHours();
  }, []);

  const fetchOpeningHours = async () => {
    try {
      const hours = await getOpeningHours();
      console.log("Raw opening hours data:", hours);

      const openDays = hours
        .filter(hour => !hour.isClosed)
        .map(hour => {
          const [openHour, openMinute] = hour.openTime.split(':').map(Number);
          const [closeHour, closeMinute] = hour.closeTime.split(':').map(Number);
          return {
            dayOfWeek: hour.dayOfWeek,
            openingHour: openHour,
            openingMinute: openMinute,
            closingHour: closeHour,
            closingMinute: closeMinute
          };
        });

      console.log("Parsed opening hours:", openDays);
      setOpeningHours(openDays);

      const numericDays = openDays.map(day => {
        switch (day.dayOfWeek) {
          case "Sunday": return 0;
          case "Monday": return 1;
          case "Tuesday": return 2;
          case "Wednesday": return 3;
          case "Thursday": return 4;
          case "Friday": return 5;
          case "Saturday": return 6;
          default: return null;
        }
      }).filter(day => day !== null);

      console.log("Numeric days:", numericDays);
      setOpeningDays(numericDays);

    } catch (error) {
      console.error("Error fetching opening hours:", error);
    }
  };

  const getSelectedDayOpeningHours = useCallback((selectedDate) => {
    if (!selectedDate) return null;
    const selectedDay = new Date(selectedDate).toLocaleString('en-us', { weekday: 'long' });
    return openingHours.find(day => day.dayOfWeek === selectedDay) || null;
  }, [openingHours]);

  return {
    openingDays,
    openingHours,
    getSelectedDayOpeningHours,
  };
};