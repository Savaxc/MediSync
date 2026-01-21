import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Info,
  Download
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReportPDF } from './ReportPDF';

interface AnalysisResult {
  parameter: string;
  abbreviation: string;
  description: string;
  value: number;
  unit: string;
  status: 'normal' | 'high' | 'low';
  referenceRange: string;
  advice: string;
}

interface Props {
  data: {
    summary: string;
    fullAnalysis: AnalysisResult[];
  };
}

export const AnalysisDisplay = ({ data }: Props) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const currentDate = new Date().toLocaleDateString('sr-RS');

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="mt-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Dugme za PDF preuzimanje */}
      <div className="flex justify-end">
        <PDFDownloadLink
          document={<ReportPDF data={data} date={currentDate} />}
          fileName={`MediSync_Izvestaj_${currentDate}.pdf`}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-all text-sm font-bold shadow-sm"
        >
          {({ loading }) => (
            <>
              <Download size={18} />
              {loading ? 'Priprema PDF-a...' : 'Preuzmi PDF'}
            </>
          )}
        </PDFDownloadLink>
      </div>

      {/* Rezime */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-start gap-4">
          <Info className="text-blue-600 mt-1" size={22} />
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Rezime vašeg zdravlja
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {data.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Lista parametara */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50">
          <h4 className="font-semibold text-slate-800">
            Detaljni rezultati
          </h4>
          <p className="text-sm text-slate-500">
            Kliknite na parametar za objašnjenje i preporuku.
          </p>
        </div>

        <div className="divide-y">
          {data.fullAnalysis.map((res, idx) => {
            const isExpanded = expandedIndex === idx;
            const isIssue = res.status !== 'normal';

            return (
              <div key={idx}>
                <button
                  onClick={() => toggleAccordion(idx)}
                  aria-expanded={isExpanded}
                  className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-slate-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-xl ${
                        isIssue ? 'bg-red-50' : 'bg-green-50'
                      }`}
                    >
                      {isIssue ? (
                        <AlertCircle className="text-red-600" size={20} />
                      ) : (
                        <CheckCircle2 className="text-green-600" size={20} />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-slate-900">
                          {res.abbreviation}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            res.status === 'high'
                              ? 'bg-red-50 text-red-600'
                              : res.status === 'low'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-green-50 text-green-600'
                          }`}
                        >
                          {res.status === 'normal' ? 'normalno' : res.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 max-w-md truncate">
                        {res.parameter}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {res.value} {res.unit}
                      </p>
                      <p className="text-xs text-slate-400">
                        Ref: {res.referenceRange}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="text-slate-400" />
                    ) : (
                      <ChevronDown className="text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-5">
                      <div>
                        <h5 className="text-xs uppercase font-semibold text-slate-400 mb-1">
                          Značenje
                        </h5>
                        <p className="text-slate-700">
                          <strong>{res.parameter}:</strong> {res.description}
                        </p>
                      </div>

                      <div
                        className={`rounded-xl p-4 border ${
                          isIssue
                            ? 'bg-amber-50 border-amber-300'
                            : 'bg-green-50 border-green-300'
                        }`}
                      >
                        <p className="font-semibold text-slate-800 mb-1">
                          💡 Preporuka
                        </p>
                        <p className="text-slate-700 italic">
                          {res.advice}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-slate-400 text-center leading-relaxed max-w-3xl mx-auto">
        <strong>VAŽNA NAPOMENA:</strong> Ovi podaci su generisani pomoću
          veštačke inteligencije (GPT-4o) i služe isključivo u informativne
          svrhe. Ovo nije zamena za profesionalni lekarski savet, dijagnozu ili
          lečenje. Uvek se konsultujte sa svojim lekarom pre donošenja bilo
          kakvih odluka o vašem zdravlju.
      </div>
    </div>
  );
};