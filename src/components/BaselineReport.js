//import './BaselineReport.css';
import React, { useEffect, useState } from "react";
var csv = require('jquery-csv');
//var csv = require('jquery-csv');
//import * as d3 from "d3";

const BaselineReport = ({setBuildingData, buildingData}) => {

  useEffect(() => {
  }, []);

  
  const handleFileChange = (e) => {
    e.preventDefault()

    let reader = new FileReader()
    reader.onload = function () {
      setBuildingData(reader.result)
      processData(reader.result)
    };
    reader.readAsBinaryString(e.target.files[0])
  }

  const processData = (data) => {

    let dataCsv = csv.toArrays(data);

    let baselineDate, baselineEload, baselineTemp = []
    
    dataCsv.forEach(element => {
      baselineDate.push(element[0])
      baselineEload.push(element[1])
      baselineTemp.push(element[2])
    });

    baselineDate.shift()
    baselineEload.shift()
    baselineTemp.shift()

    let d = {
      date: baselineDate,
      value: baselineEload
    }

  }

  return (
    <div className="form-component">
      <h1>Baseline & reporting</h1>
      <div className="form-component-item">
      </div>
    <div className="form-component-item">
      <p><b>Baseline start date</b></p>
      <input type="date"/>
      <p><b>Baseline end date</b></p>
      <input type="date"/>
    </div>
    <div className="form-component-item">
      <p><b>Reporting start date</b></p>
      <input type="date"/>
      <p><b>Reporting end date</b></p>
      <input type="date"/>
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

export default BaselineReport;