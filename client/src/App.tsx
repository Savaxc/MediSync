/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/react-router';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8080/api/medical/upload', formData);
      setAnalysis(response.data);
    } catch (error) {
      console.error("Greška pri slanju:", error);
      alert("Došlo je do greške prilikom analize nalaza.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="main-header">
        <h1>MediSync AI</h1>
        <div className="auth-zone">
          <SignedOut>
            <SignInButton fallbackRedirectUrl="/" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <main className="content">
        <SignedIn>
          <div className="upload-card">
            <h2>Zdravo! Ubaci sliku svog nalaza</h2>
            <p>AI će ti objasniti rezultate prostim rečima.</p>
            
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
              className="file-input"
            />
            
            <button 
              onClick={handleUpload} 
              disabled={!file || loading}
              className="upload-button"
            >
              {loading ? 'Analiziram...' : 'Započni analizu'}
            </button>
          </div>

          {analysis && (
            <div className="results-card">
              <h3>Rezime:</h3>
              <p className="summary-text">{analysis.summary}</p>
              
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Parametar</th>
                    <th>Vrednost</th>
                    <th>Referentni opseg</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.results.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td>{item.parameter}</td>
                      <td>{item.value} {item.unit}</td>
                      <td>{item.referenceRange}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SignedIn>

        <SignedOut>
          <div className="hero">
            <h2>Vaš lični asistent za laboratorijske nalaze</h2>
            <p>Prijavite se da biste digitalizovali svoje zdravstvene podatke.</p>
          </div>
        </SignedOut>
      </main>
    </div>
  );
}

export default App;