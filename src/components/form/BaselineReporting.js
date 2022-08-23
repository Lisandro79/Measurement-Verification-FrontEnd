import React, { useState, useEffect, useRef } from "react";
import PeriodChart from "../charts/PeriodChart";
import Warning from "./Warning";
import { arrayToCsv, arrStringToNum } from "../../utils/utils";
import { validateData, validateDates } from "./validations/DataValidator";
import { formatDate } from "./validations/DateFormatter";
import * as d3 from "d3";
import CsvSpecs from "../../components/text/CsvSpecs";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const csvParser = require("jquery-csv");

function BaselineReporting(props) {

  const isFirstRender = useRef(true);

  const [dataCsv, setDataCsv] = useState(null);
  const [dataMatrix, setDataMatrix] = useState(null)

  const [fieldsCompleted, setFieldsCompleted] = useState(false);
  const [canModel, setCanModel] = useState(false);

  const [parsedData, setParsedData] = useState({});
  const [splittedData, setSplittedData] = useState({});
  const [formattedData, setFormattedData] = useState({});

  const [fileName, setFileName] = useState(null);

  const [dataValidationMsg, setDataValidationMsg] = useState(null);
  const [plotErrorMsg, setPlotErrorMsg] = useState(null);
  const [modelErrorMsg, setModelErrorMsg] = useState(null);

  useEffect(() => {
    if (
      dataCsv &&
      props.projectData.dates.start_baseline &&
      props.projectData.dates.end_baseline &&
      props.projectData.dates.start_reporting &&
      props.projectData.dates.end_reporting
    ) {
      setFieldsCompleted(true);
    }
  }, [props.projectData, dataCsv]);

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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    validateFile()

  }, [dataMatrix])

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
    setDataCsv(dataCsv)

    let dataMatrix = await csvParser.toArrays(dataCsv)
    setDataMatrix(dataMatrix)
  }

  const validateFile = async () => {

    let validation = await validateData(dataMatrix)

    console.log("esta " + validation.result);

    if (!validation.result) {
      setDataValidationMsg(validation.message)
      setTimeout(() => {
        setDataValidationMsg(null)
      }, 15000)
      return;
    }

    let parsedDates = await formatDate(dataMatrix)
    let dataCsv = await arrayToCsv(parsedDates)

    setDataCsv(dataCsv);
  };

  const checkData = async () => {

    let validation = await validateDates(props.projectData.dates, dataMatrix)

    if (!validation.result) {
      setPlotErrorMsg(validation.message)
      setTimeout(() => {
        setPlotErrorMsg(null)
      }, 15000)
    } else {
      splitData()
    }

  };

  const splitData = () => {

    const startReportingDate = new Date(
      props.projectData.dates.start_reporting
    );

    const limit = dataMatrix
      .slice(1)
      .find(
        (element) => new Date(element[0]).getTime() == startReportingDate.getTime()
      );

    let indexToSplit = dataMatrix.indexOf(limit);
    let baseline = dataMatrix.slice(0, indexToSplit);
    let reporting = dataMatrix.slice(indexToSplit + 1);

    baseline.shift() //deletes column names

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
