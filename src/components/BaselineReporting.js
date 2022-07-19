// import './BaselineReporting.css';
import React, { useState, useEffect } from "react";
import LineChart from "./LineChart";

const csv = require("jquery-csv");

function BaselineReporting({ projectData, handleChange, setProjectData }) {
  const [inputCsv, setInputCsv] = useState(null);
  const [baseline, setBaseline] = useState(null);
  const [reporting, setReporting] = useState(null);
  const [projectDataComplete, setProjectDataComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
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

  const splitData = () => {
    const data = csv.toArrays(inputCsv);

    const startReportingDate = formatDate(projectData.start_reporting);

    const limit = data.find((element) => element[0] === startReportingDate);

    let indexToSplit = data.indexOf(limit);
    let baseline = data.slice(0, indexToSplit);
    let reporting = data.slice(indexToSplit + 1);

    const splittedData = new Object();
    splittedData.baseline = baseline;
    splittedData.reporting = reporting;

    return splittedData;
  };

  const onClickModel = () => {
    saveVectors();
  };

  const saveVectors = () => {
    let splittedData = splitData();

    for (const key in splittedData) {
      let date = [];
      let eload = [];
      let temp = [];

      splittedData[key].forEach((element) => {
        date.push(element[0]);
        eload.push(element[1]);
        temp.push(element[2]);
      });

      //deletes column name
      date.shift();
      eload.shift();
      temp.shift();

      setProjectData((values) => ({ ...values, [`${key}_datetime`]: date }));
      setProjectData((values) => ({ ...values, [`${key}_eload`]: eload }));
      setProjectData((values) => ({ ...values, [`${key}_temp`]: temp }));
    }
  };

  const createPlot = () => {
    if (!validateDates()) {
      return;
    }

    let splittedData = splitData();

    let baseline = arrayToCsv(splittedData.baseline);
    let reporting = arrayToCsv(splittedData.reporting);
    reporting = "time,eload,temp\n" + reporting;

    setBaseline(baseline);
    setReporting(reporting);
  };

  const validateDates = () => {
    const startBaseline = formatDate(projectData.start_baseline);
    const endBaseline = formatDate(projectData.end_baseline);
    const startReporting = formatDate(projectData.start_reporting);
    const endReporting = formatDate(projectData.end_reporting);

    let dates = [startBaseline, endBaseline, startReporting, endReporting];

    if (datesInCsv(dates) && checkDatesRanges()) {
      return true;
    }
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

  const datesInCsv = (dates) => {
    const data = csv.toArrays(inputCsv);
    let foundAllDates = true;
    let idx = 0;
    while (foundAllDates && idx < dates.length) {
      const found = data.find((element) => element[0] === dates[idx]);
      foundAllDates = found;
      idx++;
    }
    if(!foundAllDates){
      setErrorMsg("Check that the dates are in the csv")
    } else{
      setErrorMsg(null)
    }
    return foundAllDates
  };

  const checkDatesRanges = () => {
    if(projectData.start_baseline >= projectData.end_baseline){
      setErrorMsg("Start baseline date has to be prior to end baseline date")
      return false
    }
    if(projectData.start_reporting >= projectData.end_reporting){
      setErrorMsg("Start reporting date has to be prior to end reporting date")
      return false
    }
    if(projectData.end_baseline >= projectData.start_reporting){
      setErrorMsg("End baseline date has to be after start reporting date")
      return false
    }
    setErrorMsg(null)
    return true
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
      <div className="item">
        <h3>Upload building data</h3>
        <i>CSV specs</i>
        <p>Choose file</p>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </div>
      <div className="item">
        <h3>Dates</h3>
        <p>
          <b>Baseline start date</b>
        </p>
        <input
          type="datetime-local"
          name="start_baseline"
          onChange={handleChange}
        />
        <p>
          <b>Baseline end date</b>
        </p>
        <input
          type="datetime-local"
          name="end_baseline"
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
        <p>
          <b>Reporting end date</b>
        </p>
        <input
          type="datetime-local"
          name="end_reporting"
          onChange={handleChange}
        />
      </div>
      <div className="item" />

      {projectDataComplete ? (
        <div className="item">
          <button onClick={createPlot}>Plot</button>{" "}
        </div>
      ) : null}

      {errorMsg}

      <div className="item baseline">
        <h3>Baseline period</h3>
        <p>Please check that the data for the reporting is correct</p>
        {baseline ? (
          <LineChart dateTempEload={baseline} htmlClass={"baseline"} />
        ) : null}
      </div>

      <div className="item reporting">
        <h3>Reporting period</h3>
        <p>Please check that the data for the reporting is correct</p>
        {reporting ? (
          <LineChart dateTempEload={reporting} htmlClass={"reporting"} />
        ) : null}
      </div>

      {projectDataComplete ? (
        <div className="item">
          <button onClick={onClickModel}>Model</button>
        </div>
      ) : null}
    </div>
  );
}

export default BaselineReporting;
