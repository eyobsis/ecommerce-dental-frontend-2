"use client";

import React, { useRef, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController } from "chart.js";

// Register the necessary components for the Bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

interface ChartData {
  labels: string[];
  data: number[];
}

interface ChartProps {
  chartData: ChartData;
}

const ChartComponent: React.FC<ChartProps> = ({ chartData }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = new ChartJS(chartRef.current, {
        type: "bar",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Order Types",
              data: chartData.data,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
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
              text: "Order Types",
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

  return <canvas ref={chartRef}  />; // Set the canvas size
};

export default ChartComponent;