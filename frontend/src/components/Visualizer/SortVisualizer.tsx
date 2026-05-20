import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { SortStep } from "../../api/algorithms";

interface Props {
  step: SortStep | null;
}

const WIDTH = 600;
const HEIGHT = 300;
const MARGIN = { top: 20, right: 20, bottom: 30, left: 20 };

export function SortVisualizer({ step }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !step) return;

    const svg = d3.select(svgRef.current);
    const { array, comparing, swapped, sorted_indices } = step;
    const n = array.length;

    const innerW = WIDTH - MARGIN.left - MARGIN.right;
    const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;

    // Ensure the inner group exists (handles React Strict Mode double-invoke)
    if (svg.select("g.inner").empty()) {
      svg
        .append("g")
        .attr("class", "inner")
        .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);
    }

    const g = svg.select<SVGGElement>("g.inner");

    const x = d3
      .scaleBand()
      .domain(array.map((_, i) => String(i)))
      .range([0, innerW])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(array) ?? 1])
      .range([innerH, 0]);

    const barColor = (i: number): string => {
      if (sorted_indices.includes(i)) return "#1D9E75";
      if (swapped && comparing.includes(i)) return "#D85A30";
      if (comparing.includes(i)) return "#EF9F27";
      return "#7F77DD";
    };

    g.selectAll<SVGRectElement, number>("rect.bar")
      .data(array)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (_, i) => x(String(i)) ?? 0)
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d))
      .attr("height", (d) => innerH - y(d))
      .attr("rx", 3)
      .attr("fill", (_, i) => barColor(i))
      .attr("opacity", 0.9);

    g.selectAll<SVGTextElement, number>("text.val")
      .data(array)
      .join("text")
      .attr("class", "val")
      .attr("x", (_, i) => (x(String(i)) ?? 0) + x.bandwidth() / 2)
      .attr("y", (d) => y(d) - 4)
      .attr("text-anchor", "middle")
      .attr("font-size", n > 20 ? 0 : 11)
      .attr("fill", "#aaa")
      .text((d) => d);
  }, [step]);

  if (!step) {
    return (
      <div className="visualizer-empty">
        Enter an array and press Run to start.
      </div>
    );
  }

  return (
    <div className="visualizer-wrapper">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "auto" }}
      />
      <p className="step-description">{step.description}</p>
    </div>
  );
}
