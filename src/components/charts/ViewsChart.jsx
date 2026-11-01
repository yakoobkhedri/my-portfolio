import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useTheme } from "../../context/ThemeContext";

const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#06b6d4", "#10b981"];

const ViewsChart = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        No view data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb"} />
        <XAxis type="number" stroke={isDark ? "#9ca3af" : "#6b7280"} />
        <YAxis
          dataKey="name"
          type="category"
          stroke={isDark ? "#9ca3af" : "#6b7280"}
          width={100}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1e1b4b" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb"}`,
            borderRadius: "8px",
            color: isDark ? "#fff" : "#1f2937",
          }}
        />
        <Bar dataKey="views" fill="#10b981" radius={[0, 8, 8, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ViewsChart;