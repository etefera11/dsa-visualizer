import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { LinkedListStep } from "../../api/algorithms";

interface Props {
  step: LinkedListStep | null;
}

const NODE_R = 28;
const H_GAP = 90;
const SVG_H = 140;
const MARGIN = { left: 50, top: 60 };

export function LinkedListVisualizer({ step }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !step) return;

    const { nodes, active_index, comparing_index, new_index } = step;
    const n = nodes.length;
    const svgW = Math.max(600, n * H_GAP + MARGIN.left + 80);

    const svg = d3.select(svgRef.current);
    svg.attr("viewBox", `0 0 ${svgW} ${SVG_H}`);
    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

    // Draw arrows between nodes
    nodes.forEach((_, i) => {
      if (i < n - 1) {
        const x1 = i * H_GAP + NODE_R;
        const x2 = (i + 1) * H_GAP - NODE_R;

        g.append("defs").append("marker")
          .attr("id", `arrow-${i}`)
          .attr("viewBox", "0 0 10 10")
          .attr("refX", 8).attr("refY", 5)
          .attr("markerWidth", 6).attr("markerHeight", 6)
          .attr("orient", "auto-start-reverse")
          .append("path")
          .attr("d", "M2 1L8 5L2 9")
          .attr("fill", "none")
          .attr("stroke", "#444466")
          .attr("stroke-width", 1.5);

        g.append("line")
          .attr("x1", x1).attr("y1", 0)
          .attr("x2", x2).attr("y2", 0)
          .attr("stroke", "#444466")
          .attr("stroke-width", 2)
          .attr("marker-end", `url(#arrow-${i})`);
      }
    });

    // null pointer at end
    if (n > 0) {
      const tailX = (n - 1) * H_GAP + NODE_R + 10;
      g.append("text")
        .attr("x", tailX + 20).attr("y", 5)
        .attr("fill", "#555")
        .attr("font-size", 12)
        .text("null");

      g.append("line")
        .attr("x1", tailX).attr("y1", 0)
        .attr("x2", tailX + 18).attr("y2", 0)
        .attr("stroke", "#444466")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,3");
    }

    // Draw nodes
    nodes.forEach((node, i) => {
      const cx = i * H_GAP;

      const nodeColor = () => {
        if (node.index === new_index) return "#1D9E75";       // teal — new node
        if (node.index === comparing_index) return "#D85A30"; // coral — found/match
        if (node.index === active_index) return "#EF9F27";    // amber — currently visiting
        return "#534AB7";                                      // purple — default
      };

      // Circle
      g.append("circle")
        .attr("cx", cx).attr("cy", 0)
        .attr("r", NODE_R)
        .attr("fill", nodeColor())
        .attr("opacity", 0.9);

      // Value label
      g.append("text")
        .attr("x", cx).attr("y", 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .attr("font-size", 14)
        .attr("font-weight", "600")
        .text(node.value);

      // Index label below
      g.append("text")
        .attr("x", cx).attr("y", NODE_R + 16)
        .attr("text-anchor", "middle")
        .attr("fill", "#555")
        .attr("font-size", 11)
        .text(`[${i}]`);

      // HEAD label above first node
      if (i === 0) {
        g.append("text")
          .attr("x", cx).attr("y", -NODE_R - 8)
          .attr("text-anchor", "middle")
          .attr("fill", "#7F77DD")
          .attr("font-size", 11)
          .attr("font-weight", "600")
          .text("HEAD");
      }
    });

  }, [step]);

  if (!step) {
    return (
      <div className="visualizer-empty">
        Enter a list and choose an operation to start.
      </div>
    );
  }

  return (
    <div className="visualizer-wrapper">
      <svg
        ref={svgRef}
        style={{ width: "100%", height: "auto", minHeight: "140px" }}
      />
      <p className="step-description">{step.description}</p>
    </div>
  );
}