import { UserProfileInput } from "./types";

export const INDUSTRY_PRESETS = [
  "IT・AI・受託開発・Web制作",
  "観光・宿泊業",
  "農業・酪農業",
  "建設・土木業",
  "飲食・食品加工業",
  "運送・物流業",
  "不動産・賃貸管理",
  "製造・加工業",
  "医療・介護・福祉",
  "小売・EC通販",
  "専門サービス・コンサル・他"
];

export const LOCATION_PRESETS = [
  "札幌市（道央）",
  "帯広市・十勝管内（道東）",
  "旭川市・上川管内（道北）",
  "釧路市・根室管内（道東）",
  "函館市・渡島管内（道南）",
  "北見市・網走管内（オホーツク）",
  "苫小牧市・胆振管内",
  "小樽市・後志管内",
  "富良野市・美瑛町",
  "その他 道内市町村"
];

export const AI_TOOL_PRESETS = [
  "AI受託開発・プロトタイプ開発支援・コード生成（GitHub Copilot / Claude）",
  "クライアント向けAI/DX提案書・要件定義・仕様書作成の自動化",
  "ChatGPT（顧客問い合わせ・メール・多言語対応の自動化）",
  "Claude（見積書・積算・仕様書・報告書の起案自動化）",
  "Gemini / AI Studio（観光インバウンド多言語案内＆画像解析）",
  "音声文字起こしAI（移動中・現場メモからの日報＆議事録自動作成）",
  "社内文書検索・ナレッジ特化型生成AI（マニュアル・属人化解消）"
];

export const INVESTMENT_PURPOSES = [
  "AI・IT導入",
  "販路開拓・集客",
  "設備・省力化",
  "まだ決まっていない"
] as const;

export const BUDGET_PRESETS = [
  "50万円未満",
  "50万〜150万円",
  "150万〜500万円",
  "500万円以上",
  "未定"
];

export const PHASE_ONE_SUBSIDIES = [
  {
    name: "デジタル化・AI導入補助金2026",
    summary: "登録されたITツール等の導入による業務効率化・DXを支援",
    suitableFor: "AI・クラウド・会計・受発注・顧客管理など"
  },
  {
    name: "小規模事業者持続化補助金",
    summary: "小規模事業者の販路開拓や業務効率化の取組を支援",
    suitableFor: "Webサイト・広告・店舗改善・新規顧客獲得など"
  },
  {
    name: "中小企業省力化投資補助金",
    summary: "人手不足に対応する設備・システム導入を支援",
    suitableFor: "自動化設備・省力化機器・業務プロセス改善など"
  }
];

export const CHALLENGE_PRESETS = [
  "受託開発・AI導入案件の急増に対しエンジニア・PMが不足し、要件定義や提案書・ドキュメント作成に工数が奪われ開発速度が上がらない",
  "深刻な人手不足でバックオフィスや事務に追われ、本来のコア業務（営業・施工・接客・開発）に時間が割けない",
  "冬期の積雪・悪天候による移動や除雪対応で業務が大幅に遅延し、残業が慢性化している",
  "広大な北海道内での現場・取引先間の移動コスト・連絡工数が大きく、迅速な情報伝達ができない",
  "見積書や安全書類・報告書作成などのデスクワークが多く、ベテランも現場作業に専念できない",
  "外国人観光客（インバウンド）が急増しているが、外国語で案内できるスタッフが不足している",
  "熟練者の技術・ノウハウが属人化しており、新入社員や若手スタッフへのノウハウ継承に時間がかかる"
];

export interface DemoScenario {
  id: string;
  name: string;
  badge: string;
  icon: string;
  input: UserProfileInput;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "it_ai_dev",
    name: "札幌のAI・受託開発企業",
    badge: "IT・AI開発・DX",
    icon: "💻",
    input: {
      industry: "IT・AI・受託開発・Web制作",
      location: "北海道 札幌市（道央）",
      aiTool: "AI受託開発・プロトタイプ開発支援・コード生成（GitHub Copilot / Claude）",
      primaryChallenge: "受託開発・AI導入案件の急増に対しエンジニア・PMが不足し、要件定義や提案書・ドキュメント作成に工数が奪われ開発速度が上がらない",
      employeeCount: "5名",
      monthlyAdminHoursPerPerson: 35,
      hourlyLaborCost: 3500
    }
  },
  {
    id: "tourism",
    name: "ニセコ・函館の宿泊施設",
    badge: "観光・インバウンド",
    icon: "🏨",
    input: {
      industry: "観光・宿泊業",
      location: "北海道 函館市・後志管内",
      aiTool: "ChatGPT（顧客問い合わせ・メール・多言語対応の自動化）",
      primaryChallenge: "外国人観光客が急増しているが外国語対応スタッフが不足し、夜間メール返信や予約変更対応で残業が常態化している",
      employeeCount: "6名",
      monthlyAdminHoursPerPerson: 30,
      hourlyLaborCost: 2200
    }
  },
  {
    id: "agriculture",
    name: "十勝の農業・酪農法人",
    badge: "一次産業・省力化",
    icon: "🌾",
    input: {
      industry: "農業・酪農業",
      location: "北海道 帯広市・十勝管内",
      aiTool: "音声文字起こしAI（移動中・現場メモからの日報＆議事録自動作成）",
      primaryChallenge: "広大な圃場での作業後に事務所に戻ってからの日報作成や資材発注書類に毎日2時間かかり、深刻な人手不足と過重労働に悩んでいる",
      employeeCount: "8名",
      monthlyAdminHoursPerPerson: 25,
      hourlyLaborCost: 2000
    }
  },
  {
    id: "construction",
    name: "札幌の地域密着型建設業",
    badge: "建設・冬期対策",
    icon: "🏗️",
    input: {
      industry: "建設・土木業",
      location: "北海道 札幌市",
      aiTool: "Claude（見積書・積算・仕様書・報告書の起案自動化）",
      primaryChallenge: "冬期の除雪や悪天候で工期が圧迫される中、積算や安全衛生書類などの事務作業が膨大で、技術者が本来の現場管理に集中できない",
      employeeCount: "10名",
      monthlyAdminHoursPerPerson: 35,
      hourlyLaborCost: 2600
    }
  },
  {
    id: "food",
    name: "旭川の食品加工・飲食店",
    badge: "飲食・食品",
    icon: "🍜",
    input: {
      industry: "飲食・食品加工業",
      location: "北海道 旭川市",
      aiTool: "ChatGPT（顧客問い合わせ・メール・多言語対応の自動化）",
      primaryChallenge: "原材料価格の高騰とパート不足の中、発注管理や予約管理、アレルギー対応等の事務連絡が多忙で、新メニュー開発や品質改善に手が回らない",
      employeeCount: "5名",
      monthlyAdminHoursPerPerson: 20,
      hourlyLaborCost: 2100
    }
  },
  {
    id: "logistics",
    name: "道東の運送・物流業者",
    badge: "物流・広域移動",
    icon: "🚚",
    input: {
      industry: "運送・物流業",
      location: "北海道 釧路市・根室管内",
      aiTool: "ChatGPT（顧客問い合わせ・メール・多言語対応の自動化）",
      primaryChallenge: "広大な道東エリアの長距離運行と冬期路面凍結による遅延連絡・問い合わせ対応がドライバーや配車係に集中し、人手不足が危機的状況",
      employeeCount: "12名",
      monthlyAdminHoursPerPerson: 28,
      hourlyLaborCost: 2400
    }
  }
];
