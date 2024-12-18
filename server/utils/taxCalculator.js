const tax_calculator = (amount = 0) => {
  const RANGE_1_CONDTION = amount > 50000 && amount < 100000;
  const RANGE_1_TAX = 5 / 100;

  const RANGE_2_CONDTION = amount > 100000 && amount < 150000;
  const RANGE_2_TAX = 10 / 100;

  let netSalary = 0;

  if (RANGE_1_CONDTION) {
    const upperAmount = amount - 50000;
    const tax = upperAmount * RANGE_1_TAX;
    netSalary = amount - tax;
    console.log(netSalary);
    return netSalary;
  }

  if (RANGE_2_CONDTION) {
    const upperAmount = amount - 100000;
    const tax = upperAmount * RANGE_2_TAX;
    netSalary = amount - tax;
    return netSalary;
  }

  return amount;
};

module.exports = tax_calculator;
