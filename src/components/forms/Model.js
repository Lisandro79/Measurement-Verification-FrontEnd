import { useEffect, useState } from "react";
import ModelChart from "../ModelChart";
import * as d3 from 'd3';
import { model } from "../../api/services";

const Model = (props) => {

  const [data, setData] = useState(null)

  useEffect(() => {

    const fetchData = async () => {

      let response = await fetch("template_response.json") //change to backend endpoint
      let json = await response.json()

      //console.log(json);

      let apiResponse = await model(json)
      console.log(apiResponse);
      
      //let response = await model(props.projectData)
      
      
      //let json = await response.json()

      let baseline = await parseBaseline(json)
      let reporting = await parseReporting(json)
      let counterfactual = await parseCounterfactual(json)
      
      let data = baseline.concat(reporting)
      data = data.concat(counterfactual)

      setData(data)

      return
    }
    fetchData()
  },[])
  

  // useEffect(() => {
  //   const fetchData = async () => {
  //     let response = await fetch("template_response.json") //change to backend endpoint
  //     let json = await response.json()

  //     let baseline = await parseBaseline(json)
  //     let reporting = await parseReporting(json)
  //     let counterfactual = await parseCounterfactual(json)
      
  //     let data = baseline.concat(reporting)
  //     data = data.concat(counterfactual)

  //     setData(data)  

  //     return
  //   }
  //   fetchData()
  // },[])

  const parseBaseline = async (json) => {
    let result = []
    let parseTime = d3.timeParse("%m/%d/%y %H:%M");

    json.baseline_datetime.forEach((date, index) => {
      let aux = {
        datetime: parseTime(date),
        condition: "baseline",
        eload: +json.baseline_eload[index]        
      };
      result.push(aux);
    });
    return result
  }

  const parseReporting = async (json) => {
    let result = []
    let parseTime = d3.timeParse("%m/%d/%y %H:%M");

    json.reporting_datetime.forEach((date, index) => {
      let aux = {
        datetime: parseTime(date),
        condition: "reporting",
        eload: +json.reporting_eload[index]        
      };
      result.push(aux);
    });
    return result
  }

  const parseCounterfactual = async (json) => {
    let result = []
    let parseTime = d3.timeParse("%m/%d/%y %H:%M");

    json.reporting_datetime.forEach((date, index) => {
      let aux = {
        datetime: parseTime(date),
        condition: "counterfactual",
        eload: +json.reporting_counterfactual_usage[index]        
      };
      result.push(aux);
    });
    return result
  }

  return (
    <div className="model-chart">
      <h1>Model</h1>
      <div className="item model">
        {data ? <ModelChart data={data}></ModelChart> : null}
      </div>
    </div>
  );
};

export default Model;
