import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "../../context/ThemeContext";

const ActivityChart = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb"} />
        <XAxis dataKey="date" stroke={isDark ? "#9ca3af" : "#6b7280"} />
        <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1e1b4b" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb"}`,
            borderRadius: "8px",
            color: isDark ? "#fff" : "#1f2937",
          }}
        />
        <Legend wrapperStyle={{ color: isDark ? "#fff" : "#1f2937" }} />
        <Line type="monotone" dataKey="messages" stroke="#06b6d4" strokeWidth={2} name="Messages" />
        <Line type="monotone" dataKey="comments" stroke="#ec4899" strokeWidth={2} name="Comments" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ActivityChart;