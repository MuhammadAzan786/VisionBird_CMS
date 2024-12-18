const daysInMonth = (salary_year, salary_month) => new Date(salary_year, salary_month, 0).getDate();

module.exports = daysInMonth;
