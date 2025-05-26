import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format, startOfWeek, endOfWeek } from "date-fns";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsProps {
  appointments: Array<{
    id: number;
    time: string;
    patient: string;
    type: string;
    status: string;
  }>;
}

export const Analytics = ({ appointments }: AnalyticsProps) => {
  // Calculate appointments by status
  const statusData = appointments.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate appointments by type
  const typeData = appointments.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate weekly trends
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const weeklyData = appointments
    .filter(app => {
      const appDate = new Date(app.time);
      return appDate >= weekStart && appDate <= weekEnd;
    })
    .reduce((acc, curr) => {
      const day = format(new Date(curr.time), "EEEE");
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Pie
            data={{
              labels: Object.keys(statusData),
              datasets: [
                {
                  data: Object.values(statusData),
                  backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar
            data={{
              labels: Object.keys(typeData),
              datasets: [
                {
                  label: "Number of Appointments",
                  data: Object.values(typeData),
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Appointment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Line
            data={{
              labels: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              datasets: [
                {
                  label: "Appointments",
                  data: [
                    weeklyData["Monday"] || 0,
                    weeklyData["Tuesday"] || 0,
                    weeklyData["Wednesday"] || 0,
                    weeklyData["Thursday"] || 0,
                    weeklyData["Friday"] || 0,
                    weeklyData["Saturday"] || 0,
                    weeklyData["Sunday"] || 0,
                  ],
                  borderColor: "rgb(75, 192, 192)",
                  tension: 0.1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};
