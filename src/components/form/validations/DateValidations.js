const csvParser = require("jquery-csv");

export async function validateDates(csv) {
  const data = csvParser.toArrays(csv);

  let dates = [];

  data.slice(1).forEach((element) => {
    dates.push(element[0]);
  });

  return dates.every(validateDateFormat);
}

const validateDateFormat = (date) => {
  const regex =
    /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(\d{4}|\d{2}) ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  return date.match(regex);
};

export async function datesInCsv(dates, csv) {
  const data = csvParser.toArrays(csv);

  let foundAllDates = true;
  let idx = 0;

  while (foundAllDates && idx < dates.length) {
    const dateToFind = new Date(dates[idx]);

    const found = data
      .slice(1)
      .find(
        (element) => new Date(element[0]).getTime() === dateToFind.getTime()
      );
    if (!found) foundAllDates = false;
    idx++;
  }

  return foundAllDates;
}
