import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { vacationsService } from "../../../Services/VacationsService";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { saveAs } from "file-saver"; // file-saver for CSV download
import { useNavigate } from "react-router-dom";
import "./VacationReport.css";

// Register necessary components for Chart.js to work with bar charts
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// VacationReport component to display a report of vacation likes in a bar chart format
export function VacationReport(): JSX.Element {
  // State to hold the report data fetched from the API, containing vacation destinations and their corresponding likes count
  const [reportData, setReportData] = useState<
    { destination: string; likesCount: number }[]
  >([]);

  // useNavigate is used to navigate programmatically within the application
  const navigate = useNavigate();

  // useEffect to fetch report data when the component mounts
  useEffect(() => {
    // Function to fetch report data from the vacations service
    const fetchReportData = async () => {
      try {
        // Fetch the vacation likes report from the API
        const data = await vacationsService.getVacationLikesReport();

        // Update the state with the fetched data
        setReportData(data);
      } catch (err) {
        // Log an error if the fetch fails
        console.error("Failed to fetch vacation report:", err);
      }
    };

    // Call the fetch function to retrieve report data
    fetchReportData();
  }, []); // Dependency array is empty, so this effect runs once when the component mounts

  // Prepare the data for the chart
  // 'labels' contains the destination names, and 'data' contains the number of likes for each vacation

  const chartData = {
    labels: reportData.map((vacation) => vacation.destination), // Extract destination names as labels
    datasets: [
      {
        label: "Number of Likes", // Label for the dataset

        data: reportData.map((vacation) => vacation.likesCount), // Extract likes count for each destination

        backgroundColor: "rgb(13, 110, 253)", // Set the color for the bars in the chart
      },
    ],
  };

  // Options to configure the appearance and behavior of the chart
  const chartOptions = {
    responsive: true, // Make the chart responsive to different screen sizes

    plugins: {
      legend: {
        display: true, // Display the legend on the chart

        position: "top" as const, // Position the legend at the top of the chart
      },
      title: {
        display: true, // Display the title on the chart

        text: "Vacation Likes Report", // Title text for the chart
      },
    },
  };

  const handleDownloadCSV = () => {
    // Step 1: Create the CSV content with headers and report data
    const csvContent = [
      ["Destination", "Likes"], // Column headers
      ...reportData.map((vacation) => [
        vacation.destination,
        vacation.likesCount,
      ]), // Map through the report data.
    ]
      .map((row) => row.join(",")) // Join each row with a comma
      .join("\n"); // Join rows with a new line

    // Step 2: Add BOM (Byte Order Mark) to ensure UTF-8 encoding with Excel
    const bom = "\uFEFF"; // BOM for UTF-8

    // Step 3: Create a Blob with BOM + CSV content
    const blob = new Blob([bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    // Step 4: Use file-saver's 'saveAs' function to trigger the download
    saveAs(blob, "vacation-likes-report.csv");
  };

  const handleBackToVacations = () => {
    navigate("/vacations");
  };

  return (
    <div className="VacationReport">
      <button className="btn-back" onClick={handleBackToVacations}>
        ◀ Back to Vacations
      </button>

      <button className="btn-download" onClick={handleDownloadCSV}>
        Export CSV ▼
      </button>

      <h2>Vacations Report</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}
