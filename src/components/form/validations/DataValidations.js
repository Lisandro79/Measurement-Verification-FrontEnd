const csvParser = require("jquery-csv");

export async function validateData(csv) {
  const data = csvParser.toArrays(csv);
  // return (
  //   (await checkColumnNames(data)) &&
  //   (await checkTypes(data)) &&
  //   (await checkColumnsLength(data))
  // );
  return (  
    (await checkTypes(data)) &&
    (await checkColumnsLength(data))
  );
}

const checkColumnNames = async (data) => {
  return (
    data[0][0].toLowerCase() === "time" &&
    data[0][1].toLowerCase() === "eload" &&
    data[0][2].toLowerCase() === "temp"
  );
};

const checkTypes = async (data) => {

  return checkTimeColumn(data) && checkFloatColumns(data);
};

const checkTimeColumn = async (data) => {
  let parsedDates = [];

  data.slice(1).forEach((element) => {
    const date = new Date(element[0]);
    parsedDates.push(date);
  });

  return !parsedDates.some(isNaN) //returns if every date is valid
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

const checkColumnsLength = async (data) => {

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
