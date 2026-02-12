/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
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
import {
  LayoutDashboard,
  PlusCircle,
  UploadCloud,
  Activity,
  X,
} from "lucide-react";
import { useDropzone } from "react-dropzone";

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: false,
  });

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex flex-col overflow-hidden font-sans text-slate-900">
      <div className="max-w-7xl w-full mx-auto px-6 md:px-10 py-8 flex flex-col h-full relative">
        {/* Header */}
        <header className="flex justify-between items-center mb-10 pb-6 border-b border-slate-200 flex-shrink-0">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center bg-white border border-slate-200 p-2 rounded-xl shadow-sm">
              <Activity className="text-blue-600" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                MediSync <span className="text-blue-600">AI</span>
              </h1>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mt-1">
                Smart Health Analysis
              </p>
            </div>
          </div>

          {/* User Akcije */}
          <div className="flex items-center gap-4">
            <SignedIn>
              <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden sm:block" />

              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-700 leading-none">
                    Moj Profil
                  </span>
                  <span className="text-[10px] text-green-500 font-medium">
                    Aktivan
                  </span>
                </div>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-9 h-9",
                      userButtonTrigger: "focus:outline-none focus:ring-0",
                    },
                  }}
                  afterSignOutUrl="/"
                />
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-bold text-slate-600 hover:text-blue-600 hover:cursor-pointer transition-colors">
                  Prijavi se
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </header>

        <SignedIn>
          {/* Main Navigacija */}
          <nav className="flex items-center gap-1 bg-white/70 backdrop-blur-lg border border-slate-200/70 rounded-full p-1 shadow-sm w-fit mx-auto mb-10">
            <button
              onClick={() => {
                setView("upload");
                setAnalysis(null);
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${
                    view === "upload"
                      ? "bg-blue-700 text-white shadow-sm hover:cursor-pointer"
                      : "text-slate-500 hover:text-slate-900 hover:bg-blue-200 hover:cursor-pointer"
                  }
                `}
            >
              <PlusCircle size={16} />
              Novi nalaz
            </button>

            <button
              onClick={() => setView("history")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${
                    view === "history"
                      ? "bg-blue-700 text-white shadow-sm hover:cursor-pointer"
                      : "text-slate-500 hover:text-slate-900 hover:bg-blue-200 hover:cursor-pointer"
                  }
                `}
            >
              <LayoutDashboard size={16} />
              Istorija
            </button>
          </nav>

          {/* Main Sadrzaj Polje */}
          <main className="flex-grow overflow-y-auto scrollbar-hide max-w-6xl mx-auto w-full px-2">
            <div className="pb-12">
              {view === "upload" ? (
                <div className="w-full space-y-6">
                  {!analysis && !loading && (
                    <div
                      {...getRootProps()}
                      className={`
              group relative bg-white border-2 border-dashed border-slate-200 p-12 rounded-[2rem] transition-all hover:border-blue-400 hover:bg-blue-50/30 text-center cursor-pointer
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-50/50 scale-[1.01] shadow-xl shadow-blue-100/50"
                  : "border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/20"
              }
            `}
                    >
                      <input {...getInputProps()} />

                      <div
                        className={`
              bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform
              ${isDragActive ? "bg-blue-600 text-white scale-110" : "bg-blue-50 text-blue-600 group-hover:scale-110"}
            `}
                      >
                        <UploadCloud size={35} />
                      </div>

                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {isDragActive
                          ? "Samo pustite fajl ovde"
                          : "Otpremite vaš nalaz"}
                      </h3>

                      <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                        Prevucite PDF ili fotografiju nalaza direktno ovde, ili
                        kliknite za pretragu.
                      </p>

                      {/* Prikaz fajla/dugmeta */}
                      <div
                        className="flex flex-col items-center justify-center gap-4 mb-8">
                        {!file ? (
                          <div className="bg-white border-2 border-slate-100 px-10 py-4 rounded-2xl font-bold text-slate-700 shadow-sm group-hover:border-blue-200 transition-all text-lg">
                            Odaberi dokument
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 bg-blue-50/50 border border-blue-100 pl-4 pr-2 py-2 rounded-xl animate-in fade-in zoom-in-95">
                            <span className="text-sm font-semibold text-blue-700 max-w-[700px] truncate">
                              {file.name}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFile(null);
                              }}
                              className="p-1 hover:bg-blue-100 rounded-lg text-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
                              title="Ukloni fajl"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Dugme za akciju */}
                      {file && (
                        <div
                          className="mt-10 pt-8 border-t border-slate-100 w-full flex justify-center animate-in slide-in-from-top-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={handleProcess}
                            disabled={!file}
                            className="w-full max-w-md bg-slate-900 text-white px-12 py-4 rounded-[2rem] font-black text-lg hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 active:scale-95 cursor-pointer"
                          >
                            Započni AI analizu
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {loading && (
                    <div className="py-24 text-center">
                      <div className="relative w-20 h-20 mx-auto mb-8">
                        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 animate-pulse">
                        Analiziramo vaše podatke...
                      </h3>
                      <p className="text-slate-500 mt-2">
                        Ovo obično traje par sekundi.
                      </p>
                    </div>
                  )}
                  {analysis && <AnalysisDisplay data={analysis} />}
                </div>
              ) : (
                <HistoryDashboard
                  onSelectRecord={(record) => {
                    setAnalysis(record);
                    setView("upload");
                  }}
                />
              )}
            </div>
          </main>
        </SignedIn>

        <SignedOut>
          <main className="flex-grow flex items-center justify-center">
            <section className="w-full max-w-6xl py-24 bg-white border border-slate-200 rounded-[4rem] shadow-2xl shadow-slate-200/60 text-center px-10 relative overflow-hidden transition-all hover:shadow-blue-100/50">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

              <div className="relative">
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8">
                  Razumite svoje nalaze <br />
                  <span className="text-5xl text-blue-600">
                    na jednostavan način.
                  </span>
                </h2>
                <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto mb-12">
                  MediSync koristi naprednu veštačku inteligenciju da pretvori
                  vaše laboratorijske rezultate u jasne i korisne informacije.
                </p>

                <SignInButton mode="modal">
                  <button className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:cursor-pointer transition-all active:scale-95">
                    Započni besplatno
                  </button>
                </SignInButton>
              </div>
            </section>
          </main>
        </SignedOut>

        <footer className="text-center flex-shrink-0">
          <div className="flex justify-center gap-6 mb-4"></div>
          <p className="text-xs font-medium text-slate-400 tracking-widest uppercase">
            © 2026 MediSync AI • Vaša privatnost je prioritet
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;