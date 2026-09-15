import React, { useState } from 'react';
import { BusinessPlanResult, QuantitativeMetric } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ProductivitySimulator } from './ProductivitySimulator';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Edit3, 
  RotateCcw, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  Briefcase, 
  Bot, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface Props {
  plan: BusinessPlanResult;
  onReset: () => void;
  onUpdatePlan: (updated: BusinessPlanResult) => void;
}

export const PlanViewer: React.FC<Props> = ({ plan, onReset, onUpdatePlan }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'simulator' | 'checklist'>('preview');
  const [copied, setCopied] = useState<boolean>(false);

  // Editable states
  const [editableSection1, setEditableSection1] = useState(plan.section1_ManagementChallenges);
  const [editableSection2, setEditableSection2] = useState(plan.section2_AiImplementationAndSteps);
  const [editableSection3, setEditableSection3] = useState(plan.section3_QualitativeEffectsAndShift);
  const [editableExplanation, setEditableExplanation] = useState(plan.section4_QuantitativeSimulation.explanation);
  const [editableBasis, setEditableBasis] = useState(plan.section4_QuantitativeSimulation.calculationBasis);
  const [metrics, setMetrics] = useState<QuantitativeMetric[]>(plan.section4_QuantitativeSimulation.metricsTable);
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(plan.fullMarkdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([plan.fullMarkdownText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `事業計画書_${plan.overview.industry}_${plan.overview.location.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, "")}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveChanges = () => {
    const updatedPlan: BusinessPlanResult = {
      ...plan,
      section1_ManagementChallenges: editableSection1,
      section2_AiImplementationAndSteps: editableSection2,
      section3_QualitativeEffectsAndShift: editableSection3,
      section4_QuantitativeSimulation: {
        ...plan.section4_QuantitativeSimulation,
        explanation: editableExplanation,
        calculationBasis: editableBasis,
        metricsTable: metrics
      },
      fullMarkdownText: `# ${plan.title}

---

## 1. 企業が直面する経営課題（北海道・業界特性の文脈を反映）
${editableSection1}

---

## 2. 生成AIツールの導入目的と具体的活用方法
${editableSection2}

---

## 3. 生産性向上による効果（定性的メリット）
${editableSection3}

---

## 4. 労働生産性向上の数値目標シミュレーション（定量的メリット）
${editableExplanation}

**【算出根拠】**
${editableBasis}

| 対象年度 | 労働生産性（付加価値額） | 伸び率（基準年度比） | 年間削減時間 | 創出見込み価値 |
| :--- | :--- | :--- | :--- | :--- |
${metrics.map(m => `| ${m.year} | ${m.laborProductivity} | **${m.productivityGrowthRate}** | ${m.annualHoursSaved} | ${m.estimatedValueCreated} |`).join('\n')}

---

## 5. 北海道内の経営者への次のアクション（gBizID・専門家連携の案内）
### ■ gBizIDプライム取得の案内
${plan.section5_NextActionsAndGuidance.gBizIdNotice}

### ■ 道内専門家（行政書士・中小企業診断士）への最終チェック案内
${plan.section5_NextActionsAndGuidance.specialistConsultationNotice}

### ■ 具体的な申請ステップ
${plan.section5_NextActionsAndGuidance.actionSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}
`
    };

    onUpdatePlan(updatedPlan);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
    setActiveTab('preview');
  };

  const handleApplySimulatorMetrics = (newMetrics: QuantitativeMetric[], basis: string) => {
    setMetrics(newMetrics);
    setEditableBasis(basis);
    // Update plan directly
    const updatedPlan: BusinessPlanResult = {
      ...plan,
      section4_QuantitativeSimulation: {
        ...plan.section4_QuantitativeSimulation,
        calculationBasis: basis,
        metricsTable: newMetrics
      }
    };
    onUpdatePlan(updatedPlan);
    setActiveTab('preview');
  };

  return (
    <div className="space-y-6">
      {/* Control Top Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            条件を変更して再入力
          </button>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            補助金診断・ドラフト生成完了
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'コピーしました！' : '全文コピー'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Markdown保存</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>A4印刷 / PDF保存</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 no-print gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'preview'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>事業計画書（完成プレビュー）</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('edit')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'edit'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>セクション別・加筆編集モード</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulator')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'simulator'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>労働生産性シミュレーター（数値微調整）</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('checklist')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'checklist'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>申請ステップ & gBizID案内</span>
        </button>
      </div>

      {isSavedNotice && (
        <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          加筆内容を計画書本文に保存しました。
        </div>
      )}

      {/* TAB 1: Preview Mode */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm no-print">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-bold text-blue-700">北海道向け 3制度簡易診断</p>
                <h2 className="text-lg font-bold text-slate-950">最有力候補：{plan.recommendedSubsidy}</h2>
              </div>
              <span className="text-[11px] text-slate-500">入力内容に基づく目安</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {plan.subsidyMatches?.map((match, index) => (
                <div key={match.name} className={`rounded-xl border p-4 ${index === 0 ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{match.name}</h3>
                    <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${match.status === '有力候補' ? 'bg-emerald-100 text-emerald-800' : match.status === '確認が必要' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>{match.status}</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${match.score}%` }} /></div>
                  <p className="mt-2 text-xs text-slate-700 leading-relaxed">適合度 {match.score}% — {match.reason}</p>
                  <p className="mt-3 text-[11px] font-bold text-slate-600">確認すること</p>
                  <ul className="mt-1 text-[11px] text-slate-600 space-y-1 list-disc pl-4">{match.checks.map(check => <li key={check}>{check}</li>)}</ul>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-slate-500">{plan.diagnosisNotice}</p>
          </div>
          {/* Header Summary Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200">
                <Briefcase className="w-3.5 h-3.5" />
                {plan.overview.industry}
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {plan.overview.location}
              </span>
              <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded border border-indigo-200">
                <Bot className="w-3.5 h-3.5" />
                {plan.overview.aiTool.split('（')[0]}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight mb-2">
              {plan.title}
            </h2>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>推奨補助金枠: <strong className="text-slate-800">{plan.recommendedSubsidy}</strong></span>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                {plan.section4_QuantitativeSimulation.targetMetBadge}
              </span>
            </div>
          </div>

          {/* Document Body Card (Print-optimized) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 shadow-sm print:border-none print:shadow-none print:p-0 space-y-10 text-slate-800">
            {/* Section 1 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-600">
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">第 1 項</span>
                <h3 className="text-lg font-bold text-slate-900">
                  企業が直面する経営課題（北海道・業界特性の文脈を反映）
                </h3>
              </div>
              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700">
                <MarkdownRenderer content={plan.section1_ManagementChallenges} />
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-600">
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">第 2 項</span>
                <h3 className="text-lg font-bold text-slate-900">
                  生成AIツールの導入目的と具体的活用方法
                </h3>
              </div>
              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700">
                <MarkdownRenderer content={plan.section2_AiImplementationAndSteps} />
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-600">
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">第 3 項</span>
                <h3 className="text-lg font-bold text-slate-900">
                  生産性向上による効果（定性的メリット）
                </h3>
              </div>
              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700">
                <MarkdownRenderer content={plan.section3_QualitativeEffectsAndShift} />
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-600">
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">第 4 項</span>
                <h3 className="text-lg font-bold text-slate-900">
                  労働生産性向上の数値目標シミュレーション（定量的メリット）
                </h3>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {plan.section4_QuantitativeSimulation.explanation}
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
                <strong className="text-slate-900 block mb-1">【算出根拠】</strong>
                {plan.section4_QuantitativeSimulation.calculationBasis}
              </div>

              {/* Simulation Metrics Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                  <thead className="bg-slate-100 font-bold text-slate-800">
                    <tr>
                      <th className="py-3 px-4">対象年度</th>
                      <th className="py-3 px-4">労働生産性（付加価値額）</th>
                      <th className="py-3 px-4">伸び率（基準年度比）</th>
                      <th className="py-3 px-4">年間削減時間</th>
                      <th className="py-3 px-4">創出見込み価値</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {metrics.map((row, idx) => (
                      <tr key={idx} className={idx === 3 ? 'bg-blue-50/70 font-semibold text-blue-950' : ''}>
                        <td className="py-3 px-4">{row.year}</td>
                        <td className="py-3 px-4">{row.laborProductivity}</td>
                        <td className="py-3 px-4 text-blue-700 font-bold">{row.productivityGrowthRate}</td>
                        <td className="py-3 px-4">{row.annualHoursSaved}</td>
                        <td className="py-3 px-4 text-emerald-700 font-medium">{row.estimatedValueCreated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3 text-xs text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5">申請用の数値目標案を作成しました</strong>
                  入力値から試算した参考値です。実際の申請では、最新の公募要領・決算数値・対象経費と照合し、根拠資料を整えてください。
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-indigo-600">
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">第 5 項</span>
                <h3 className="text-lg font-bold text-slate-900">
                  北海道内の経営者への次のアクション（gBizID・専門家連携の案内）
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* gBizID Card */}
                <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl text-xs space-y-2 text-amber-950">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    【最優先】gBizIDプライムの事前取得
                  </div>
                  <p className="leading-relaxed">
                    {plan.section5_NextActionsAndGuidance.gBizIdNotice}
                  </p>
                  <a
                    href="https://gbiz-id.go.jp/top/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-700 hover:underline font-bold pt-1"
                  >
                    <span>gBizID 公式サイト（電子申請）</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Specialist Consultation Card */}
                <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl text-xs space-y-2 text-blue-950">
                  <div className="font-bold flex items-center gap-1.5 text-blue-900">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    道内の提携行政書士・中小企業診断士への最終チェック
                  </div>
                  <p className="leading-relaxed">
                    {plan.section5_NextActionsAndGuidance.specialistConsultationNotice}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    ※道内各地域（札幌・十勝・旭川・釧路・函館等）の商工会議所やよろず支援拠点でも無料相談を受け付けています。
                  </p>
                </div>
              </div>

              {/* Action Step Checklist */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 mb-2">今後の申請実行ステップ</h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {plan.section5_NextActionsAndGuidance.actionSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* TAB 2: Inline Edit Mode */}
      {activeTab === 'edit' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">セクション別・加筆編集</h3>
              <p className="text-xs text-slate-500">自社の具体的な社名や独自製品名、数値などを追記できます</p>
            </div>
            <button
              type="button"
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm"
            >
              変更を保存して反映する
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                第1項：企業が直面する経営課題（北海道・業界特性の文脈）
              </label>
              <textarea
                rows={6}
                value={editableSection1}
                onChange={(e) => setEditableSection1(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg text-xs leading-relaxed font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                第2項：生成AIツールの導入目的と具体的活用方法
              </label>
              <textarea
                rows={6}
                value={editableSection2}
                onChange={(e) => setEditableSection2(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg text-xs leading-relaxed font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                第3項：生産性向上による効果（定性的メリット・本業シフト）
              </label>
              <textarea
                rows={6}
                value={editableSection3}
                onChange={(e) => setEditableSection3(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg text-xs leading-relaxed font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                第4項：労働生産性数値シミュレーション（説明文と根拠）
              </label>
              <textarea
                rows={3}
                value={editableExplanation}
                onChange={(e) => setEditableExplanation(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg text-xs leading-relaxed font-mono mb-2"
              />
              <textarea
                rows={2}
                value={editableBasis}
                onChange={(e) => setEditableBasis(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg text-xs leading-relaxed font-mono"
                placeholder="算出根拠のテキスト"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleSaveChanges}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm"
            >
              変更を保存して本文プレビューに戻る
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Simulator Tab */}
      {activeTab === 'simulator' && (
        <ProductivitySimulator
          initialEmployees={parseInt(plan.overview.challengeSummary.match(/[0-9]+/)?.[0] || "5", 10) || 5}
          initialHoursSaved={15}
          initialHourlyRate={2200}
          onApplyMetrics={handleApplySimulatorMetrics}
        />
      )}

      {/* TAB 4: Checklist Tab */}
      {activeTab === 'checklist' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-base">申請準備チェックリスト ＆ 道内経営者向けアクションガイド</h3>
            <p className="text-xs text-slate-500">公募締切に余裕を持って間に合わせるためのスケジュール管理シートです</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs">
              <h4 className="font-bold text-amber-900 text-sm mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                最重要注意点：gBizIDプライムの取得期間
              </h4>
              <p className="text-amber-800 leading-relaxed">
                補助金の電子申請システム（jGrants）へのログインには、法人印鑑証明書による実印確認を伴う「gBizIDプライム」が必要です。
                申請から手元に届くまで<strong>通常1週間〜2週間（混雑時は3週間）</strong>かかるため、公募締切間際では申請自体ができなくなります。今日直ちにオンライン申請書を作成し郵送してください。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                  必要書類・準備物リスト
                </h4>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span>法人登記事項証明書（履歴事項全部証明書・3ヶ月以内）</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span>直近の確定申告書・決算書一式（別表4・勘定科目内訳明細等）</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span>法人税の納税証明書（その2）</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span>SECURITY ACTION 一つ星または二つ星の自己宣言完了</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span>導入する生成AIツールの見積書および導入支援事業者の特定</span>
                  </li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                  北海道内での相談先・連携機関
                </h4>
                <ul className="space-y-2 text-slate-700">
                  <li className="p-2 bg-slate-50 rounded-lg">
                    <strong className="block text-slate-900">北海道よろず支援拠点（札幌・出張相談窓口）</strong>
                    <span className="text-[11px] text-slate-500">国が設置する無料の経営相談窓口。補助金申請のアドバイスも対応。</span>
                  </li>
                  <li className="p-2 bg-slate-50 rounded-lg">
                    <strong className="block text-slate-900">道内各地の商工会議所・商工会</strong>
                    <span className="text-[11px] text-slate-500">札幌、帯広、旭川、釧路、函館、北見など地域事業者の経営支援。</span>
                  </li>
                  <li className="p-2 bg-slate-50 rounded-lg">
                    <strong className="block text-slate-900">提携 中小企業診断士・行政書士</strong>
                    <span className="text-[11px] text-slate-500">本下書きをもとに加点項目の設計・申請書類作成の委託が可能。</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
