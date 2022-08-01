const CsvSpecs = () => {
  return (
    <div>
    <p>{"Please upload a .csv file with the following format:"}</p>
    <ul>
        <li>{"Column names: datetime | eload | temp"}</li>
        <li>{"Data format: Dates format ('M-D-Y H:M') | float | float"}</li>
        <li>{"Time, eload and temp columns must have the same length"}</li>
    </ul>
    </div>
  );
};

export default CsvSpecs;
