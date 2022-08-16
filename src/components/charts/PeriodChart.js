import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const PeriodChart = ({ data }) => {
  const dimensions = {
    width: 800,
    height: 400,
    margin: { top: 50, right: 60, bottom: 50, left: 60 },
  };

  const svgRef = useRef(null);
  const { width, height, margin = {} } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;

  useEffect(() => {
    //zoom function
    let zoom = d3
      .zoom()
      .on("zoom", (event) => {
        xScale0
          .domain(event.transform.rescaleX(xScale1).domain())
          .range([0, width].map((d) => event.transform.applyX(d)));

        svg.select(".line0").attr("d", line0);
        svg.select(".line1").attr("d", line1);

        svg.select(".x-axis").call(d3.axisBottom(xScale0).tickSizeOuter(0));
      })
      .scaleExtent([1, 32]);

    //x scale
    let xScale0 = d3
      .scaleTime()
      .domain(
        d3.extent(data, (d) => {
          return d.time;
        })
      )
      .range([0, width]);

    //x scale for zoom
    let xScale1 = d3
      .scaleTime()
      .domain(
        d3.extent(data, (d) => {
          return d.time;
        })
      )
      .range([0, width]);

    //y0 scale
    const yScale0 = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => {
          return +d.eload;
        }),
      ])
      .range([height, 0]);

    // //y1 scale
    let yScale1 = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => {
          return d.temp;
        }),
      ])
      .range([height, 0]);

    //first line (eload)
    let line0 = d3
      .line()
      .x(function (d) {
        return xScale0(d.time);
      })
      .y(function (d) {
        return yScale0(d.eload);
      });

    //second line (temp)
    let line1 = d3
      .line()
      .x(function (d) {
        return xScale0(d.time);
      })
      .y(function (d) {
        return yScale1(d.temp);
      });

    //svg config
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();

    const svg = svgEl
      .call(zoom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // clippath to stop line and x axis spilling over
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("x", 0)
      .attr("width", width)
      .attr("height", height);

    // call x-axis and apply the clip from the defs
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("clip-path", "url(#clip)")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale0));

    // call y0 axis
    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale0));

    //call y1 axis
    svg
      .append("g")
      .attr("transform", "translate( " + width + ", 0 )")
      .call(d3.axisRight(yScale1))

    let keys = ["Eload", "Temperature"];

    //color range
    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range(["#0C6291", "#a63446"]);

    // Append the path, bind the data, and call the line generator
    svg
      .append("path")
      .datum(data)
      .attr("class", "line0")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d);
      })
      .attr("stroke-width", 1.5)
      .attr("clip-path", "url(#clip)")
      .attr("d", line0);

    svg
      .append("path")
      .datum(data)
      .attr("class", "line1")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d[1]);
      })
      .attr("stroke-width", 1.5)
      .attr("clip-path", "url(#clip)")
      .attr("d", line1);

    //legend dots
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

    //legend labels
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
