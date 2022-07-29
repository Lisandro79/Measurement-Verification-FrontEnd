// import './BaselineReporting.css';
import React, { useState, useEffect } from "react";
import PeriodChart from "../charts/PeriodChart";
import { arrayToCsv, formatDate, arrStringToNum } from "../../utils/utils";
import * as d3 from 'd3';

const csv = require("jquery-csv");

function BaselineReporting(props) {

  const [inputCsv, setInputCsv] = useState(null);
  const [projectDataComplete, setProjectDataComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [parsedData, setParsedData] = useState({})
  const [splittedData, setSplittedData] = useState({})
  const [formattedData, setFormattedData] = useState({})

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

    const formatData = async () => {
      if (Object.keys(splittedData).length === 2) {

        let baseline = await arrayToCsv(splittedData.baseline);
        let reporting = await arrayToCsv(splittedData.reporting);
        reporting = "time,eload,temp\n" + reporting;

        setFormattedData(current => ({ ...current, "baseline": baseline }))
        setFormattedData(current => ({ ...current, "reporting": reporting }))
      }
      return
    }
    formatData()
  }, [splittedData.baseline, splittedData.reporting]);

  useEffect(() => {
    const parseData = async () => {
      let parseTime = d3.timeParse("%m/%d/%y %H:%M");

      for (const period in formattedData) {
        let parsedPeriod = d3.csvParse(formattedData[period])

        parsedPeriod.forEach((d) => {
          d.time = parseTime(d.time);
          d.eload = +d.eload;
          d.temp = +d.temp;
        });

        setParsedData(current => ({ ...current, [period]: parsedPeriod }))
      }
      return
    }
    parseData()
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

  const createChart = () => {
    if (!validateDates()) {
      return;
    }
    splitData()
  };

  const splitData = () => {
    const data = csv.toArrays(inputCsv);

    const startReportingDate = formatDate(props.projectData.dates.start_reporting);

    const limit = data.find((element) => element[0] === startReportingDate);

    let indexToSplit = data.indexOf(limit);
    let baseline = data.slice(0, indexToSplit);
    let reporting = data.slice(indexToSplit + 1);

    //convert to int

    
    setSplittedData(current => ({ ...current, "baseline": baseline }))
    setSplittedData(current => ({ ...current, "reporting": reporting }))
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

  const onClickModel = async () => {
    await saveVectors();
    props.clickModel()
  };

  const saveVectors = async () => {

    for(const period in splittedData){
      let date = [];
      let eload = [];
      let temp = [];

      splittedData[period].forEach((element) => {
        date.push(element[0]);
        eload.push(element[1]);
        temp.push(element[2]);
      });

      //deletes column name
      date.shift();
      eload.shift();
      temp.shift();

      //parse string to int
      eload = await arrStringToNum(eload)
      temp = await arrStringToNum(temp)

      props.setProjectData((values) => ({ ...values, [`${period}_datetime`]: date }));
      props.setProjectData((values) => ({ ...values, [`${period}_eload`]: eload }));
      props.setProjectData((values) => ({ ...values, [`${period}_temp`]: temp }));
    }
  }

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
        {parsedData.baseline ? (
          <PeriodChart data={parsedData.baseline} />
        ) : null}
      </div>

      <div className="item">
        <h3>Reporting period</h3>
        <p>Please check that the data for the reporting is correct</p>
        {parsedData.reporting ? (
          <PeriodChart data={parsedData.reporting} />
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
