//import './BaselineReporting.css';
import PeriodChart from "./PeriodChart";
import React, { useState } from "react";
var csv = require('jquery-csv');


const BaselineReporting = ({ setBuildingData, buildingData }) => {

  const [inputCsv, setInputCsv] = useState(null);

  const handleFileChange = (e) => {
    e.preventDefault()

    let reader = new FileReader()
    reader.onload = function () {
      validateData(reader.result)
    };
    reader.readAsBinaryString(e.target.files[0])
  }

  const validateData = (inputCsv) => {

    //TO DO: validation steps
    let data = csv.toArrays(inputCsv);

    let date = []
    let eload = []
    let temp = []

    data.forEach(element => {
      date.push(element[0])
      eload.push(element[1])
      temp.push(element[2])
    });

    date.shift()
    eload.shift()
    temp.shift()

    //TO DO: if validation steps ok, do sets
    setBuildingData([date, eload, temp]) //for json
    setInputCsv(inputCsv) //for d3 graph
  }

  return (
    <div className="form-component">
      <h1>Baseline & reporting</h1>
      <div className="form-component-item">
      </div>
      <div className="form-component-item">
        <p><b>Baseline start date</b></p>
        <input type="date" />
        <p><b>Baseline end date</b></p>
        <input type="date" />
      </div>
      <div className="form-component-item">
        <p><b>Reporting start date</b></p>
        <input type="date" />
        <p><b>Reporting end date</b></p>
        <input type="date" />
      </div>
      <div className="form-component-item">
        <h3>Upload building data</h3>
        <p>CSV specs</p>
      </div>
      <div className="form-component-item">
        <p>Choose file</p>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </div>
      <div className="form-component-item">
        <h3>Baseline period</h3>
        <p>Please check that the data for the baseline is correct</p>
        {inputCsv ? <PeriodChart inputCsv={inputCsv}></PeriodChart> : null}        
      </div>
      <div className="form-component-item">
      </div>
      <div className="form-component-item">
        <h3>Reporting period</h3>
        <p>Please check if the data for the reporting period is correct</p>
      </div>
      <div className="form-component-item">
      </div>
      <button>Model</button>
    </div>
  );
}

export default BaselineReporting;