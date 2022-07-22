import { useEffect, useState } from "react";
import ModelChart from "./ModelChart";
import * as d3 from 'd3';

const Model = () => {

  const [data, setData] = useState(null)
  

  useEffect(() => {
    const fetchData = async () => {
      let response = await fetch("template_response.json")
      let json = await response.json()

      let baseline = await parseBaseline(json)
      let reporting = await parseReporting(json)
      
      let data = baseline.concat(reporting)
      setData(data)  

      return
    }
    fetchData()
  },[])

  const parseBaseline = async (json) => {
    let result = []
    let parseTime = d3.timeParse("%m/%d/%y %H:%M");

    json.baseline_datetime.forEach((date, index) => {
      let aux = {
        datetime: parseTime(date),
        eload: +json.baseline_eload[index],
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
        eload: +json.reporting_eload[index],
        counterfactual_usage: +json.reporting_counterfactual_usage[index],
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
