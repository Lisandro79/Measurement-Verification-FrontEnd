import { useD3 } from '../../hooks/useD3';
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

            let xAxis = svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x));



            let xcopy = x.copy()

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return d.eload; })])
                .range([height, 0]);


            let yAxis = svg.append("g")
                .call(d3.axisLeft(y));

            let ycopy = y.copy()

            const color = d3.scaleOrdinal()
                .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])


            svg.selectAll(".line")
                .data(sumstat)
                .join("path")
                .attr("fill", "none")
                .attr("stroke", function (d) { return color(d[0]) })
                .attr("stroke-width", 1)
                .attr("d", function (d) {
                    return d3.line()
                        .x(function (d) { return x(d.datetime); })
                        .y(function (d) { return y(d.eload); })(d[1]);
                })


            const zoom = d3
                .zoom()
                .scaleExtent([1, 32])
                .extent([[margin.left, 0], [width - margin.right, height]])
                .translateExtent([
                    [margin.left, -Infinity],
                    [width - margin.right, Infinity]
                ])
                .on("zoom", zoomed);

            function zoomed(event) {
                const xz = event.transform.rescaleX(x);
                const yz = event.transform.rescaleY(y);

                // updata domain on copied x scale so hover function can find the correct point
                xcopy.domain(xz.domain());
                ycopy.domain(yz.domain());

                // redraw paths with new x zoomed scale
                svg.selectAll(".line")
                    .attr("d", d => line(d.values, xz, yz));

                // find and redraw closest point path
                const pointer = d3.pointer(event, this);
                if (event.sourceEvent.type === "mousemove") {
                    highlightPoint(pointer, svg, path);
                }
                x.call(xAxis, xz);
                y.call(yAxis, yz);
            }

            svg.call(zoom);

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
                <g className="plot-area" />
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
        </div>
    );
}

export default ModelChart;