/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Calendar, FileText, ChevronRight, Trash2 } from "lucide-react";
import { HealthChart } from "./HealthChart";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

export const HistoryDashboard = ({
  onSelectRecord,
}: {
  onSelectRecord: (record: any) => void;
}) => {
  const [history, setHistory] = useState<any[]>([]);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const openDeleteModal = (e: React.MouseEvent, recordId: string) => {
    e.stopPropagation();
    setRecordToDelete(recordId);
  };

  const confirmDelete = async () => {
    if (!recordToDelete) return;

    setIsDeleting(true);
    try {
      const token = await getToken();
      await axios.delete(
        `http://localhost:8080/api/medical/${recordToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setHistory((prev) => prev.filter((rec) => rec.id !== recordToDelete));
      setRecordToDelete(null);
    } catch (err) {
      console.error("Greška pri brisanju:", err);
      alert("Došlo je do greške pri brisanju.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Grafikon sekcija */}
      {history.length > 0 && (
        <section className="bg-slate-50 p-6 rounded-3xl border border-slate-200 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Pratite napredak
              </h2>
              <p className="text-sm text-slate-500">
                Izaberite parametar za vizuelni prikaz trenda
              </p>
            </div>
            <select
              onChange={(e) => setSelectedParam(e.target.value)}
              className="p-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none hover:cursor-pointer"
            >
              <option value="">Izaberi parametar...</option>
              {allParams.map((p) => (
                <option key={p as string} value={p as string}>
                  {p as string}
                </option>
              ))}
            </select>
          </div>

          {selectedParam && (
            <HealthChart history={history} parameterToTrack={selectedParam} />
          )}
        </section>
      )}

      <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
        <FileText className="text-blue-600" />
        Moji prethodni nalazi
      </h2>

      {/* Modal komponenta */}
      <DeleteConfirmModal
        isOpen={!!recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />

      {history.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-2xl text-slate-500 bg-slate-50">
          Nemate sačuvanih nalaza.
        </div>
      ) : (
        <div className="grid gap-4 w-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {" "}
          {history.map((record) => (
            <div key={record.id} className="relative group">
              <button
                onClick={() => onSelectRecord(record)}
                className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition text-left hover:cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                    <Calendar size={20} />
                  </div>
                  <div className="pr-8">
                    {" "}
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

              {/* Delete dugme */}
              <button
                onClick={(e) => openDeleteModal(e, record.id)}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors hover:cursor-pointer"
                title="Obriši nalaz"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
