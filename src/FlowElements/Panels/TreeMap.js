import * as d3 from 'd3';
import React, { useRef, useEffect} from "react";
import "./PanelStyles.css"

function TreeMap({ width, height, data}) {
  let ref = useRef();

  useEffect(() => {
    draw();
  }, [data]);

  const color = d3.scaleOrdinal().domain([]).range(["#9BF6FF","#FFD6A5","#BDB2FF","#FFADAD","#CAFFBF","#FDFFB6","#FFC6FF","#FFFFFC"]);

  let draw = () => {
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)

    const root = d3.hierarchy(data)
      .sum(function(d){ return d.value})
      .sort((a, b) => b.value - a.value);

    d3.treemap().size([width, height]) (root);

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
      .style("stroke-width", "2px")
      .style("fill", function (d) { return color(d.parent.data.name) } )
      .style("opacity", function (d) { return ((d.data.value)) } )

    nodes.exit().remove()

    const nodeText = svg
      .selectAll("text")
      .data(root.leaves());

    nodeText.enter()
      .append("text")
      .attr("x", function(d){ return d.x0+5})    // Offset right
      .attr("y", function(d){ return d.y0+15})   // Offset down
      .text(function(d){
          if ((d.y1-d.y0) < (height/8) || (d.x1-d.x0) < (width/15)) return "";      //If height too small, don't print
          if (d.data.name.length > 25) return (d.data.name.substring(0,25) +"..."); //Substring under 25 chars.
          else return d.data.name
        })
      .attr("font-size", "1px")
      .each(getSize)
      .attr("font-size", function (d) {
          if (d.scale * 1 > 12) {return 12 + "px";}
          else {return d.scale * 1 + "px";}
      })
      .attr("fill", "black")

    function getSize(d) {
      let margin = 10
      let boxwidth = d.x1 - d.x0;
      let selfwidth = this.getBBox().width;
      let scale;
      if ((boxwidth - margin) < 0) scale = 0;
      else scale = boxwidth - margin;
      d.scale = scale / selfwidth
    }

    let nodeVals = svg
        .selectAll("vals")
        .data(root.leaves())

    nodeVals.enter()
      .append("text")
      .attr("x", function(d){ return d.x0+5 })    // Offset right
      .attr("y", function(d){ return d.y0+28 })   // Offset down
      .text(function(d){
        if ((d.y1-d.y0) < (height/8) || (d.x1-d.x0) < (width/15)) return ""; //Don't print if box too small.
        return d.data.value
      })
      .attr("font-size", "1px")
      .each(getSize)
      .attr("font-size", function (d) {
        if (d.scale * 1 > 9) return "9px";
        if (d.scale * 1 < 4) return "0px";
        else return (d.scale * 1 - 2) + "px";
      })
      .attr("fill", "black")
  }

  return (
      <div className="chart">
        <svg ref={ref}></svg>
      </div>
  )
}

export default TreeMap;