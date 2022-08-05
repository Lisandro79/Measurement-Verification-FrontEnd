import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const LineChart = ({ data }) => {
  const dimensions = {
    width: 800,
    height: 400,
    margin: { top: 30, right: 30, bottom: 50, left: 60 },
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

        //option 2
        //svg.select(".line0").attr("d", line);

        d3.select(svgRef.current);
        svgEl.selectAll("*").remove();

        const svg = svgEl
          .call(zoom)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        //option 1
        svg
          .selectAll(".line0")
          .data(sumstat)
          .join("path")
          .attr("fill", "none")
          .attr("stroke", function (d) {
            return color(d[0]);
          })
          .attr("stroke-width", 1)
          .attr("d", function (d) {
            return d3
              .line()
              .x(function (d) {
                return xScale0(d.datetime);
              })
              .y(function (d) {
                return yScale(+d.eload);
              })(d[1]);
          });

        svg.select(".x-axis").call(d3.axisBottom(xScale0).tickSizeOuter(0));
      })
      .scaleExtent([1, 32]);

    //x scale
    const xScale0 = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d) {
          return d.datetime;
        })
      )
      .range([0, width]);

    //x scale for zoom
    const xScale1 = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d) {
          return d.datetime;
        })
      )
      .range([0, width]);

    //y scale
    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return +d.eload;
        }),
      ])
      .range([height, 0]);

    //sumstat and keys for legend
    const sumstat = d3.group(data, (d) => d.condition);
    let keys = ["Baseline", "Reporting", "Counterfactual"];

    // //line
    // let line = d3.line()
    // .x(data => xScale0(data.datetime))
    // .y(data => yScale(+data.eload))(data[1])

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

    // call y axis
    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

    //color range
    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range(["#0c6291", "#ffa600", "#a63446"]);

    svg
      .selectAll(".line0")
      .data(sumstat)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d[0]);
      })
      .attr("stroke-width", 1)
      .attr("d", function (d) {
        return d3
          .line()
          .x(function (d) {
            return xScale0(d.datetime);
          })
          .y(function (d) {
            return yScale(+d.eload);
          })(d[1]);
      });

    //x axis title
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width - 375)
      .attr("y", height + margin.top + 20)
      .text("Date");

    //y axis title
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 10)
      .attr("x", -margin.top - 85)
      .text("Energy Load [kWh]");

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
