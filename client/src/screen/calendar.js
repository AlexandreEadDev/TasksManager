import React, { useState, useMemo } from "react";

function dateAddDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getDayString(date) {
  return date.toString().split(" ")[0];
}

function isToday(date) {
  return new Date().toDateString() === date.toDateString();
}

function generateHorizontalCalendarDates(days) {
  const today = new Date();
  let result = [];
  for (let i = -4; i <= days; i++) {
    result.push(dateAddDays(today, i));
  }
  return result;
}

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dates = useMemo(() => {
    return generateHorizontalCalendarDates(25);
  }, []);

  const onDatePress = (date) => {
    setSelectedDate(date);
  };

  const renderItem = ({ item, index }) => {
    const dayNumber = item.getDate();
    const dayString = getDayString(item);
    const isActive = selectedDate.toDateString() === item.toDateString();

    const handleClick = () => {
      onDatePress(item);
    };

    return (
      <div
        className={`day-w ${isActive ? "active" : ""}`}
        onClick={handleClick}
      >
        <span className={`dayName ${isActive ? "active" : ""}`}>
          {isToday(item) ? "today" : dayString}
        </span>
        <span className={`dateNumber ${isActive ? "active" : ""}`}>
          {dayNumber}
        </span>
      </div>
    );
  };

  return (
    <div className="home-calendar-container">
      <div className="dates-w">
        <ul className="day-list">
          {dates.map((date, index) => (
            <li key={index}>{renderItem({ item: date, index })}</li>
          ))}
        </ul>
      </div>
      <div className="status-bar" />
    </div>
  );
}
