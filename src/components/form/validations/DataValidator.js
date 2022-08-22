const csvParser = require("jquery-csv");

const THREE_COLUMNS = 3;
const ROW_GAP = 2

export async function validateData(csv) {
  const data = csvParser.toArrays(csv);

  let validation = await validateColumns(data);
  if (validation.result) validation = await validateContent(data);

  return validation;
}

const validateColumns = async (data) => {
  const validation = {};

  if (!validateColumnNames(data)) {
    validation.result = false;
    validation.message = "Please check the column names and try again";
    return validation;
  }

  if (!validateThreeColumns(data)) {
    validation.result = false;
    validation.message = "The csv has to have three columns";
    return validation;
  }

  validation.result = true;
  return validation;
};

const validateColumnNames = async (data) => {
  return (
    data[0][0].toLowerCase() === "time" &&
    data[0][1].toLowerCase() === "eload" &&
    data[0][2].toLowerCase() === "temp"
  );
};

const validateThreeColumns = async (data) => {
  return data[0].length === THREE_COLUMNS;
};

const validateContent = async (data) => {
  let validation = {};
  let dates = [];

  for (const [idx, row] of data.slice(1).entries()) {
    if (!(await validateRowLength(row)) || !(await validateDataTypes(row))) {
      validation.result = false;
      validation.message = `There is an error in row ${idx + ROW_GAP}, please check it and try again`;
      return validation;
    }
  }

  if (!(await validateDates(dates))) {
    validation.result = false;
    validation.message = `Date format must be 'M/D/Y H:M'`;
    return validation;
  }

  validation.result = true;
  return validation;
};

const validateRowLength = async (row) => {
  return row.length === THREE_COLUMNS;
};

const validateDataTypes = async (row) => {
  let parsedDate = new Date(row[0]);
  let parsedTime = parseFloat(row[1]);
  let parsedEload = parseFloat(row[2]);

  return !isNaN(parsedDate) && !isNaN(parsedTime) && !isNaN(parsedEload);
};

const validateDates = async (dates) => {
  return dates.every(validateDateFormat);
};

const validateDateFormat = async (date) => {
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
