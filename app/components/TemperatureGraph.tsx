// frontend/components/TemperatureGraph.tsx
"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface TemperatureData {
  date: string;
  temp_min?: number;
  temp_max?: number;
}

interface TemperatureGraphProps {
  data: TemperatureData[];
}

function fmtDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return d;
  }
}

export default function TemperatureGraph({ data }: TemperatureGraphProps) {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr("width", "100%")
      .attr("height", 200)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Prepare data for chart
    const chartData = data.map((d, i) => ({
      index: i,
      date: d.date,
      temp_max: d.temp_max ?? 0,
      temp_min: d.temp_min ?? 0,
    }));

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, chartData.length - 1])
      .range([0, width]);

    const allTemps = [...chartData.map(d => d.temp_max), ...chartData.map(d => d.temp_min)];
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(...allTemps) - 5, Math.max(...allTemps) + 5])
      .range([height, 0]);

    // Grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(yScale.ticks(5))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#2a2a2a")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3");

    // Area gradient
    const areaGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "areaGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    areaGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#8b5cf6")
      .attr("stop-opacity", 0.3);

    areaGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#8b5cf6")
      .attr("stop-opacity", 0);

    // Area between max and min
    const area = d3
      .area<any>()
      .x((d) => xScale(d.index))
      .y0((d) => yScale(d.temp_min))
      .y1((d) => yScale(d.temp_max))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(chartData)
      .attr("fill", "url(#areaGradient)")
      .attr("d", area);

    // Max temperature line
    const lineMax = d3
      .line<any>()
      .x((d) => xScale(d.index))
      .y((d) => yScale(d.temp_max))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "#a78bfa")
      .attr("stroke-width", 3)
      .attr("d", lineMax);

    // Min temperature line
    const lineMin = d3
      .line<any>()
      .x((d) => xScale(d.index))
      .y((d) => yScale(d.temp_min))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "#60a5fa")
      .attr("stroke-width", 3)
      .attr("d", lineMin);

    // Data points for max temp
    svg
      .selectAll(".dot-max")
      .data(chartData)
      .enter()
      .append("circle")
      .attr("class", "dot-max")
      .attr("cx", (d) => xScale(d.index))
      .attr("cy", (d) => yScale(d.temp_max))
      .attr("r", 5)
      .attr("fill", "#8b5cf6")
      .attr("stroke", "#1a1a1a")
      .attr("stroke-width", 2);

    // Data points for min temp
    svg
      .selectAll(".dot-min")
      .data(chartData)
      .enter()
      .append("circle")
      .attr("class", "dot-min")
      .attr("cx", (d) => xScale(d.index))
      .attr("cy", (d) => yScale(d.temp_min))
      .attr("r", 5)
      .attr("fill", "#3b82f6")
      .attr("stroke", "#1a1a1a")
      .attr("stroke-width", 2);

    // X-axis
    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(chartData.map((d) => d.index))
      .tickFormat((d) => fmtDate(chartData[d as number].date));

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .attr("color", "#9ca3af")
      .selectAll("text")
      .style("font-size", "12px");

    // Y-axis
    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg
      .append("g")
      .call(yAxis)
      .attr("color", "#9ca3af")
      .selectAll("text")
      .style("font-size", "12px");

  }, [data]);

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
      <svg ref={chartRef} className="w-full"></svg>
    </div>
  );
}
