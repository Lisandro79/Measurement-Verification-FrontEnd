import { useD3 } from "../hooks/useD3";
import React from "react";
import * as d3 from "d3";

function ModelChart({ data }) {
  const ref = useD3((svg) => {
    let margin = { top: 20, right: 20, bottom: 50, left: 70 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const sumstat = d3.group(data, (d) => d.condition);

    //X axis
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
      .call(d3.axisBottom(x).ticks(5));

    //Y axis
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

    //clipPath
    const clip = svg
      .append("defs")
      .append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    //Brushing
    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("end", updateChart);

    //line variable
    const line = svg.append("g").attr("clip-path", "url(#clip)");

    //list of colors
    const color = d3
      .scaleOrdinal()
      .range(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3"]);

    //new line
    line
      .append("path")
      .datum(sumstat)
      .attr("class", "line") 
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d[0]);
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

    //old lines
    // svg
    //   .selectAll(".line")
    //   .data(sumstat)
    //   .join("path")
    //   .attr("fill", "none")
    //   .attr("stroke", function (d) {
    //     return color(d[0]);
    //   })
    //   .attr("stroke-width", 1)
    //   .attr("d", function (d) {
    //     return d3
    //       .line()
    //       .x(function (d) {
    //         return x(d.datetime);
    //       })
    //       .y(function (d) {
    //         return y(d.eload);
    //       })(d[1]);
    //   });

    //brushing
    line.append("g").attr("class", "brush").call(brush);

    var idleTimeout;
    function idled() {
      idleTimeout = null;
    }

    // A function that update the chart for given boundaries
    function updateChart() {
      // What are the selected boundaries?
      extent = event.selection;

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if (!extent) {
        if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
        x.domain([4, 8]);
      } else {
        x.domain([x.invert(extent[0]), x.invert(extent[1])]);
        line.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and line position
      xAxis.transition().duration(1000).call(d3.axisBottom(x));
      line
        .select(".line")
        .transition()
        .duration(1000)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x(d.date);
            })
            .y(function (d) {
              return y(d.value);
            })
        );
    }

    // If user double click, reinitialize the chart
    svg.on("dblclick", function () {
      x.domain(
        d3.extent(data, function (d) {
          return d.date;
        })
      );
      xAxis.transition().call(d3.axisBottom(x));
      line
        .select(".line")
        .transition()
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x(d.date);
            })
            .y(function (d) {
              return y(d.value);
            })
        );
    });
  }, []);

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
        <g className="plot-area" />
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default ModelChart;
