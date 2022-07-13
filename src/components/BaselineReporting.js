// import './BaselineReporting.css';
import React, { useState, useEffect } from "react";
import LineChart from "./LineChart";

const csv = require("jquery-csv");

function BaselineReporting({ projectData, handleChange, onClickModel }) {
  const [inputCsv, setInputCsv] = useState(null);
  const [baseline, setBaseline] = useState(null);
  const [reporting, setReporting] = useState(null);
  const [projectDataComplete, setProjectDataComplete] = useState(false);
  const [plotError, setPlotError] = useState(false);

  useEffect(() => {
    isProjectDataComplete();
  }, [projectData]);

  const isProjectDataComplete = () => {
    if (
      inputCsv &&
      projectData.start_baseline &&
      projectData.end_baseline &&
      projectData.start_reporting &&
      projectData.end_reporting
    ) {
      setProjectDataComplete(true);
    }
  };

  const handleFileChange = (e) => {
    e.preventDefault();

    const reader = new FileReader();
    reader.onload = function () {
      validateFile(reader.result);
    };
    reader.readAsBinaryString(e.target.files[0]);
  };

  const validateFile = (inputCsv) => {
    //TO DO: validate data of csv file
    setInputCsv(inputCsv);
  };

  const createPlot = () => {
    if (!validateDates()) {
      setPlotError(true);
      return;
    }
    setPlotError(false);

    const data = csv.toArrays(inputCsv);

    const startReportingDate = formatDate(projectData.start_reporting);

    const limit = data.find((element) => element[0] === startReportingDate);

    let indexToSplit = data.indexOf(limit);
    let baseline = data.slice(0, indexToSplit);
    let reporting = data.slice(indexToSplit + 1);

    baseline = arrayToCsv(baseline);
    reporting = arrayToCsv(reporting);
    reporting = "time,eload,temp\n" + reporting;

    setBaseline(baseline);
    setReporting(reporting);
  };

  const validateDates = () => {
    const startReporting = formatDate(projectData.start_reporting);
    const data = csv.toArrays(inputCsv);
    const found = data.find((element) => element[0] === startReporting);

    if (found) return true;
    return false;
  };

  const formatDate = (date) => {
    date = new Date(date);

    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date
      .getFullYear()
      .toString()
      .substr(-2)} ${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`;

    return formattedDate;
  };

  const arrayToCsv = (array) => {
    var csv = array
      .map(function (d) {
        return d.join();
      })
      .join("\n");
    return csv;
  };

  return (
    <div className="form-component">
      <h1>Baseline & reporting</h1>
      <div className="form-component-item" />
      <div className="form-component-item">
        <h3>Upload building data</h3>
        <p>CSV specs</p>
      </div>
      <div className="form-component-item">
        <p>Choose file</p>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </div>
      <div className="form-component-item">
        <p>
          <b>Baseline start date</b>
        </p>
        <input
          type="datetime-local"
          name="start_baseline"
          onChange={handleChange}
        />
        <p>
          <b>Reporting start date</b>
        </p>
        <input
          type="datetime-local"
          name="start_reporting"
          onChange={handleChange}
        />
      </div>
      <div className="form-component-item">
        <p>
          <b>Baseline end date</b>
        </p>
        <input
          type="datetime-local"
          name="end_baseline"
          onChange={handleChange}
        />
        <p>
          <b>Reporting end date</b>
        </p>
        <input
          type="datetime-local"
          name="end_reporting"
          onChange={handleChange}
        />
      </div>
      <div className="form-component-item" />

      {projectDataComplete ? <button onClick={createPlot}>Plot</button> : null}

      {baseline ? (
        <div className="form-component-item baseline">
          <h3>Baseline period</h3>
          <p>Please check that the data for the baseline is correct</p>
          <LineChart period={baseline} htmlClass={"baseline"} />
        </div>
      ) : null}

      {reporting ? (
        <div className="form-component-item reporting">
          <h3>Baseline period</h3>
          <p>Please check that the data for the reporting is correct</p>
          <LineChart period={reporting} htmlClass={"reporting"} />
        </div>
      ) : null}

      {plotError ? "The start reporting date is not in the CSV" : null}

      <div className="form-component-item" />
      <button onClick={onClickModel}>Model</button>
    </div>
  );
}

export default BaselineReporting;
