export const getCurrentMonth = (month) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonthIndex = month - 1;
  return months[currentMonthIndex];
};

export const WordCaptitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const getWorkingDays = (year, month) => {
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  let saturday_sundays = 0;

  for (let i = 1; i <= totalDaysInMonth; i++) {
    const day = new Date(year, month, i).getDay();
    if (day === 6 || day === 0) {
      saturday_sundays++;
    }
  }
  return totalDaysInMonth - saturday_sundays;
};

export const truncateText = (text, limit = 10) => {
  if (text.length < limit) {
    return text;
  }
  return text.slice(0, limit).trim() + "...";
};

export const salaryformatter = (salary) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
  }).format(salary);
};

export const shortDateWithMonthName = (date) => {
  let newDate = new Date(date);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(newDate);
};
