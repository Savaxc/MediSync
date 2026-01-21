/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Calendar, FileText, ChevronRight } from "lucide-react";
import { HealthChart } from "./HealthChart";

export const HistoryDashboard = ({
  onSelectRecord,
}: {
  onSelectRecord: (record: any) => void;
}) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParam, setSelectedParam] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          "http://localhost:8080/api/medical/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [getToken]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        Učitavam istoriju nalaza...
      </div>
    );
  }

  const allParams = Array.from(
    new Set(
      history.flatMap((rec: any) =>
        rec.fullAnalysis.map((res: any) => res.abbreviation),
      ),
    ),
  );

  return (
    <div className="mt-12 space-y-6">
      {/* Grafikon sekcija */}
      {history.length > 0 && (
        <section className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Pratite napredak</h2>
              <p className="text-sm text-slate-500">Izaberite parametar za vizuelni prikaz trenda</p>
            </div>
            <select 
              onChange={(e) => setSelectedParam(e.target.value)}
              className="p-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Izaberi parametar...</option>
              {allParams.map(p => <option key={p as string} value={p as string}>{p as string}</option>)}
            </select>
          </div>

          {selectedParam && <HealthChart history={history} parameterToTrack={selectedParam} />}
        </section>
      )}


      <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
        <FileText className="text-blue-600" />
        Moji prethodni nalazi
      </h2>

      {history.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-2xl text-slate-500 bg-slate-50">
          Nemate sačuvanih nalaza.
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((record) => (
            <button
              key={record.id}
              onClick={() => onSelectRecord(record)}
              className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition text-left focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    Nalaz od{" "}
                    {new Date(record.createdAt).toLocaleDateString("sr-RS")}
                  </p>
                  <p className="text-sm text-slate-500 max-w-xs truncate">
                    {record.summary}
                  </p>
                </div>
              </div>
              <ChevronRight className="text-slate-300" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
