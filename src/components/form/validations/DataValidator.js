const THREE_COLUMNS = 3;
const ROW_GAP = 2
const ONE_HOUR = 3600000

export async function validateData(data) {

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
    dates.push(row[0])
  }

  validation = await validateDateColumn(dates)

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

const validateDateColumn = async (dates) => {

  let validation = {}

  if (! await dates.every(validateDateFormat)) {
    validation.message = "Date format must be 'M/D/Y H:M'"
    validation.result = false
    return validation
  }

  validation = await continuousHours(dates)

  return validation
};

const validateDateFormat = async (date) => {
  const regex =
    /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(\d{4}|\d{2}) ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  return date.match(regex);
};

const continuousHours = async (dates) => {
  let validation = {}

  for (const [idx, date] of dates.slice(1).entries()) {
    if (!(((new Date(date)) - new Date(dates[idx])) === ONE_HOUR)) {
      validation.message = `There is one hour missing near row ${idx + ROW_GAP}`
      validation.result = false
      return validation
    }
  }
  
  validation.result = true
  return validation
}

export async function validateDates(dates, data) {

  let validation = await validateDateRanges(dates)
  if (validation.result) validation = await areDatesInData(dates, data)

  return validation
}

const validateDateRanges = async (dates) => {

  let validation = {}

  Object.keys(dates).forEach((key) => {
    let parsedDate = new Date(dates[key])
    dates[key] = parsedDate
  });

  if (dates.start_baseline >= dates.end_baseline) {
    validation.message = "Start baseline date has to be previous to end baseline date"
    validation.result = false
    return validation;
  }
  if (dates.start_reporting >= dates.end_reporting) {
    validation.message = "Start reporting date has to be previous to end reporting date"
    validation.result = false
    return validation;
  }
  if (dates.end_baseline >= dates.start_reporting) {
    validation.message = "End baseline date has to be after start reporting date"
    validation.result = false
    return validation;
  }

  validation.result = true
  return validation;
};

const areDatesInData = async (dates, data) => {

  let validation = {}

  for (let key in dates) {

    const found = data
      .slice(1)
      .find(
        (row) => new Date(row[0]).getTime() === dates[key].getTime()
      )

    if (!found) {
      validation.message = "The provided dates are not in the csv, please check them and try again"
      validation.result = false
      return validation
    }
  }
  validation.result = true
  return validation
}