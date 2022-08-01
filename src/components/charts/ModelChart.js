import React from "react";
import * as d3 from "d3";

const LineChart = ({ data }) => {

  const dimensions = {
    width: 800,
    height: 400,
    margin: { top: 30, right: 30, bottom: 50, left: 60 },
  };

  const svgRef = React.useRef(null);
  const { width, height, margin = {} } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;

  React.useEffect(() => {
    
    //svg config
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();
    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    //x axis
    const x = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d) {
          return d.datetime;
        })
      )
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    //x axis title
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width - 375)
      .attr("y", height + margin.top + 20)
      .text("Date");

    //y axis
    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return d.eload;
        }),
      ])
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    //y axis title
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 10)
    .attr("x", -margin.top - 85)
    .text("Energy Load [kWh]")

    //sumstat and keys for legend
    const sumstat = d3.group(data, (d) => d.condition);
    let keys = ["Baseline", "Reporting", "Counterfactual"];

    //color range
    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range(["#0c6291", "#ffa600", "#a63446"]);

    //add the lines
    svg
      .selectAll(".line")
      .data(sumstat)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d[1]);
      })
      .attr("stroke-width", 1)
      .attr("d", function (d) {
        return d3
          .line()
          .x(function (d) {
            return x(d.datetime);
          })
          .y(function (d) {
            return y(d.eload);
          })(d[1]);
      });

    //legends

    //dots
    svg
      .selectAll("dots")
      .data(keys)
      .enter()
      .append("circle")
      .attr("cx", function (d, i) {
        return 270 + i * 100;
      })
      .attr("cy", -23)
      .attr("r", 6)
      .style("fill", function (d) {
        return color(d);
      });

    //labels
    svg
      .selectAll("labels")
      .data(keys)
      .enter()
      .append("text")
      .attr("x", function (d, i) {
        return 280 + i * 100;
      })
      .attr("y", -23)
      .style("fill", function (d) {
        return color(d);
      })
      .text(function (d) {
        return d;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");
  }, [data]);

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

export default LineChart;
