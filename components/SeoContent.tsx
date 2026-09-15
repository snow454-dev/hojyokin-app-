import React from 'react';
import { HelpCircle, MapPinned, SearchCheck, ShieldCheck } from 'lucide-react';

const faqs = [
  {
    question: '補助金とは何ですか？',
    answer: '国や自治体などが、政策目的に沿った事業を支援するために交付する資金です。対象者、対象経費、公募期間、審査条件は制度ごとに異なり、原則として申請と審査があります。'
  },
  {
    question: '北海道や札幌市、函館市の事業者も利用できますか？',
    answer: 'はい。札幌、函館、旭川、帯広、釧路、北見など、北海道内の中小企業・小規模事業者を想定しています。所在地と事業内容を入力すると、主要3制度との適合度を確認できます。'
  },
  {
    question: '2026年のAI導入に使える補助金を探せますか？',
    answer: 'デジタル化・AI導入補助金2026、中小企業省力化投資補助金、小規模事業者持続化補助金を比較できます。対象ツールや経費は公募回ごとに変わるため、診断後に最新の公式公募要領をご確認ください。'
  },
  {
    question: '補助金申請を代行するサービスですか？',
    answer: '申請代行ではありません。候補制度の簡易診断と事業計画書ドラフトを作成し、行政書士・中小企業診断士・商工会議所などへ相談する前の情報整理を支援します。'
  },
  {
    question: '補助金適正化法についても確認が必要ですか？',
    answer: '補助事業では、交付決定後も目的外使用の禁止、実績報告、証拠書類の保存など、制度上のルールを守る必要があります。個別の義務は交付規程・公募要領と専門家の案内で確認してください。'
  }
];

export const SeoContent: React.FC = () => (
  <section aria-labelledby="subsidy-guide-heading" className="mt-10 sm:mt-14 space-y-6 no-print">
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm">
      <div className="max-w-3xl">
        <p className="text-xs font-bold tracking-wider text-blue-700">北海道の補助金・AI導入支援</p>
        <h2 id="subsidy-guide-heading" className="mt-2 text-xl sm:text-2xl font-bold text-slate-950">
          北海道の補助金申請を、制度選びから事業計画書の準備まで支援
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          hojyokins.jpは、時間のない北海道の経営者や決裁担当者が、自社に合いそうな補助金を短時間で絞り込むための無料AI診断です。AI導入、販路開拓、設備投資・省力化の目的から主要3制度を比較し、次に確認すべき条件と事業計画書ドラフトを提示します。
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <article className="rounded-xl bg-blue-50 border border-blue-100 p-4">
          <SearchCheck className="w-5 h-5 text-blue-700" />
          <h3 className="mt-2 font-bold text-slate-900">補助金を無料診断</h3>
          <p className="mt-1 text-xs leading-6 text-slate-600">会社規模、投資目的、予算、経営課題から候補制度と確認事項を整理します。</p>
        </article>
        <article className="rounded-xl bg-indigo-50 border border-indigo-100 p-4">
          <MapPinned className="w-5 h-5 text-indigo-700" />
          <h3 className="mt-2 font-bold text-slate-900">北海道の地域事情を反映</h3>
          <p className="mt-1 text-xs leading-6 text-slate-600">札幌市、函館市をはじめ、道内の人手不足、広域移動、冬季の業務課題を計画に反映します。</p>
        </article>
        <article className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h3 className="mt-2 font-bold text-slate-900">専門家相談前の準備</h3>
          <p className="mt-1 text-xs leading-6 text-slate-600">申請代行を依頼する前に、自社情報、投資目的、効果、数値目標のたたき台を用意できます。</p>
        </article>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-blue-700" />
        <h2 className="text-xl font-bold text-slate-950">補助金申請についてよくある質問</h2>
      </div>
      <div className="mt-5 divide-y divide-slate-200">
        {faqs.map(item => (
          <details key={item.question} className="group py-4">
            <summary className="min-h-11 cursor-pointer list-none flex items-center justify-between gap-3 font-bold text-sm text-slate-900">
              {item.question}<span aria-hidden="true" className="text-blue-600 text-xl group-open:rotate-45 transition-transform">＋</span>
            </summary>
            <p className="pt-2 pr-7 text-sm leading-7 text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>

    <p className="px-2 text-[11px] leading-5 text-slate-500">
      本サービスの診断は申請可能性の目安です。補助金の採択・受給を保証するものではありません。申請時は各制度の公式サイト、公募要領、北海道内の商工会・商工会議所、よろず支援拠点または有資格者へご確認ください。
    </p>
  </section>
);
