import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { todayPeru } from "../../utils/date.js";
import "./graph.css";

const RANGES = [
  { key: "month", label: "Mes actual" },
  { key: "30d", label: "30D" },
  { key: "1y", label: "1A" },
  { key: "4y", label: "4A" },
];

const TITLES = {
  month: "Ventas del mes actual",
  "30d": "Últimos 30 días",
  "1y": "Último año",
  "4y": "Últimos 4 años",
};

const num = (value) => Number(value || 0);
const money = (value) => `S/. ${num(value).toFixed(2)}`;
const dayLabel = (value) => {
  const raw = String(value || "").slice(0, 10);
  const [year, month, day] = raw.split("-");
  return year && month && day ? `${day}/${month}` : raw;
};
const axisValue = (value) => {
  const n = num(value);
  if (Math.abs(n) >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (Math.abs(n) >= 1000) return `${Math.round(n / 1000)}k`;
  return n;
};

export function SalesChart({ urlBase }) {
  const [range, setRange] = useState("month");
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      let rows = [];

      if (range === "month") {
        const [year, month] = todayPeru().split("-");
        const { data } = await axios.get(
          `${urlBase}/api/v1/summaries/summaryByDay?year=${year}&month=${month}`
        );
        rows = (Array.isArray(data) ? data : []).map((row) => ({
          date: String(row.dia).slice(0, 10),
          label: dayLabel(row.dia),
          ventas: num(row.total_ventas),
          ganancia: num(row.ganancia),
        }));
      } else {
        const { data } = await axios.get(
          `${urlBase}/api/v1/summaries/salesRange?range=${range}`
        );
        rows = (Array.isArray(data) ? data : []).map((row) => ({
          date: row.date,
          label: row.label,
          ventas: num(row.ventas),
          ganancia: num(row.ganancia),
        }));
      }

      setSalesData(rows);
    } catch (error) {
      console.error("Error al cargar los datos de ventas:", error);
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  }, [urlBase, range]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const totalVentas = salesData.reduce((acc, row) => acc + num(row.ventas), 0);
  const totalGanancia = salesData.reduce((acc, row) => acc + num(row.ganancia), 0);

  return (
    <div style={{ width: "100%", height: 350, backgroundColor: "var(--card-bg)", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
      <div className="sales_chart_header">
        <h3>{TITLES[range]}</h3>
        <div className="chart_ranges">
          {RANGES.map((item) => (
            <button
              key={item.key}
              type="button"
              className={range === item.key ? "active" : ""}
              onClick={() => setRange(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="sales_chart_totals">
          Ventas {money(totalVentas)} · Ganancia {money(totalGanancia)}
        </p>
      </div>

      {loading ? (
        <div style={{ height: "78%" }} className="chart_state">Cargando...</div>
      ) : salesData.length === 0 ? (
        <div style={{ height: "78%" }} className="chart_state">Sin ventas en este periodo</div>
      ) : (
        <ResponsiveContainer width="100%" height="78%">
          <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2962FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2962FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorGanancia" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--chart-text)" }}
              interval="preserveStartEnd"
              minTickGap={18}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--chart-text)" }}
              tickFormatter={axisValue}
              width={55}
            />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid var(--chart-grid)", backgroundColor: "var(--card-bg)", color: "var(--card-text)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              labelFormatter={(value) => value}
              formatter={(value, name) => [money(value), name]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="ventas"
              name="Ventas"
              stroke="#2962FF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorVentas)"
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="ganancia"
              name="Ganancia"
              stroke="#16a34a"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGanancia)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
