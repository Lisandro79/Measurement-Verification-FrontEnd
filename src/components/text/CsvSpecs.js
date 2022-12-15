import React from "react";

const CsvSpecs = () => {
  return (
    <div>
      <p>{"Please upload a .csv file with the following format:"}</p>
      <ul>
        <li>{"Column names: time | eload | temp"}</li>
        <li>{"Data format: Dates format ('M/D/Y H:M') | float | float"}</li>
        <li>{"Time, eload and temp columns must have the same length"}</li>
        <li>
          {
            "There cannot be NaN, null, empty values or hours with missing values in the csv"
          }
        </li>
      </ul>
    </div>
  );
};

export default CsvSpecs;
