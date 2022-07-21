import { useEffect, useState } from "react";
import LineChart from "./LineChart";
import ModelChart from "./ModelChart";

const Model = () => {

  const [canPlot, setCanPlot] = useState(false)
  const [data, setData] = useState({})
  

  useEffect(() => {
    const parseJson = async () => {
      let response = await fetch("template_response.json")
      let json = await response.json()
      console.log(json);
      let baseline = [];

      json.baseline_datetime.forEach((date, index) => {
        let aux = {
          time: date,
          eload: json.baseline_eload[index],
          temp: json.baseline_temp[index],
        };
        baseline.push(aux);
      });
      console.log(baseline);
      return
    }
    parseJson()
  },[])

  return (
    <div className="model-chart">
      <h1>Model</h1>
      <div className="item model">
        <ModelChart htmlClass={"model"}></ModelChart>
        {canPlot ? <LineChart></LineChart> : <h4>holaa</h4>}
      </div>
    </div>
  );
};

export default Model;
