/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  history: any[];
  parameterToTrack: string;
}

export const HealthChart = ({ history, parameterToTrack }: Props) => {
  //Priprema podataka: prolazimo kroz istoriju i izvlacimo vrednosti za taj parametar
  const chartData = history
    .map((record) => {
      const result = record.fullAnalysis.find(
        (r: any) => r.abbreviation === parameterToTrack,
      );
      return {
        datum: new Date(record.createdAt).toLocaleDateString("sr-RS", {
          day: "2-digit",
          month: "2-digit",
        }),
        vrednost: result ? result.value : null,
      };
    })
    .filter((item) => item.vrednost !== null) 
    .reverse();

  if (chartData.length < 2) {
    return (
      <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-600 italic">
        Potrebno je bar dva nalaza sa parametrom "{parameterToTrack}" za prikaz
        grafikona trenda.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-6">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
        📈 Trend kretanja: {parameterToTrack}
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="datum"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="vrednost"
              name={parameterToTrack}
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 6, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
