import * as d3 from 'd3';
import React, { useRef, useEffect} from "react";

function TreeMap({ width, height, data}) {
  let ref = useRef();

  const reduceJsonData = (data, acc) => {
    if (data.hasOwnProperty('children')) {
      return (reduceJsonData(data.children, acc));
    } else {
      for (let i = 0; i < data.length; i++) acc.push(data[i].value);
      return Math.max(...acc);
    }
  }

  let valueDelimeter = reduceJsonData(data, []);

  useEffect(() => {
    draw();
  }, [data]);

  const color = d3.scaleOrdinal().domain([]).range(["#9BF6FF","#FFD6A5","#FFADAD","#FDFFB6","#CAFFBF","#A0C4FF","#BDB2FF","#FFC6FF","#FFFFFC"]);

  let draw = () => {
    const svg = d3.select(ref.current).attr("width", width)
        .attr("height", height)


    const root = d3.hierarchy(data)
        .sum(function(d){ return d.value})
        .sort((a, b) => b.value - a.value);

    d3.treemap().size([width, height])(root);

    const opacity = d3.scaleLinear()
        .domain([0, valueDelimeter])
        .range([.2,1]);

    const nodes = svg
        .selectAll("rect")
        .data(root.leaves());

    nodes.enter()
        .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "white")
        .style("fill", function(d){ return color(d.parent.data.name)} )
        .style("opacity", function(d){ return opacity(d.data.value)})

    nodes.exit().remove()

    const nodeText = svg
        .selectAll("text")
        .data(root.leaves());

    nodeText.enter()
        .append("text")
        .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
        .text(function(d){ return d.data.name.replace('mister_','') })
        .attr("font-size", "12px")
        .attr("fill", "black")

    var nodeVals = svg
        .selectAll("vals")
        .data(root.leaves())

    nodeVals.enter()
        .append("text")
        .attr("x", function(d){ return d.x0+5 })    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+35 })    // +20 to adjust position (lower)
        .text(function(d){ return d.data.value })
        .attr("font-size", "9px")
        .attr("fill", "black")
  }





  return (
      <div className="chart">
        <svg ref={ref}></svg>
      </div>
  )
}

export default TreeMap;