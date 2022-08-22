import React, { useState, useEffect } from "react";
import PeriodChart from "../charts/PeriodChart";
import Warning from "./Warning";
import { arrayToCsv, arrStringToNum } from "../../utils/utils";
import { validateData } from "./validations/DataValidator";
import { validateDates, datesInCsv } from "./validations/DateFormatter";
import * as d3 from "d3";
import CsvSpecs from "../../components/text/CsvSpecs";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const csv = require("jquery-csv");

function BaselineReporting(props) {
  const [inputCsv, setInputCsv] = useState(null);
  const [fieldsCompleted, setFieldsCompleted] = useState(false);
  const [canModel, setCanModel] = useState(false);
  const [plotErrorMsg, setPlotErrorMsg] = useState(null);
  const [modelErrorMsg, setModelErrorMsg] = useState(null);
  const [parsedData, setParsedData] = useState({});
  const [splittedData, setSplittedData] = useState({});
  const [formattedData, setFormattedData] = useState({});
  const [fileName, setFileName] = useState(null);
  const [dataValidationMsg, setDataValidationMsg] = useState(null);

  useEffect(() => {
    if (
      inputCsv &&
      props.projectData.dates.start_baseline &&
      props.projectData.dates.end_baseline &&
      props.projectData.dates.start_reporting &&
      props.projectData.dates.end_reporting
    ) {
      setFieldsCompleted(true);
    }
  }, [props.projectData, inputCsv]);

  useEffect(() => {
    const formatData = async () => {
      if (Object.keys(splittedData).length === 2) {
        let baseline = await arrayToCsv(splittedData.baseline);
        let reporting = await arrayToCsv(splittedData.reporting);
        baseline = "time,eload,temp\n" + baseline;
        reporting = "time,eload,temp\n" + reporting;

        setFormattedData((current) => ({ ...current, baseline: baseline }));
        setFormattedData((current) => ({ ...current, reporting: reporting }));
      }
      return;
    };
    formatData();
  }, [splittedData.baseline, splittedData.reporting]);

  useEffect(() => {
    const parseData = async () => {
      let parseTime = d3.timeParse("%m/%d/%y %H:%M");

      for (const period in formattedData) {
        let parsedPeriod = d3.csvParse(formattedData[period]);

        parsedPeriod.forEach((d) => {
          d.time = parseTime(d.time);
          d.eload = +d.eload;
          d.temp = +d.temp;
        });

        setParsedData((current) => ({ ...current, [period]: parsedPeriod }));
        setCanModel(true);
      }
      return;
    };
    parseData();
  }, [formattedData.baseline, formattedData.reporting]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileChange = (e) => {
    e.preventDefault();

    const reader = new FileReader();
    reader.onload = function () {
      setFileName(e.target.files[0].name);
      validateFile(reader.result);
    };
    reader.readAsBinaryString(e.target.files[0]);
  };

  const validateFile = async (inputCsv) => {
    let validation = await validateData(inputCsv)

    if (!validation.result) {
      setDataValidationMsg(validation.message)
      setTimeout(() => {
        setDataValidationMsg(null)
      }, 15000)
      return;
    }
    setInputCsv(inputCsv);
  };

  const checkData = async () => {
    if (!await validateDateRanges()) {
      return;
    }
    splitData();
  };

  const validateDateRanges = async () => {
    let dates = [];

    Object.keys(props.projectData.dates).forEach((key) => {
      dates.push(props.projectData.dates[key]);
    });

    if (!await datesInCsv(dates, inputCsv)) {
      setPlotErrorMsg(
        "There is an error in the dates, please check them and try again"
      )
      setTimeout(() => {
        setPlotErrorMsg(null)
      }, 15000)
      return false;
    }

    return await checkDatesRanges();
  };

  const checkDatesRanges = async () => {
    if (
      props.projectData.dates.start_baseline >=
      props.projectData.dates.end_baseline
    ) {
      setPlotErrorMsg(
        "Start baseline date has to be prior to end baseline date"
      )
      setTimeout(() => {
        setPlotErrorMsg(null)
      }, 15000)
      return false;
    }
    if (
      props.projectData.dates.start_reporting >=
      props.projectData.dates.end_reporting
    ) {
      setPlotErrorMsg(
        "Start reporting date has to be prior to end reporting date"
      )
      setTimeout(() => {
        setPlotErrorMsg(null)
      }, 15000)
      return false;
    }
    if (
      props.projectData.dates.end_baseline >=
      props.projectData.dates.start_reporting
    ) {
      setPlotErrorMsg("End baseline date has to be after start reporting date")
      setTimeout(() => {
        setPlotErrorMsg(null)
      }, 15000)
      return false;
    }
    return true;
  };

  const splitData = () => {
    const data = csv.toArrays(inputCsv);

    const startReportingDate = new Date(
      props.projectData.dates.start_reporting
    );

    const limit = data
      .slice(1)
      .find(
        (element) => new Date(element[0]).getTime() == startReportingDate.getTime()
      );

    let indexToSplit = data.indexOf(limit);
    let baseline = data.slice(0, indexToSplit);
    let reporting = data.slice(indexToSplit + 1);

    baseline.shift()

    setSplittedData((current) => ({ ...current, baseline: baseline }));
    setSplittedData((current) => ({ ...current, reporting: reporting }));
  };

  const onClickModel = async () => {
    await saveVectors();
    props.nextFormStep();
  };

  const saveVectors = async () => {
    for (const period in splittedData) {
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
          size="small"
          sx={{ mr: 1 }}
        >
          Upload file
          <input hidden accept=".csv" type="file" />
        </Button>
        <i>{fileName ? `Uploaded file: ${fileName}` : null}</i>
        <div>
          <Warning message={dataValidationMsg} />
        </div>
      </div>
      <div className="item">
        <h3>Dates</h3>
        <p>
          <b>Baseline start date</b>
        </p>
        <div>
          <TextField
            type="datetime-local"
            step="3600"
            name="start_baseline"
            onChange={props.handleDateChange}
            label="Baseline start date"
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            value={props.projectData.dates.start_baseline}
          />
        </div>
        <p>
          <b>Baseline end date</b>
        </p>
        <div>
          <TextField
            type="datetime-local"
            step="3600"
            name="end_baseline"
            onChange={props.handleDateChange}
            label="Baseline end date"
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            value={props.projectData.dates.end_baseline}
          />
        </div>
        <p>
          <b>Reporting start date</b>
        </p>
        <div>
          <TextField
            type="datetime-local"
            step="3600"
            name="start_reporting"
            onChange={props.handleDateChange}
            label="Reporting start date"
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            value={props.projectData.dates.start_reporting}
          />
        </div>
        <p>
          <b>Reporting end date</b>
        </p>
        <div>
          <TextField
            type="datetime-local"
            step="3600"
            name="end_reporting"
            onChange={props.handleDateChange}
            label="Reporting end date"
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            value={props.projectData.dates.end_reporting}
          />
        </div>
      </div>

      <div className="item">
        <Button
          sx={{ my: 2 }}
          variant="contained"
          disabled={fieldsCompleted ? false : true}
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

      <div>
        <Warning message={modelErrorMsg} />
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
