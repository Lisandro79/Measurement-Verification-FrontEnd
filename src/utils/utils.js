export const arrayToCsv = (array) => {
    var csv = array
      .map(function (d) {
        return d.join();
      })
      .join("\n");
    return csv;
};

export const arrStringToNum = async (arrOfStr) => {
  const arrOfNum = arrOfStr.map(str => {
    return Number(str);
  });
  return arrOfNum
}