import React, { useState, useEffect, useRef } from "react";
import PeriodChart from "../charts/PeriodChart";
import Warning from "../layout/Warning";
import { arrayToCsv, arrStringToNum } from "../../utils/utils";
import { validateData, validateDates } from "./validations/DataValidator";
import * as d3 from "d3";
import CsvSpecs from "../../components/text/CsvSpecs";
import Button from "@mui/material/Button";
import DateInput from "./inputs/DateInput";

const csvParser = require("jquery-csv");

function BaselineReporting(props) {

  const [matrixData, setMatrixData] = useState(null)
  const [periodsData, setPeriodsData] = useState(null)

  const [canCheck, setCanCheck] = useState(false);
  const [canModel, setCanModel] = useState(false);  

  const [parsedData, setParsedData] = useState({});

  const [fileName, setFileName] = useState(null);

  const [dataValidationErrorMsg, setDataValidationErrorMsg] = useState(null);
  const [plotErrorMsg, setPlotErrorMsg] = useState(null);

  useEffect(() => {
    if (
      matrixData &&
      props.projectData.dates.start_baseline &&
      props.projectData.dates.end_baseline &&
      props.projectData.dates.start_reporting &&
      props.projectData.dates.end_reporting
    ) {
      setCanCheck(true);
    }
  }, [props.projectData, matrixData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileChange = async (event) => {
    event.preventDefault();

    const reader = new FileReader();

    reader.onload = function () {
      setFileName(event.target.files[0].name);
      saveData(reader.result)
    };

    if (event.target.files[0] != null) {
      reader.readAsBinaryString(event.target.files[0]);
    }
  };

  const saveData = async (dataCsv) => {

    let matrixData = await csvParser.toArrays(dataCsv)

    let validation = await validateData(matrixData)

    if (!validation.result) {
      setDataValidationErrorMsg(validation.message)
      return;
    }

    if (validation.result) {
      setDataValidationErrorMsg(null)
      setMatrixData(matrixData)
    }
  }

  const checkData = async () => {

    let validation = await validateDates(props.projectData.dates, matrixData)

    if (!validation.result) {
      setPlotErrorMsg(validation.message)
      return
    }

    if (validation.result) {
      setPlotErrorMsg(validation.message)
      let splittedData = await splitData()
      await parseData(splittedData)
      setCanModel(true)
    }
    return
  };

  const splitData = async () => {

    const startReportingDate = new Date(
      props.projectData.dates.start_reporting
    );

    const limit = matrixData
      .slice(1)
      .find(
        (element) => new Date(element[0]).getTime() == startReportingDate.getTime()
      );

    let indexToSplit = matrixData.indexOf(limit);
    let baseline = matrixData.slice(0, indexToSplit);
    let reporting = matrixData.slice(indexToSplit + 1);

    baseline.shift() //deletes column names

    let splittedData = {
      baseline: baseline,
      reporting: reporting
    }

    setPeriodsData(splittedData)
    return splittedData
  };

  const parseData = async (data) => {

    let parsedData = {}

    parsedData.baseline = await arrayToCsv(data.baseline);
    parsedData.reporting = await arrayToCsv(data.reporting);

    parsedData.baseline = "time,eload,temp\n" + parsedData.baseline;
    parsedData.reporting = "time,eload,temp\n" + parsedData.reporting;

    let parseTime = d3.timeParse("%m/%d/%y %H:%M");

    for (const period in parsedData) {
      let parsedPeriod = d3.csvParse(parsedData[period]);

      parsedPeriod.forEach((d) => {
        d.time = parseTime(d.time);
        d.eload = +d.eload;
        d.temp = +d.temp;
      });

      setParsedData((current) => ({ ...current, [period]: parsedPeriod }));
    }
    return
  }

  const onClickModel = async () => {
    await saveVectors();
    props.nextFormStep();
  };

  const saveVectors = async () => {

    for (const period in periodsData) {
      let date = [];
      let eload = [];
      let temp = [];

      periodsData[period].forEach((element) => {
        date.push(element[0]);
        eload.push(element[1]);
        temp.push(element[2]);
      });

      //parse string to int
      eload = await arrStringToNum(eload);
      temp = await arrStringToNum(temp);

      props.setProjectData((values) => ({
        ...values,
        [`${period}_datetime`]: date,
      }));
      props.setProjectData((values) => ({
        ...values,
        [`${period}_eload`]: eload,
      }));
      props.setProjectData((values) => ({
        ...values,
        [`${period}_temp`]: temp,
      }));
    }
    return
  };

  return (
    <div className="form-component">
      <h1>Baseline & reporting</h1>
      <div className="item">
        <h3>Upload building data</h3>
        <CsvSpecs></CsvSpecs>
        <Button
          variant="contained"
          component="label"
          onChange={handleFileChange}
          onClick={(event) => {
            event.target.value = null
          }}
          size="small"
          sx={{ mr: 1 }}
        >
          Upload file
          <input hidden accept=".csv" type="file" />
        </Button>
        <i>{fileName ? `Uploaded file: ${fileName}` : null}</i>
        <div>
          <Warning message={dataValidationErrorMsg} />
        </div>
      </div>
      <div className="item">
        <h3>Dates</h3>
        <p>
          <b>Baseline start date</b>
        </p>
        <div>
          <DateInput
            label={"Baseline start date"}
            onChange={props.handleDateChange}
            name="start_baseline"
            value={props.projectData.dates.start_baseline}
          />
        </div>
        <p>
          <b>Baseline end date</b>
        </p>
        <div>
          <DateInput
            name="end_baseline"
            onChange={props.handleDateChange}
            label="Baseline end date"
            value={props.projectData.dates.end_baseline}
          />
        </div>
        <p>
          <b>Reporting start date</b>
        </p>
        <div>
          <DateInput
            name="start_reporting"
            onChange={props.handleDateChange}
            label="Reporting start date"
            value={props.projectData.dates.start_reporting}
          />
        </div>
        <p>
          <b>Reporting end date</b>
        </p>
        <div>
          <DateInput
            name="end_reporting"
            onChange={props.handleDateChange}
            label="Reporting end date"
            value={props.projectData.dates.end_reporting}
          />
        </div>
      </div>

      <div className="item">
        <Button
          sx={{ my: 2 }}
          variant="contained"
          disabled={canCheck ? false : true}
          onClick={checkData}
        >
          Check data
        </Button>
      </div>

      <div>
        <Warning message={plotErrorMsg} />
      </div>

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

      <div className="item prev-back">
        <Button sx={{ my: 2 }} variant="contained" onClick={props.prevFormStep}>
          Back
        </Button>

        <Button
          sx={{ my: 2 }}
          variant="contained"
          disabled={canModel ? false : true}
          onClick={onClickModel}
        >
          Model
        </Button>
      </div>
    </div>
  );
}

export default BaselineReporting;
