const csvParser = require("jquery-csv");

export async function validateData(csv) {
  const data = csvParser.toArrays(csv);
  // return (
  //   (await checkColumnNames(data)) &&
  //   (await checkTypes(data)) &&
  //   (await checkColumnsLength(data))
  // );
  // return (
  //   (await checkColumnNames(data)) &&
  //   (await checkColumnsLength(data))
  // );
  validateContent(data)
  //checkContent(data)
}

const validateColumns = async (data) => {
  const validation = {}

  if (!validateColumnNames(data)){
    validation.result = false
    validation.message = "Please check the column names and try again"
    return validation
  }

  if (!validateThreeColumns(data)){
    validation.result = false
    validation.message = "The csv has to have three columns"
    return validation
  }

  if (!validateColumnsLength(data)){ //could be in single foreach
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
  return data[0].length === 3
}

const validateContent = async (data) => {
  let time = [];
  let eload = [];
  let temp = [];

  let validation = {}

  data.slice(1).forEach((row, idx) => {
    if(!validateRowLength(row) || !validateDataTypes(row)){
      validation.result = false
      validation.message = `There is an error in row ${idx}, please check it and try again`
      return validation
    }
  })

  validation.result = true
  return 

}



const validateColumnsLength = async (data) => {
  let time = [];
  let eload = [];
  let temp = [];

  data.slice(1).forEach((element) => {
    time.push(element[0]);
    eload.push(element[1]);
    temp.push(element[2]);
  });

  return time.length === eload.length && time.length === temp.length;
};

const checkContent = async (data) => {
  console.log(data.length);
}

// const checkTypes = async (data) => {
//   return checkTimeColumn(data) && checkFloatColumns(data);
// };

const checkTimeColumn = async (data) => {
  let parsedDates = [];

  data.slice(1).forEach((element) => {
    const date = new Date(element[0]);
    parsedDates.push(date);
  });

  return !parsedDates.some(isNaN);
};

const checkFloatColumns = async (data) => {
  let parsedEload = [];
  let parsedTemp = [];

  data.slice(1).forEach((element) => {
    parsedEload.push(parseFloat(element[1]));
    parsedTemp.push(parseFloat(element[2]));
  });

  return !parsedEload.some(isNaN) && !parsedTemp.some(isNaN);
};


