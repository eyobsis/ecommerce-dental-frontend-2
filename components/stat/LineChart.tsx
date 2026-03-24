"use client";

import React, { useRef, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, LineController } from "chart.js";

// Register the necessary components for the Line chart
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, LineController);

interface ChartData {
  labels: string[];
  data: number[];
}

interface ChartProps {
  chartData: ChartData;
}

const LineChart: React.FC<ChartProps> = ({ chartData }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = new ChartJS(chartRef.current, {
        type: "line", // Change chart type to line
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Order Amount",
              data: chartData.data,
              borderColor: "rgba(75, 192, 192, 1)",  // Line color
              backgroundColor: "rgba(75, 192, 192, 0.2)",  // Area under the line (optional)
              borderWidth: 2,
              tension: 0.4, // Makes the line smooth (optional)
              fill: true,   // Fills the area under the line (optional)
              pointRadius: 5, // Size of the data points (optional)
              pointBackgroundColor: "rgba(75, 192, 192, 1)", // Color of the points
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
              text: "Order Volume per month", // Customize title text
            },
            tooltip: {
              enabled: true,
            },
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
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

  return <canvas ref={chartRef} />; // Set the canvas size
};

export default LineChart;
