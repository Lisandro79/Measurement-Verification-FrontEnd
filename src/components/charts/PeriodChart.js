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
    //zoom function
    let zoom = d3
      .zoom()
      .on("zoom", (event) => {
        xScale
          .domain(event.transform.rescaleX(xScale1).domain())
          .range([0, width].map((d) => event.transform.applyX(d))); //

        svg.select(".line0").attr("d", line0);
        svg.select(".line1").attr("d", line1);  

        svg.select(".x-axis").call(d3.axisBottom(xScale).tickSizeOuter(0)); 
      })
      .scaleExtent([1, 32]); 

    //x scale
    let xScale = d3
      .scaleTime()
      .domain(
        d3.extent(data, (d) => {
          return d.time;
        })
      )
      .range([0, width]);

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
        return xScale(d.time);
      })
      .y(function (d) {
        return yScale0(d.eload);
      });

    //second line (eload)
    let line1 = d3
      .line()
      .x(function (d) {
        return xScale(d.time);
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

    // clippath to stop line and x-axis 'spilling over'
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
    .attr("clip-path", "url(#clip)") // add the clip path!
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

  // Call the y-axis
  svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale0));

  // Append the path, bind the data, and call the line generator
  svg
    .append("path")
    .datum(data) // 10. Binds data to the line
    .attr("class", "line0") // Assign a class for styling
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("clip-path", "url(#clip)") // add the clip path!
    .attr("d", line0); // 11. Calls the line generator

    svg
    .append("path")
    .datum(data) // 10. Binds data to the line
    .attr("class", "line1") // Assign a class for styling
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("clip-path", "url(#clip)") // add the clip path!
    .attr("d", line1); // 11. Calls the line generator

    
  }, [data]);

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

export default PeriodChart;
