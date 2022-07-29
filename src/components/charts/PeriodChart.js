import React from "react";
import * as d3 from "d3";

const PeriodChart = ({ data }) => {
  
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
      .call(d3.axisRight(y1));

    // define first line
    let valueLine = d3
      .line()
      .x((d) => {
        return x(d.time);
      })
      .y((d) => {
        return y0(d.eload);
      });

    // define second line
    let valueLine2 = d3
      .line()
      .x((d) => {
        return x(d.time);
      })
      .y((d) => {
        return y1(d.temp);
      });

    svg
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1)
      .attr("d", valueLine);

    svg
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1)
      .attr("d", valueLine2);
  }, [data]);

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

export default PeriodChart;
