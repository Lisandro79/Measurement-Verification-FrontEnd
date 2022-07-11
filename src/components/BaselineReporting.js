// import './BaselineReporting.css';
import React, { useState, useEffect } from "react";
import PeriodChart from "./CreateLineChart";

const csv = require("jquery-csv");

function BaselineReporting({ projectData, handleChange, onClickModel }) {
  const [inputCsv, setInputCsv] = useState(null);
  const [baseline, setBaseline] = useState(null);
  const [reporting, setReporting] = useState(null);

  const handleFileChange = (e) => {
    e.preventDefault();

    const reader = new FileReader();
    reader.onload = function () {
      validateFile(reader.result);
    };
    reader.readAsBinaryString(e.target.files[0]);
  };

  const validateFile = (inputCsv) => {
    // TO DO: validation steps
    const data = csv.toArrays(inputCsv);

    const start_reporting = data.find(
      (element) => element[0] === "1/1/20 0:00" //replace with start_reporting
    );

    // let indexToSplit = data.indexOf(start_reporting);
    // let baseline = data.slice(0, indexToSplit);
    // let reporting = data.slice(indexToSplit + 1);

    // console.log(inputCsv);
    // console.log(data);
    // console.log(baseline);
    // console.log(reporting);

    // setBaseline(baseline);
    // setReporting(reporting);

    setInputCsv(inputCsv);
  };

  return (
    <div className="form-component">
      <h1>Baseline & reporting</h1>
      <div className="form-component-item" />
      <div className="form-component-item">
        <p>
          <b>Baseline start date</b>
        </p>
        <input type="date" onChange={handleChange} />
        <p>
          <b>Baseline end date</b>
        </p>
        <input type="date" onChange={handleChange} />
      </div>
      <div className="form-component-item">
        <p>
          <b>Reporting start date</b>
        </p>
        <input type="date" onChange={handleChange} />
        <p>
          <b>Reporting end date</b>
        </p>
        <input type="date" onChange={handleChange} />
      </div>
      <div className="form-component-item">
        <h3>Upload building data</h3>
        <p>CSV specs</p>
      </div>
      <div className="form-component-item">
        <p>Choose file</p>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </div>
      <div className="form-component-item test">
        <h3>Baseline period</h3>
        <p>Please check that the data for the baseline is correct</p>
        {inputCsv ? (
          <PeriodChart period={inputCsv} projectData={projectData} />
        ) : null}
      </div>
      <div className="form-component-item" />
      <div className="form-component-item">
        <h3>Reporting period</h3>
        <p>Please check if the data for the reporting period is correct</p>
        {inputCsv ? (
          <PeriodChart period={inputCsv} projectData={projectData} />
        ) : null}
      </div>
      <div className="form-component-item" />
      <button onClick={onClickModel}>Model</button>
    </div>
  );
}

export default BaselineReporting;
