const csvParser = require("jquery-csv");

const THREE_COLUMNS = 3

export async function validateData(csv) {
  const data = csvParser.toArrays(csv);

  let validation = await validateColumns(data)
  if (validation.result) validation = await validateContent(data)

  return validation
}

const validateColumns = async (data) => {
  const validation = {}

  if (!validateColumnNames(data)) {
    validation.result = false
    validation.message = "Please check the column names and try again"
    return validation
  }

  if (!validateThreeColumns(data)) {
    validation.result = false
    validation.message = "The csv has to have three columns"
    return validation
  }

  validation.result = true
  return validation
}

const validateColumnNames = async (data) => {
  return (
    data[0][0].toLowerCase() === "time" &&
    data[0][1].toLowerCase() === "eload" &&
    data[0][2].toLowerCase() === "temp"
  );
};

const validateThreeColumns = async (data) => {
  return data[0].length === THREE_COLUMNS
}

const validateContent = async (data) => {

  let validation = {}

  data.slice(1).forEach((row, idx) => {
    if (!validateRowLength(row) || !validateDataTypes(row)) {
      validation.result = false
      validation.message = `There is an error in row ${idx}, please check it and try again`
      return validation
    }
  })

  validation.result = true
  return validation
}

const validateRowLength = async (row) => {
  return row.length === THREE_COLUMNS
}

const validateDataTypes = async (row) => {
  let parsedDate = new Date(row[0])
  let parsedTime = parseFloat(row[1])
  let parsedEload = parseFloat(row[2])

  return !(isNaN(parsedDate) && isNaN(parsedTime) && isNaN(parsedEload))
}