import React, { useState } from 'react';
import { Calculator, CheckCircle2, TrendingUp, Clock, Coins, Users } from 'lucide-react';
import { QuantitativeMetric } from '../types';

interface Props {
  initialEmployees?: number;
  initialHoursSaved?: number;
  initialHourlyRate?: number;
  onApplyMetrics?: (metrics: QuantitativeMetric[], basis: string) => void;
}

export const ProductivitySimulator: React.FC<Props> = ({
  initialEmployees = 5,
  initialHoursSaved = 12,
  initialHourlyRate = 2200,
  onApplyMetrics
}) => {
  const [employees, setEmployees] = useState<number>(initialEmployees);
  const [monthlyHoursSavedPerPerson, setMonthlyHoursSavedPerPerson] = useState<number>(initialHoursSaved);
  const [hourlyRate, setHourlyRate] = useState<number>(initialHourlyRate);

  // Calculations
  const totalAnnualHours = employees * monthlyHoursSavedPerPerson * 12;
  const annualEconomicValue = Math.round(totalAnnualHours * hourlyRate);

  // Baseline standard added value per employee for SME in Japan (approx 4,200,000 yen)
  const baselineProductivity = 4200000;
  const additionalValuePerPersonYear1 = Math.round(annualEconomicValue / employees);

  // Growth percentages
  const year1Val = baselineProductivity + additionalValuePerPersonYear1;
  const year1Growth = ((year1Val - baselineProductivity) / baselineProductivity) * 100;

  const year2Growth = year1Growth * 1.5;
  const year2Val = Math.round(baselineProductivity * (1 + year2Growth / 100));

  const year3Growth = year1Growth * 2.1; // 3-year cumulative
  const year3Val = Math.round(baselineProductivity * (1 + year3Growth / 100));
  const year3Annualized = year3Growth / 3;

  const year5Growth = year1Growth * 3.2; // 5-year cumulative
  const year5Val = Math.round(baselineProductivity * (1 + year5Growth / 100));
  const year5Annualized = year5Growth / 5;

  const isTargetMetYear3 = year3Annualized >= 3.0 || year3Growth >= 9.0;
  const isTargetMetYear5 = year5Annualized >= 2.0 || year5Growth >= 10.0;

  const metrics: QuantitativeMetric[] = [
    {
      year: "基準年度（導入前）",
      laborProductivity: `${baselineProductivity.toLocaleString()}円 /人`,
      productivityGrowthRate: "基準（0.0%）",
      annualHoursSaved: "0 時間",
      estimatedValueCreated: "0 万円"
    },
    {
      year: "1年目（導入定着）",
      laborProductivity: `${year1Val.toLocaleString()}円 /人`,
      productivityGrowthRate: `+${year1Growth.toFixed(1)}%`,
      annualHoursSaved: `${totalAnnualHours.toLocaleString()} 時間`,
      estimatedValueCreated: `${Math.round(annualEconomicValue / 10000)} 万円`
    },
    {
      year: "2年目（展開期）",
      laborProductivity: `${year2Val.toLocaleString()}円 /人`,
      productivityGrowthRate: `+${year2Growth.toFixed(1)}%（累計）`,
      annualHoursSaved: `${Math.round(totalAnnualHours * 1.1).toLocaleString()} 時間`,
      estimatedValueCreated: `${Math.round(annualEconomicValue * 1.1 / 10000)} 万円`
    },
    {
      year: "3年目（目標年★審査基準）",
      laborProductivity: `${year3Val.toLocaleString()}円 /人`,
      productivityGrowthRate: `+${year3Growth.toFixed(1)}% (年率 +${year3Annualized.toFixed(1)}%)`,
      annualHoursSaved: `${Math.round(totalAnnualHours * 1.2).toLocaleString()} 時間`,
      estimatedValueCreated: `${Math.round(annualEconomicValue * 1.2 / 10000)} 万円`
    },
    {
      year: "5年目（長期発展目標）",
      laborProductivity: `${year5Val.toLocaleString()}円 /人`,
      productivityGrowthRate: `+${year5Growth.toFixed(1)}% (年率 +${year5Annualized.toFixed(1)}%)`,
      annualHoursSaved: `${Math.round(totalAnnualHours * 1.35).toLocaleString()} 時間`,
      estimatedValueCreated: `${Math.round(annualEconomicValue * 1.35 / 10000)} 万円`
    }
  ];

  const calculationBasis = `対象従業員${employees}名 × 1人あたり月間削減時間${monthlyHoursSavedPerPerson}時間 × 12ヶ月 ＝ 全社年間削減${totalAnnualHours.toLocaleString()}時間。想定時間単価${hourlyRate.toLocaleString()}円により年間約${Math.round(annualEconomicValue / 10000)}万円の付加価値創出を見込む。`;

  const handleApply = () => {
    if (onApplyMetrics) {
      onApplyMetrics(metrics, calculationBasis);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">労働生産性シミュレーター（IT導入補助金要件判定）</h4>
            <p className="text-xs text-slate-500">スライダーを動かして自社の規模に合わせた現実的な数値計画を策定できます</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            isTargetMetYear3 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            {isTargetMetYear3 ? '3年後年率+3%以上（要件クリア）' : '目標値引き上げ推奨'}
          </div>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Slider 1: Employees */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              対象従業員数
            </label>
            <span className="text-sm font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
              {employees} 名
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={employees}
            onChange={(e) => setEmployees(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>1名（個人事業主）</span>
            <span>15名</span>
            <span>30名</span>
          </div>
        </div>

        {/* Slider 2: Monthly Hours Saved Per Person */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              1人あたり月間削減時間
            </label>
            <span className="text-sm font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
              約 {monthlyHoursSavedPerPerson} 時間/月
            </span>
          </div>
          <input
            type="range"
            min={3}
            max={40}
            step={1}
            value={monthlyHoursSavedPerPerson}
            onChange={(e) => setMonthlyHoursSavedPerPerson(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>3時間 (軽微)</span>
            <span>20時間</span>
            <span>40時間 (大幅)</span>
          </div>
        </div>

        {/* Slider 3: Hourly Rate */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-600" />
              想定平均時間単価
            </label>
            <span className="text-sm font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
              {hourlyRate.toLocaleString()} 円/時
            </span>
          </div>
          <input
            type="range"
            min={1200}
            max={4000}
            step={100}
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>1,200円 (パート基準)</span>
            <span>2,500円</span>
            <span>4,000円 (専門職)</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-blue-50/60 border border-blue-200/70 p-3 rounded-lg">
          <span className="text-[11px] font-medium text-blue-700 block">全社年間創出時間</span>
          <span className="text-lg font-bold text-blue-900">{totalAnnualHours.toLocaleString()}</span>
          <span className="text-xs text-blue-700 ml-1">時間/年</span>
        </div>
        <div className="bg-emerald-50/60 border border-emerald-200/70 p-3 rounded-lg">
          <span className="text-[11px] font-medium text-emerald-700 block">年間創出経済価値</span>
          <span className="text-lg font-bold text-emerald-900">約 {Math.round(annualEconomicValue / 10000)}</span>
          <span className="text-xs text-emerald-700 ml-1">万円</span>
        </div>
        <div className="bg-indigo-50/60 border border-indigo-200/70 p-3 rounded-lg">
          <span className="text-[11px] font-medium text-indigo-700 block">3年後 累計生産性向上</span>
          <span className="text-lg font-bold text-indigo-900">+{year3Growth.toFixed(1)}%</span>
          <span className="text-[10px] text-indigo-700 block">年率 +{year3Annualized.toFixed(1)}%</span>
        </div>
        <div className="bg-violet-50/60 border border-violet-200/70 p-3 rounded-lg">
          <span className="text-[11px] font-medium text-violet-700 block">5年後 累計生産性向上</span>
          <span className="text-lg font-bold text-violet-900">+{year5Growth.toFixed(1)}%</span>
          <span className="text-[10px] text-violet-700 block">年率 +{year5Annualized.toFixed(1)}%</span>
        </div>
      </div>

      {/* Table Display */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg mb-4">
        <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
          <thead className="bg-slate-100/80 font-bold text-slate-700">
            <tr>
              <th className="py-2.5 px-3">対象年度</th>
              <th className="py-2.5 px-3">労働生産性（付加価値額）</th>
              <th className="py-2.5 px-3">伸び率（基準比）</th>
              <th className="py-2.5 px-3">年間削減時間</th>
              <th className="py-2.5 px-3">創出見込み価値</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {metrics.map((row, i) => (
              <tr key={i} className={i === 3 ? 'bg-blue-50/50 font-semibold' : ''}>
                <td className="py-2.5 px-3 text-slate-900">{row.year}</td>
                <td className="py-2.5 px-3 text-slate-700">{row.laborProductivity}</td>
                <td className="py-2.5 px-3 text-blue-700">{row.productivityGrowthRate}</td>
                <td className="py-2.5 px-3 text-slate-700">{row.annualHoursSaved}</td>
                <td className="py-2.5 px-3 text-emerald-700 font-medium">{row.estimatedValueCreated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {onApplyMetrics && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            この計算結果を計画書本文（第4項）に反映する
          </button>
        </div>
      )}
    </div>
  );
};
