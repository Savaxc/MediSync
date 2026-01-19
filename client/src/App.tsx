/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/react-router';
import { uploadMedicalReport } from './features/upload/upload.service';
import { AnalysisDisplay } from './features/upload/components/AnalysisDisplay';
import './App.css';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleProcess = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const data = await uploadMedicalReport(file);
      setAnalysis(data);
    } catch (err) {
      alert("Došlo je do greške pri analizi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen font-sans">
      <header className="flex justify-between items-center py-6 border-b mb-8">
        <h1 className="text-2xl font-bold text-blue-600">MediSync AI</h1>
        <div>
          <SignedOut>
            <SignInButton fallbackRedirectUrl="/" />
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      <main>
        <SignedIn>
          <div className="bg-slate-50 p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center">
            <h2 className="text-xl font-semibold mb-4">Pošalji laboratorijski nalaz</h2>
            <input type="file" onChange={onFileChange} className="block mx-auto mb-4" />
            <button 
              onClick={handleProcess}
              disabled={!file || loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-all"
            >
              {loading ? 'AI analizira...' : 'Započni analizu'}
            </button>
          </div>

          {loading && (
            <div className="text-center mt-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-500">Molim sačekaj, AI očitava tvoj nalaz...</p>
            </div>
          )}

          {analysis && <AnalysisDisplay data={analysis} />}
        </SignedIn>

        <SignedOut>
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">Vaš digitalni zdravstveni asistent</h2>
            <p className="text-gray-600 mb-8">Prijavite se kako biste dobili jasna objašnjenja svojih medicinskih rezultata.</p>
            <SignInButton mode="modal">
               <button className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg">Započni besplatno</button>
            </SignInButton>
          </div>
        </SignedOut>
      </main>
    </div>
  );
}

export default App;