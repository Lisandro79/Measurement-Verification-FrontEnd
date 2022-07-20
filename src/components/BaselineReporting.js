// import './BaselineReporting.css';
import React, { useState, useEffect, useRef } from "react";
import LineChart from "./LineChart";
import { arrayToCsv, formatDate } from "../utils/utils";
import * as d3 from 'd3';

const csv = require("jquery-csv");

function BaselineReporting(props) {

  const [inputCsv, setInputCsv] = useState(null);
  const [formattedData, setFormattedData] = useState({})
  const [projectDataComplete, setProjectDataComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [mockBoolean, setMockBoolean] = useState(false)//delete

  useEffect(() => {
    if (
      inputCsv &&
      props.projectData.dates.start_baseline &&
      props.projectData.dates.end_baseline &&
      props.projectData.dates.start_reporting &&
      props.projectData.dates.end_reporting
    ) {
      setProjectDataComplete(true);
    }
  }, [props.projectData]);

  useEffect(() => {
    if(Object.keys(formattedData).length !== 0){
      let baseline = arrayToCsv(formattedData.baseline);
      let reporting = arrayToCsv(formattedData.reporting);
      reporting = "time,eload,temp\n" + reporting;
  
      console.log(reporting);
      console.log(baseline);
    }    
  }, [formattedData.baseline, formattedData.reporting]);

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

      props.setProjectData((values) => ({ ...values, [`${key}_datetime`]: date }));
      props.setProjectData((values) => ({ ...values, [`${key}_eload`]: eload }));
      props.setProjectData((values) => ({ ...values, [`${key}_temp`]: temp }));
    }
  };

  const createChart = () => {
    if (!validateDates()) {
      return;
    }

    formatInputData()

    splitData()

    // //NEW
    // let parseTime = d3.timeParse("%m/%d/%y %H:%M");

    // baseline = d3.csvParse(baseline)
    // reporting = d3.csvParse(reporting)

    // baseline.forEach((d) => {
    //   d.time = parseTime(d.time);
    //   d.eload = +d.eload;
    //   d.temp = +d.temp;
    // });

    // reporting.forEach((d) => {
    //   d.time = parseTime(d.time);
    //   d.eload = +d.eload;
    //   d.temp = +d.temp;
    // });

    // setBaseline(baseline);
    // setReporting(reporting);
  };

  const formatInputData = () => {

  }

  const splitData = () => {
    const data = csv.toArrays(inputCsv);

    const startReportingDate = formatDate(props.projectData.dates.start_reporting);

    const limit = data.find((element) => element[0] === startReportingDate);

    let indexToSplit = data.indexOf(limit);
    let baseline = data.slice(0, indexToSplit);
    let reporting = data.slice(indexToSplit + 1);

    setFormattedData(current => ({ ...current, "baseline": baseline }))
    setFormattedData(current => ({ ...current, "reporting": reporting }))
  };

  const validateDates = () => {

    let dates = []

    for (let date in props.projectData.dates) {
      date = formatDate(props.projectData.dates[date])
      dates.push(date)
    }

    if (datesInCsv(dates) && checkDatesRanges()) {
      return true;
    }
    return false;
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

    foundAllDates ? setErrorMsg(null) : setErrorMsg("Check that the dates are in the csv")

    return foundAllDates
  };

  const checkDatesRanges = () => {
    if (props.projectData.start_baseline >= props.projectData.end_baseline) {
      setErrorMsg("Start baseline date has to be prior to end baseline date")
      return false
    }
    if (props.projectData.start_reporting >= props.projectData.end_reporting) {
      setErrorMsg("Start reporting date has to be prior to end reporting date")
      return false
    }
    if (props.projectData.end_baseline >= props.projectData.start_reporting) {
      setErrorMsg("End baseline date has to be after start reporting date")
      return false
    }
    setErrorMsg(null)
    return true
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
          onChange={props.handleDateChange}
        />
        <p>
          <b>Baseline end date</b>
        </p>
        <input
          type="datetime-local"
          name="end_baseline"
          onChange={props.handleDateChange}
        />
        <p>
          <b>Reporting start date</b>
        </p>
        <input
          type="datetime-local"
          name="start_reporting"
          onChange={props.handleDateChange}
        />
        <p>
          <b>Reporting end date</b>
        </p>
        <input
          type="datetime-local"
          name="end_reporting"
          onChange={props.handleDateChange}
        />
      </div>
      <div className="item" />

      {projectDataComplete ? (
        <div className="item">
          <button onClick={createChart}>Plot</button>
        </div>
      ) : null}

      {errorMsg}

      <div className="item">
        <h3>Baseline period</h3>
        <p>Please check that the data for the reporting is correct</p>
        {mockBoolean ? (
          <LineChart data={baseline} />
        ) : null}
      </div>

      <div className="item">
        <h3>Reporting period</h3>
        <p>Please check that the data for the reporting is correct</p>
        {mockBoolean ? (
          <LineChart data={reporting} />
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
