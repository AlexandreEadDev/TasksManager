import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";

export default function Calendar() {
  const [todayDate, setTodayDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [carouselIndex, setCarouselIndex] = useState(3);

  const tasksList = useSelector((state) => state.tasksList);
  const { tasks } = tasksList;

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
  const hasDeadline = (date) => {
    const dateString = date.toDateString();
    return tasks.some((task) => {
      if (task.deadline) {
        const taskDate = new Date(task.deadline);
        return taskDate.toDateString() === dateString;
      }
      return false;
    });
  };

  const renderItem = ({ item, index }) => {
    const dayNumber = item.getDate();
    const dayString = getDayString(item);
    const isActive = selectedDate.toDateString() === item.toDateString();
    const deadline = hasDeadline(item);

    const handleClick = () => {
      onDatePress(item);
    };

    return (
      <li
        key={index}
        className={`day-w ${isActive ? "active" : ""} ${
          deadline ? "has-deadline" : ""
        }`}
        onClick={handleClick}
      >
        <span
          className={`dayName ${isActive ? "active" : ""} ${
            deadline ? "has-deadline" : ""
          }`}
        >
          {isToday(item) ? "today" : dayString}
        </span>
        <span
          className={`dateNumber ${isActive ? "active" : ""} ${
            deadline ? "has-deadline" : ""
          }`}
        >
          {dayNumber}
        </span>
      </li>
    );
  };

  // Extract month and year from the selected date
  const activeMonth = selectedDate.toLocaleString("en-US", { month: "long" });
  const activeYear = selectedDate.getFullYear();

  return (
    <div className="home-calendar-container">
      <div className="home-calendar-title">
        <h1>Calendar</h1>
        <p className="home-month-years">
          {activeMonth}, {activeYear}
        </p>
      </div>
      <div className="carousel-container">
        <div className="carousel-btn">
          <i
            className="fa-solid fa-arrow-left"
            onClick={handlePreviousClick}
          ></i>
          <i className="fa-solid fa-arrow-right" onClick={handleNextClick}></i>
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
