"use client";

import React, { useRef, useEffect } from "react";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, PieController } from "chart.js";

// Register the necessary components for the Pie chart
ChartJS.register(ArcElement, Title, Tooltip, Legend, PieController);

interface ChartData {
  labels: string[];
  data: number[];
}

interface ChartProps {
  chartData: ChartData;
}

const PieChart: React.FC<ChartProps> = ({ chartData }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = new ChartJS(chartRef.current, {
        type: "pie", // Set the chart type to "pie"
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Sample Pie Chart",
              data: chartData.data, // The data values for the pie chart
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allows custom height and width
          layout: {
            padding: {
              top: 20,     // Top margin (extra space above the chart)
              left: 30,    // Left margin (extra space on the left of the chart)
              right: 30,   // Right margin (extra space on the right)
              bottom: 20,  // Bottom margin (extra space below the chart)
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Percentage Share Of Total Order Type",
            },
            tooltip: {
              enabled: true,
            },
          },
        },
      });

      // Cleanup chart instance when the component is unmounted
      return () => {
        chart.destroy();
      };
    }
  }, [chartData]);

  return <canvas ref={chartRef} style={{ width: "100%", height: "400px" }} />; // Set the canvas size
};

export default PieChart;
