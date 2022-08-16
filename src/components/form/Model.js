import { useEffect, useState, useRef } from "react";
import ModelChart from "../charts/ModelChart";
import * as d3 from "d3";
import { model } from "../../api/model";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Model = (props) => {
  const isFirstRender = useRef(true);
  const [modelData, setModelData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      let response = await model(props.projectData);

      if (response.data === undefined) {
        setErrorMsg("There was an error, please try again");
        setIsLoading(false);
      }

      setModelData(response.data);

      return;
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const parseData = async () => {

      let baseline = await parseBaseline(modelData)
      let reporting = await parseReporting(modelData)

      let chartData = baseline.concat(reporting);

      setIsLoading(false);
      setChartData(chartData);

      return;
    };
    parseData();
  }, [modelData]);


  const parseBaseline = async (data) => {
    let result = [];
    let parseTime = d3.timeParse("%m/%d/%y %H:%M");

    data.baseline_datetime.forEach((date, index) => {
      let aux = {
        datetime: parseTime(date),
        baseline_eload: +data.baseline_eload[index],
        reporting_eload: 0,
        reporting_counterfactual_usage: 0
      }
      result.push(aux)
    })
    return result
  }

  const parseReporting = async (data) => {
    let result = [];
    let parseTime = d3.timeParse("%m/%d/%y %H:%M");

    data.reporting_datetime.forEach((date, index) => {
      let aux = {
        datetime: parseTime(date),
        baseline_eload: 0,
        reporting_eload: +data.reporting_eload[index],
        reporting_counterfactual_usage: +data.reporting_counterfactual_usage[index]
      }
      result.push(aux)
    })
    return result
  }

  return (
    <div className="model-chart">
      <h1>Model</h1>
      <div className="item">
        {isLoading ? (
          <h4>Fitting model in progress...</h4>
        ) : (
          <h4>{errorMsg}</h4>
        )}
        {isLoading ? (
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        ) : (
          <h4>{errorMsg}</h4>
        )}
      </div>
      <div className="item">
        {chartData ? <ModelChart data={chartData}></ModelChart> : null}
      </div>
      <div className="item">
        {modelData ? (
          <h4>Energy savings: {modelData.meter_savings.toFixed(2)} kWh</h4>
        ) : null}
      </div>
      <div className="item prev-back">
        <Button sx={{ my: 2 }} variant="contained" onClick={props.prevFormStep}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default Model;
