import React from "react";
import * as d3 from "d3";

const PeriodChart = ({ data }) => {

  const dimensions = {
    width: 800,
    height: 400,
    margin: { top: 50, right: 60, bottom: 50, left: 60 },
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

    //x and y axis
    let x = d3.scaleTime().range([0, width]);
    let y0 = d3.scaleLinear().range([height, 0]);
    let y1 = d3.scaleLinear().range([height, 0]);

    x.domain(
      d3.extent(data, (d) => {
        return d.time;
      })
    );
    y0.domain([
      0,
      d3.max(data, (d) => {
        return d.eload;
      }),
    ]);
    y1.domain([
      0,
      d3.max(data, (d) => {
        return d.temp;
      }),
    ]);

    //x axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    //y0 axis
    svg.append("g").call(d3.axisLeft(y0));

    //y1 axis
    svg
      .append("g")
      .attr("class", "axisRed")
      .attr("transform", "translate( " + width + ", 0 )")
      .call(d3.axisRight(y1))

    //x axis title
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width - 375)
      .attr("y", height + margin.top + 0)
      .text("Date");

    //y0 axis title
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 10)
      .attr("x", -margin.top - 85)
      .text("Energy Load [kWh]")

    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.right + 910)
      .attr("x", -margin.top - 100)
      .text("Temperature")


    //  first line (eload)
    let valueLine = d3
      .line()
      .x((d) => {
        return x(d.time);
      })
      .y((d) => {
        return y0(d.eload);
      });

    // second line (temp)
    let valueLine2 = d3
      .line()
      .x((d) => {
        return x(d.time);
      })
      .y((d) => {
        return y1(d.temp);
      });

    let keys = ["Eload", "Temperature"];

    //color range
    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range(["#0C6291", "#a63446"]);

    svg
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d);
      })
      .attr("stroke-width", 1.5)
      .attr("d", valueLine);

    svg
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d[1]);
      })
      .attr("stroke-width", 1.5)
      .attr("d", valueLine2);

    //dots
    svg
      .selectAll("dots")
      .data(keys)
      .enter()
      .append("circle")
      .attr("cx", function (d, i) {
        return 300 + i * 100;
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
        return 310 + i * 100;
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

export default PeriodChart;