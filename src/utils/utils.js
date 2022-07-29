export const arrayToCsv = (array) => {
    var csv = array
      .map(function (d) {
        return d.join();
      })
      .join("\n");
    return csv;
};

export const formatDate = (date) => {
    date = new Date(date);

    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date
      .getFullYear()
      .toString()
      .substr(-2)} ${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`;

    return formattedDate;
};


export const arrStringToNum = async (arrOfStr) => {
  const arrOfNum = arrOfStr.map(str => {
    return Number(str);
  });
  return arrOfNum
}