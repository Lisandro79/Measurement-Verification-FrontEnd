//import './BaselineReporting.css';
import React, { useEffect, useState } from "react";
import * as d3 from "d3";
var csv = require('jquery-csv');


const BaselineReporting = ({ setBuildingData, buildingData }) => {

  useEffect(() => {
    createGraph()
  }, [buildingData]);


  const handleFileChange = (e) => {
    e.preventDefault()

    let reader = new FileReader()
    reader.onload = function () {
      validateData(reader.result)
    };
    reader.readAsBinaryString(e.target.files[0])
  }

  const validateData = (dataCsv) => {

    let data = csv.toArrays(dataCsv);

    let date = []
    let eload = []
    let temp = []

    data.forEach(element => {
      date.push(element[0])
      eload.push(element[1])
      temp.push(element[2])
    });

    //deletes column name
    date.shift()
    eload.shift()
    temp.shift()

    setBuildingData([date, eload, temp])

    createGraph(dataCsv)
  }

  const createGraph = async (dataCsv) => {

    let data = d3.csvParse(dataCsv)

    let parseTime = d3.timeParse("%m/%d/%y %H:%M");

    data.forEach((d) => {
      d.time = parseTime(d.time);
      d.eload = +d.eload;
    });

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 50, left: 70 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add X axis and Y axis
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(data, (d) => { return d.time }));
    y.domain([0, d3.max(data, (d) => { return d.eload })]);

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
    svg.append("g")
      .call(d3.axisLeft(y));


    // add the Line
    var valueLine = d3.line()
      .x((d) => { return x(d.time); })
      .y((d) => { return y(d.eload); });

    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", valueLine)

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