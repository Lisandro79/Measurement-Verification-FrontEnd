import { useEffect, useState } from "react";
import ModelChart from "../ModelChart";
import * as d3 from "d3";
import { model } from "../../api/model";

const Model = (props) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {

      //AXIOS
      let response = await fetch("template_data.json"); //change to backend endpoint
      let json = await response.json();
      console.log(json);

      let apiResponse = await model(json);
      console.log(apiResponse);
      console.log(apiResponse.data);

      //APP FORM
      // console.log(props.projectData);
      // let response = await model(props.projectData);
      // let apiResponse = await response.json();

      let baseline = await parseBaseline(apiResponse.data);
      let reporting = await parseReporting(apiResponse.data);
      let counterfactual = await parseCounterfactual(apiResponse.data);

      let data = baseline.concat(reporting);
      data = data.concat(counterfactual);

      setData(data);

      return;
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data])

  const parseBaseline = async (json) => {
    let result = [];
    let parseTime = d3.timeParse("%m/%d/%y %H:%M");

    json.baseline_datetime.forEach((date, index) => {
      let aux = {
        datetime: parseTime(date),
        condition: "baseline",
        eload: +json.baseline_eload[index],
      };
      result.push(aux);
    });
    return result;
  };

  const parseReporting = async (json) => {
    let result = [];
    let parseTime = d3.timeParse("%m/%d/%y %H:%M");

    json.reporting_datetime.forEach((date, index) => {
      let aux = {
        datetime: parseTime(date),
        condition: "reporting",
        eload: +json.reporting_eload[index],
      };
      result.push(aux);
    });
    return result;
  };

  const parseCounterfactual = async (json) => {
    let result = [];
    let parseTime = d3.timeParse("%m/%d/%y %H:%M");

    json.reporting_datetime.forEach((date, index) => {
      let aux = {
        datetime: parseTime(date),
        condition: "counterfactual",
        eload: +json.reporting_counterfactual_usage[index],
      };
      result.push(aux);
    });
    return result;
  };

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
