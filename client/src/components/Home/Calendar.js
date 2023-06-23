import React, { useState, useMemo } from "react";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [carouselIndex, setCarouselIndex] = useState(3);

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

  const dates = useMemo(() => {
    return generateHorizontalCalendarDates(25);
  }, []);

  const onDatePress = (date) => {
    setSelectedDate(date);
  };

  const handlePreviousClick = () => {
    if (carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (carouselIndex < dates.length - 6) {
      setCarouselIndex(carouselIndex + 1);
    }
  };

  const renderItem = ({ item, index }) => {
    const dayNumber = item.getDate();
    const dayString = getDayString(item);
    const isActive = selectedDate.toDateString() === item.toDateString();

    const handleClick = () => {
      onDatePress(item);
    };

    return (
      <li
        key={index}
        className={`day-w ${isActive ? "active" : ""}`}
        onClick={handleClick}
      >
        <span className={`dayName ${isActive ? "active" : ""}`}>
          {isToday(item) ? "today" : dayString}
        </span>
        <span className={`dateNumber ${isActive ? "active" : ""}`}>
          {dayNumber}
        </span>
      </li>
    );
  };

  return (
    <div className="home-calendar-container">
      <div className="carousel-container">
        <div className="carousel-btn">
          <i class="fa-solid fa-arrow-left" onClick={handlePreviousClick}></i>
          <i class="fa-solid fa-arrow-right" onClick={handleNextClick}></i>
        </div>

        <ul className="day-list">
          {dates
            .slice(carouselIndex, carouselIndex + 6)
            .map((date, index) => renderItem({ item: date, index }))}
        </ul>
      </div>
      <div className="status-bar" />
    </div>
  );
}
