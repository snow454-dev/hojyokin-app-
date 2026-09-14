import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { QuickInputForm } from './components/QuickInputForm';
import { PlanViewer } from './components/PlanViewer';
import { UserProfileInput, BusinessPlanResult } from './types';
import { requestBusinessPlan } from './services/geminiService';
import { AlertCircle, X } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [planResult, setPlanResult] = useState<BusinessPlanResult | null>(null);
  const [, setLastInput] = useState<UserProfileInput | null>(null);

  const handleGeneratePlan = async (input: UserProfileInput) => {
    setLoading(true);
    setError(null);
    setLastInput(input);

    try {
      const plan = await requestBusinessPlan(input);
      setPlanResult(plan);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error("Plan generation error:", err);
      setError(err?.message || "事業計画書の生成中にエラーが発生しました。入力内容を確認して再試行してください。");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPlanResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdatePlan = (updated: BusinessPlanResult) => {
    setPlanResult(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout onPrint={handlePrint} hasResult={Boolean(planResult)}>
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl mb-6 flex items-start justify-between gap-3 shadow-xs animate-in fade-in no-print">
          <div className="flex items-start gap-2 text-xs sm:text-sm font-medium">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-rose-700 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {!planResult ? (
        <QuickInputForm onSubmit={handleGeneratePlan} loading={loading} />
      ) : (
        <PlanViewer
          plan={planResult}
          onReset={handleReset}
          onUpdatePlan={handleUpdatePlan}
        />
      )}
    </Layout>
  );
};

export default App;
