import React, { useState } from 'react';
import { 
  INDUSTRY_PRESETS, 
  LOCATION_PRESETS, 
  AI_TOOL_PRESETS, 
  CHALLENGE_PRESETS, 
  DEMO_SCENARIOS, 
  DemoScenario 
} from '../constants';
import { UserProfileInput } from '../types';
import { Sparkles, Building2, Bot, AlertCircle, MapPin, ChevronDown, ChevronUp, ArrowRight, Zap } from 'lucide-react';
import { Spinner } from './Spinner';

interface Props {
  onSubmit: (input: UserProfileInput) => void;
  loading: boolean;
}

export const QuickInputForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const [industry, setIndustry] = useState<string>('IT・AI・受託開発・Web制作');
  const [location, setLocation] = useState<string>('札幌市（道央）');
  const [aiTool, setAiTool] = useState<string>('AI受託開発・プロトタイプ開発支援・コード生成（GitHub Copilot / Claude）');
  const [primaryChallenge, setPrimaryChallenge] = useState<string>(
    '受託開発・AI導入案件の急増に対しエンジニア・PMが不足し、要件定義や提案書・ドキュメント作成に工数が奪われ開発速度が上がらない'
  );
  
  // Optional accordion
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [employeeCount, setEmployeeCount] = useState<string>('5名');
  const [monthlyAdminHours, setMonthlyAdminHours] = useState<number>(35);
  const [hourlyRate, setHourlyRate] = useState<number>(3500);

  const handleApplyPreset = (scenario: DemoScenario) => {
    setIndustry(scenario.input.industry);
    setLocation(scenario.input.location);
    setAiTool(scenario.input.aiTool);
    setPrimaryChallenge(scenario.input.primaryChallenge);
    if (scenario.input.employeeCount) setEmployeeCount(scenario.input.employeeCount);
    if (scenario.input.monthlyAdminHoursPerPerson) setMonthlyAdminHours(scenario.input.monthlyAdminHoursPerPerson);
    if (scenario.input.hourlyLaborCost) setHourlyRate(scenario.input.hourlyLaborCost);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!industry.trim() || !primaryChallenge.trim()) {
      return;
    }
    onSubmit({
      industry: industry.trim(),
      location: location.trim(),
      aiTool: aiTool.trim(),
      primaryChallenge: primaryChallenge.trim(),
      employeeCount,
      monthlyAdminHoursPerPerson: monthlyAdminHours,
      hourlyLaborCost: hourlyRate,
    });
  };

  return (
    <div className="space-y-6 relative">
      {/* Loading Modal / Overlay during generation */}
      {loading && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-blue-100 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border-4 border-blue-100 animate-pulse">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900">
                事業計画書ドラフトを作成中...
              </h4>
              <p className="text-xs text-slate-500">
                北海道特有の地域課題・業務プロセス改善・3年後数値計画を組み立てています
              </p>
            </div>
            <div className="space-y-2 pt-2 text-left bg-slate-50 p-3.5 rounded-xl text-xs text-slate-600 border border-slate-100">
              <div className="flex items-center gap-2 text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>① 地域特性（{location}）と経営課題を抽出</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>② {industry}向けの生成AI活用プロセスを策定</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span>③ IT導入補助金基準（年率+3%以上向上）を試算</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero / Value Proposition Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              北海道中小企業・小規模事業者向け AI導入補助金 申請支援
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              忙しい経営者のための「タイパ最重視」事業計画書ドラフト作成
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              業種・導入したいAI・現在の悩みの<strong className="text-white">3つの最小入力</strong>で、
              「北海道特有の課題（移動コスト・冬期積雪・労働力不足）」「本業シフトの定性ストーリー」「IT導入補助金の3年後年率+3%数値目標シミュレーション」を含む審査採択レベルの下書きを一発作成します。
            </p>
          </div>

          <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-xl text-xs space-y-1.5 text-slate-200">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              審査採択の3大ポイントを網羅
            </div>
            <div className="text-slate-300">① なぜその生成AIか（地域・業界課題）</div>
            <div className="text-slate-300">② 生産性向上の具体業務プロセス</div>
            <div className="text-slate-300">③ 3〜5年後の労働生産性向上数値計画</div>
          </div>
        </div>

        {/* 1-Click Demo Scenarios */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <span>⚡ 1クリックで入力を試す（道内モデル事例）:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {DEMO_SCENARIOS.map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => handleApplyPreset(demo)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors shadow-sm"
              >
                <span>{demo.icon}</span>
                <span>{demo.name}</span>
                <span className="text-[10px] text-blue-300 opacity-80">({demo.badge})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            申請概要の入力（最短1分で完了）
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            選択肢のタップ、またはテキストを直接修正して入力してください。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Field 1: Industry */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">
              ① 【業種】<span className="text-rose-500 font-bold ml-1">*必須</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {INDUSTRY_PRESETS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setIndustry(item)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-all ${
                    industry === item
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="例: 観光・宿泊業、農業、建設業、飲食店など"
              className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Field: Location */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">
              企業所在地（北海道内地域）
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {LOCATION_PRESETS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLocation(item)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-all ${
                    location === item
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item.split('（')[0]}
                </button>
              ))}
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="例: 北海道 札幌市、帯広市、旭川市、釧路市など"
                className="w-full pl-9 p-3 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Field 2: AI Tool */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-sm font-bold text-slate-800">
            ② 【導入したいAI】<span className="text-rose-500 font-bold ml-1">*必須</span>
          </label>
          <p className="text-xs text-slate-500">
            導入予定の生成AIツールまたは自動化したい業務を選択してください。
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {AI_TOOL_PRESETS.map((tool) => (
              <button
                key={tool}
                type="button"
                onClick={() => setAiTool(tool)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all text-left ${
                  aiTool === tool
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold ring-1 ring-indigo-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bot className="w-3.5 h-3.5 inline mr-1 text-indigo-600" />
                {tool}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={aiTool}
            onChange={(e) => setAiTool(e.target.value)}
            placeholder="例: ChatGPTによる顧客対応自動化、Claudeによる書類作成など"
            className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Field 3: Primary Challenge */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-sm font-bold text-slate-800">
            ③ 【現在の1番の悩み】<span className="text-rose-500 font-bold ml-1">*必須</span>
          </label>
          <p className="text-xs text-slate-500">
            最も解決したい経営課題を選択、または具体的に入力してください。
          </p>
          <div className="space-y-1.5 mb-2">
            {CHALLENGE_PRESETS.map((challenge, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrimaryChallenge(challenge)}
                className={`w-full text-left text-xs p-2.5 rounded-lg border transition-all flex items-start gap-2 ${
                  primaryChallenge === challenge
                    ? 'bg-blue-50 border-blue-500 text-blue-950 font-medium ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>{challenge}</span>
              </button>
            ))}
          </div>
          <textarea
            rows={3}
            value={primaryChallenge}
            onChange={(e) => setPrimaryChallenge(e.target.value)}
            placeholder="例: 人手不足でバックオフィスが回らない、残業を減らしたい、冬期の書類処理が滞るなど"
            className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Accordion: Optional parameters for fine-tuning simulation */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>数値シミュレーションの詳細設定（任意・初期値のままでも可）</span>
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">従業員数</label>
                <input
                  type="text"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  placeholder="例: 5名"
                  className="w-full p-2 bg-white border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">1人あたりの月間事務時間想定</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={monthlyAdminHours}
                    onChange={(e) => setMonthlyAdminHours(Number(e.target.value))}
                    min={5}
                    max={60}
                    className="w-full p-2 bg-white border border-slate-300 rounded-md"
                  />
                  <span className="text-slate-500">時間/月</span>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">想定平均時間単価</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    min={1200}
                    max={5000}
                    step={100}
                    className="w-full p-2 bg-white border border-slate-300 rounded-md"
                  />
                  <span className="text-slate-500">円/時</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>※ 生成後、本文の直接編集や数値シミュレーションの微調整、PDF印刷が可能です。</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 cursor-pointer"
          >
            {loading ? (
              <>
                <Spinner />
                <span>北海道特化・事業計画書（下書き）を一発生成中...</span>
              </>
            ) : (
              <>
                <span>事業計画書（下書き）を一発生成する</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
