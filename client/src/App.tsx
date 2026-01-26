/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/react-router";
import { uploadMedicalReport } from "./features/upload/upload.service";
import { AnalysisDisplay } from "./features/upload/components/AnalysisDisplay";
import { HistoryDashboard } from "./features/upload/components/HistoryDashboard";
import { LayoutDashboard, PlusCircle } from "lucide-react";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [view, setView] = useState<"upload" | "history">("upload");
  const { getToken } = useAuth();

  const handleProcess = async () => {
    if (!file) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const data = await uploadMedicalReport(file, getToken);
      setAnalysis(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden font-sans">
      <div className="max-w-5xl w-full mx-auto px-4 py-6 flex flex-col h-full">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 flex-shrink-0">
          <h1 className="text-2xl font-semibold text-slate-900">
            MediSync <span className="text-blue-600">AI</span>
          </h1>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </header>

        <SignedIn>
          {/* Navigacija */}
          <div className="flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm w-fit mx-auto mb-6 flex-shrink-0">
            <button
              onClick={() => {
                setView("upload");
                setAnalysis(null);
              }}
              className={`px-6 py-2 rounded-xl font-medium transition ${
                view === "upload"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <PlusCircle size={16} className="inline mr-2" />
              Novi nalaz
            </button>

            <button
              onClick={() => setView("history")}
              className={`px-6 py-2 rounded-xl font-medium transition ${
                view === "history"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <LayoutDashboard size={16} className="inline mr-2" />
              Istorija
            </button>
          </div>

          <main className="flex-grow overflow-y-auto scrollbar-hide md:scrollbar-default max-w-3xl mx-auto w-full px-1">
            <div className="pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {view === "upload" ? (
                <div className="w-full">
                  {!analysis && !loading && (
                    <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm text-center">
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="mx-auto mb-6"
                      />
                      <button
                        onClick={handleProcess}
                        disabled={!file}
                        className="bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-slate-300"
                      >
                        Započni analizu
                      </button>
                    </div>
                  )}

                  {loading && (
                    <div className="py-20 text-center text-slate-600">
                      <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                      <p>AI analizira nalaz...</p>
                    </div>
                  )}

                  {analysis && <AnalysisDisplay data={analysis} />}
                </div>
              ) : (
                <div className="w-full">
                  <HistoryDashboard
                    onSelectRecord={(record) => {
                      setAnalysis(record);
                      setView("upload");
                    }}
                  />
                </div>
              )}
            </div>
          </main>
        </SignedIn>

        <SignedOut>
          <main className="flex-grow overflow-y-auto">
            <section className="relative w-full py-20 bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-3xl overflow-hidden text-center px-6">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Razumite svoje nalaze <br />
                <span className="text-blue-600">na jednostavan način.</span>
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mt-6">
                MediSync koristi veštačku inteligenciju da Vam objasni
                laboratorijske rezultate bez komplikovanih reči.
              </p>
              <div className="pt-10">
                <SignInButton mode="modal">
                  <button className="bg-blue-600 text-white px-14 py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-700 transition-all">
                    Započni besplatno
                  </button>
                </SignInButton>
              </div>
            </section>
          </main>
        </SignedOut>

        <footer className="py-4 text-center text-xs text-slate-400 flex-shrink-0">
          © 2026 MediSync AI
        </footer>
      </div>
    </div>
  );
}

export default App;
