import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Info } from 'lucide-react';

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
    results: AnalysisResult[];
  };
}

export const AnalysisDisplay = ({ data }: Props) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Glavni rezime nalaza */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 mt-1 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-blue-900 text-lg mb-2">Rezime vašeg zdravlja</h3>
            <p className="text-blue-800 leading-relaxed text-lg">
              {data.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Lista parametara */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-4 border-b bg-slate-50">
          <h4 className="font-bold text-slate-700">Detaljni rezultati analize</h4>
          <p className="text-sm text-slate-500">Kliknite na bilo koji red za više detalja i savete.</p>
        </div>

        <div className="divide-y divide-slate-100">
          {data.results.map((res, idx) => {
            const isExpanded = expandedIndex === idx;
            const isIssue = res.status !== 'normal';

            return (
              <div key={idx} className="transition-all hover:bg-slate-50/50">
                {/* Header reda */}
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      res.status === 'normal' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {res.status === 'normal' ? 
                        <CheckCircle2 size={20} className="text-green-600" /> : 
                        <AlertCircle size={20} className="text-red-600" />
                      }
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-lg">{res.abbreviation}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                          res.status === 'high' ? 'bg-red-100 text-red-700' :
                          res.status === 'low' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {res.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 truncate max-w-[200px] md:max-w-md">
                        {res.parameter}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-lg">{res.value} {res.unit}</p>
                      <p className="text-xs text-slate-400">Ref: {res.referenceRange}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                  </div>
                </button>

                {/* Objasnjena i saveti*/}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
                      <div>
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Šta ovo znači?</h5>
                        <p className="text-slate-700 leading-relaxed">
                          <span className="font-semibold">{res.parameter} ({res.abbreviation}):</span> {res.description}
                        </p>
                      </div>

                      <div className={`p-4 rounded-lg border-l-4 ${
                        isIssue ? 'bg-amber-50 border-amber-400' : 'bg-green-50 border-green-400'
                      }`}>
                        <h5 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                          💡 Preporuka za vas:
                        </h5>
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

      {/* Napomena o odricanju odgovornosti */}
      <div className="p-4 bg-gray-100 rounded-lg text-center text-xs text-gray-500 leading-tight">
        <p>
          <strong>VAŽNA NAPOMENA:</strong> Ovi podaci su generisani pomoću veštačke inteligencije (GPT-4o) i služe isključivo u informativne svrhe. 
          Ovo nije zamena za profesionalni lekarski savet, dijagnozu ili lečenje. 
          Uvek se konsultujte sa svojim lekarom pre donošenja bilo kakvih odluka o vašem zdravlju.
        </p>
      </div>
    </div>
  );
};