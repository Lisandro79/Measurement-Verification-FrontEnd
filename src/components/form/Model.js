import { useEffect, useState } from "react";
import ModelChart from "../charts/ModelChart";
import ModelChart2 from "../charts/ModelChart2";
import * as d3 from "d3";
import { model } from "../../api/model";
import template_data from "./template_data.json"
import template_response from "./template_response.json"



const Model = (props) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {

      //TEMPLATE DATA
      //let response = await model(template_data);

      //APP FORM
      // let response = await model(props.projectData);
      // console.log(response.data);

      let response = template_response

      let baseline = await parseBaseline(response);
      let reporting = await parseReporting(response);
      let counterfactual = await parseCounterfactual(response);

      let data = baseline.concat(reporting);
      data = data.concat(counterfactual);

      setData(data);

      return;
    };
    fetchData();
  }, []);

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
        {data ? <ModelChart2 data={data}></ModelChart2> : null}
      </div>
    </div>
  );
};

export default Model;
