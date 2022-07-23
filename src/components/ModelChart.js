import { useD3 } from '../hooks/useD3';
import React from 'react';
import * as d3 from 'd3';


function ModelChart({ data }) {

  const ref = useD3(
    (svg) => {

      let margin = { top: 20, right: 20, bottom: 50, left: 70 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      const sumstat = d3.group(data, d => d.condition)

      const x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.datetime; }))
        .range([0, width]);
      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5));

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.eload; })])
        .range([height, 0]);
      svg.append("g")
        .call(d3.axisLeft(y));

      const color = d3.scaleOrdinal()
        .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])


      svg.selectAll(".line")
        .data(sumstat)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", function (d) { return color(d[0]) })
        .attr("stroke-width", 1.5)
        .attr("d", function (d) {
          return d3.line()
            .x(function (d) { return x(d.datetime); })
            .y(function (d) { return y(d.eload); })(d[1]);
        })

    },
    []
  );

  return (
    <div>
      <svg
        ref={ref}
        style={{
          height: 700,
          width: "100%",
          marginRight: "0px",
          marginLeft: "0px",
        }}
      >
        <g  transform="transform translate" className="plot-area" />
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default ModelChart;