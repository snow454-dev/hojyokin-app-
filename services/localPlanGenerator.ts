import { UserProfileInput, BusinessPlanResult, QuantitativeMetric, SubsidyMatch } from "../types";

export function diagnoseSubsidies(input: UserProfileInput): SubsidyMatch[] {
  const purpose = input.investmentPurpose || "まだ決まっていない";
  const text = `${input.aiTool || ""} ${input.primaryChallenge || ""}`;
  const small = input.companySize === "小規模事業者";
  const aiSignals = /AI|IT|クラウド|システム|DX|自動化|ソフト|デジタル/i.test(text);
  const salesSignals = /販路|集客|広告|Web|EC|店舗|顧客|売上|SNS/i.test(text);
  const laborSignals = /人手不足|省力|設備|機器|自動|効率|生産/i.test(text);

  const rows: SubsidyMatch[] = [
    {
      name: "デジタル化・AI導入補助金2026",
      score: Math.min(95, 48 + (purpose === "AI・IT導入" ? 32 : 0) + (aiSignals ? 15 : 0)),
      status: "確認が必要",
      reason: "AI・ITツールによる業務効率化との適合性を評価しました。",
      checks: ["導入するITツールが対象として登録されているか", "申請枠と補助対象経費", "gBizIDプライムとSECURITY ACTIONの準備"]
    },
    {
      name: "小規模事業者持続化補助金",
      score: Math.min(92, 38 + (purpose === "販路開拓・集客" ? 34 : 0) + (salesSignals ? 12 : 0) + (small ? 8 : 0)),
      status: "確認が必要",
      reason: "販路開拓・集客と、小規模事業者要件への適合性を評価しました。",
      checks: ["業種別の常時使用する従業員数要件", "経営計画と販路開拓施策のつながり", "管轄の商工会・商工会議所への事前相談"]
    },
    {
      name: "中小企業省力化投資補助金",
      score: Math.min(94, 42 + (purpose === "設備・省力化" ? 34 : 0) + (laborSignals ? 14 : 0)),
      status: "確認が必要",
      reason: "人手不足の解消と設備・システムによる省力化との適合性を評価しました。",
      checks: ["カタログ注文型・一般型のどちらに該当するか", "投資前後の業務時間と付加価値額", "対象設備・経費と公募期間"]
    }
  ];

  return rows
    .map(row => ({ ...row, status: row.score >= 75 ? "有力候補" : row.score >= 50 ? "確認が必要" : "対象外の可能性" } as SubsidyMatch))
    .sort((a, b) => b.score - a.score);
}

export function generateLocalPlan(input: UserProfileInput): BusinessPlanResult {
  const industry = input.industry?.trim() || "IT・AI・受託開発・Web制作";
  const location = input.location?.trim() || "札幌市（道央）";
  const aiTool = input.aiTool?.trim() || "AI受託開発・プロトタイプ開発支援・コード生成（GitHub Copilot / Claude）";
  const challenge = input.primaryChallenge?.trim() || "受託開発案件の急増に対しエンジニア・PMが不足し、要件定義や提案書作成に工数が奪われ開発速度が上がらない";
  const employeeCountNum = parseInt(input.employeeCount?.replace(/[^0-9]/g, "") || "5", 10) || 5;
  const adminHoursPerPerson = input.monthlyAdminHoursPerPerson || 35;
  const hourlyRate = input.hourlyLaborCost || 3200;
  const subsidyMatches = diagnoseSubsidies(input);
  const recommendedSubsidy = subsidyMatches[0].name;

  // 定量シミュレーション計算
  const totalAnnualAdminHours = employeeCountNum * adminHoursPerPerson * 12;
  const savedAnnualHours = Math.round(totalAnnualAdminHours * 0.45); // 45% 削減見込み
  const valueCreatedYear1 = Math.round(savedAnnualHours * hourlyRate);
  const valueCreatedYear3 = Math.round(valueCreatedYear1 * 1.15);
  const valueCreatedYear5 = Math.round(valueCreatedYear1 * 1.25);

  const cleanAiToolName = aiTool.split("（")[0].replace(/[\/／].*$/, "");
  const title = `【${recommendedSubsidy}・事業計画書ドラフト】${industry}における「${cleanAiToolName}」導入計画`;

  // 地域特性テキストのカスタマイズ
  let regionContext = "";
  if (location.includes("札幌")) {
    regionContext = "道内経済の中心地である札幌圏において、首都圏や道内外からのIT・DX案件需要が急拡大している一方、IT人材・熟練労働者の獲得競争が極めて激化しており、限られた人員での生産性最大化が至上命題となっている。";
  } else if (location.includes("十勝") || location.includes("帯広")) {
    regionContext = "全国有数の食料供給基地である十勝地域において、農業・食品加工・流通サプライチェーンとの緊密な連携が求められる中、広域移動コストや現場常駐工数の圧縮が急務となっている。";
  } else if (location.includes("旭川") || location.includes("上川")) {
    regionContext = "道北の拠点都市として厳冬期の豪雪や寒冷環境による移動制約・営業ロスが大きく、積雪期にも滞りなく事業継続可能なデジタル業務基盤の整備が急務となっている。";
  } else if (location.includes("釧路") || location.includes("根室")) {
    regionContext = "道東地域の広域移動距離の長さと人口流出に伴う若年層確保難が重なり、少人数体制で高付加価値を創出する体制転換が不可欠となっている。";
  } else {
    regionContext = "北海道特有の広大な商圏と冬季積雪による移動制限、ならびに全道的な少子高齢化に伴う深刻な労働力不足に直面しており、従来型の人海戦術では事業維持・拡大が困難となっている。";
  }

  // 業種ごとの業務改善具体策
  let step1Desc = "";
  let step2Desc = "";
  let step3Desc = "";
  let coreShiftText = "";

  if (industry.includes("IT") || industry.includes("Web")) {
    step1Desc = `**仕様書・要件定義・提案書の起案・ドラフト即時作成**\n     - クライアントからの初回ヒアリングメモや要望箇条書きを入力し、AIがWBS、基本設計書骨子、見積明細のドラフトを数分で自動起案。\n     - これまでディレクター・PMが1件あたり平均4時間費やしていた要件整理工数を1時間以内に圧縮（75%削減）。`;
    step2Desc = `**AIコード補完・単体テスト自動生成による開発スプリントの加速**\n     - コーディング中にリアルタイムで関数・ロジックをサジェスト。反復的なボイラープレートコードやテストコードを即時生成し、実装・レビューサイクルを半減。`;
    step3Desc = `**技術ドキュメント・過去ナレッジの即時検索と属人化解消**\n     - 社内の過去ソースコード、ライブラリ仕様、トラブルシューティング履歴をAI連携し、若手エンジニアでも自己解決可能な体制を構築。`;
    coreShiftText = `- **高付加価値な上流工程へのシフト**: ルーティンな文書作成から解放されたPM・シニアエンジニアが、クライアントのビジネスモデルに踏み込んだ提案やAIグランドデザインに時間を投入。\n- **納期短縮と新規受注キャパシティの拡大**: 実装サイクルの高速化により、同一体制のままで年間対応可能案件数を約30〜40%拡大。\n- **エンジニアの技術学習と定着率向上**: 単純作業の激減と最新生成AI開発手法の習得により、技術者の働きがいと定着率を劇的に向上。`;
  } else if (industry.includes("観光") || industry.includes("宿泊") || industry.includes("飲食")) {
    step1Desc = `**インバウンド対応・多言語問い合わせ（英語・中国語・韓国語）の自動即答**\n     - Webサイト・SNS・予約サイト経由の外国人客からのメッセージに対し、ニュアンスを踏まえた自然な多言語回答を数秒で起案。`;
    step2Desc = `**予約台帳・顧客カルテの自動整理とアレルギー・特別リクエストの抽出**\n     - 予約時の備考欄やメールから、配慮事項（食事制限、送迎希望）をAIが自動抽出して厨房・フロントに共有。伝達ミスをゼロ化。`;
    step3Desc = `**季節限定プラン・プロモーション文章・画像SNSコンテンツの量産**\n     - 道産食材や季節の観光見どころを盛り込んだ宿泊プラン・メニューの魅力的な紹介文をAIが短時間で多変量作成。`;
    coreShiftText = `- **対面のおもてなし・顧客接客への全力集中**: バックオフィスの端末作業を激減させ、スタッフが現場での笑顔の接客や体験ツアー案内に専念。\n- **道産素材の高単価プラン造成**: 地域の旬の特産品を活かしたオリジナルプラン開発に時間を投じ、客単価・リピート率を向上。\n- **スタッフの残業半減と労働環境の健全化**: 繁忙期や夜間の事務処理負担をAIに代替させ、離職防止と求人応募数増を実現。`;
  } else {
    step1Desc = `**見積書・日報・連絡メールの作成自動化**\n     - 日常的な定型書類のドラフトをAIが自動生成し、事務処理時間を劇的に圧縮。`;
    step2Desc = `**現場メモや音声データからの議事録・報告書自動作成**\n     - 移動中の車内や出先からスマートフォンで吹き込んだ音声から、きれいな報告書・日報を自動成型。`;
    step3Desc = `**過去の社内規定・マニュアル・類似案件の即座検索**\n     - ベテラン社員に聞かないと分からなかった過去の対応事例やノウハウをAIが即答。`;
    coreShiftText = `- **売上直結のコア業務（営業・現場施工・顧客サービス）への人員再配置**\n- **残業時間削減による冬期の過重労働防止と労働環境改善**\n- **迅速なレスポンスによる顧客満足度と成約率の向上**`;
  }

  const section1 = `### 1. 企業が直面する経営課題（北海道・業界特性の文脈）
当社は、${location}を拠点に${industry}を営む地域密着型の中小・小規模事業者である。

現在、北海道全体で全国を上回る急激な生産年齢人口の減少と有効求人倍率の高止まりが続いており、当社においても「${challenge}」という切実な経営ボトルネックに直面している。

さらに、北海道特有の環境課題として、広大な面積に伴う取引先や拠点間の移動工数・通信コストの負担、ならびに厳冬期の積雪・悪天候による業務遅延や工数増加が重くのしかかっている。
限られた従業員（現在${employeeCountNum}名体制）が日々の反復的な書類作成、問い合わせ対応、帳票処理などの間接業務に忙殺され、本来最も注力すべき高付加価値事業の開発や顧客開拓といった「売上直結のコア業務」に十分な時間を配分できていない。

この状況を放置すれば、従業員の過重労働や定着率低下を招き、持続的な企業成長が困難となる。したがって、従来の人海戦術から脱却し、最新の生成AIツール（${cleanAiToolName}）を活用した抜本的な業務プロセス改革と労働生産性の飛躍的向上が急務となっている。`;

  const section2 = `### 2. 生成AIツールの導入目的と具体的活用方法
本事業では、最新の生成AIツール（${aiTool}）を全社的な業務基盤として本格導入し、間接・定型業務の工数を劇的に圧縮する。

#### ■ 具体的な活用プロセス
1. ${step1Desc}
2. ${step2Desc}
3. ${step3Desc}

これらを日常の業務フローに組み込むことで、全社的なデジタルシフトと属人化解消を同時に達成する。`;

  const section3 = `### 3. 生産性向上による効果（定性的メリット）
生成AIの導入により、従業員1人あたり月間約${Math.round(adminHoursPerPerson * 0.45)}時間、全社で年間約${savedAnnualHours}時間もの膨大な付加価値の低い間接作業が削減される。

この創出された時間を、以下のような「本業（コア業務・売上直結業務）」へと大胆にシフトさせる：
${coreShiftText}`;

  const section4Explanation = `IT導入補助金の交付要件に基づき、「3年後に労働生産性を年率3%以上向上（3年間で累計9%以上向上）」または「5年後に年率2%以上向上（5年間で累計10%以上向上）」を達成するための定量シミュレーションを策定した。`;
  const section4CalcBasis = `【算出根拠】対象従業員${employeeCountNum}名 × 1人あたり月間削減時間${Math.round(adminHoursPerPerson * 0.45)}時間 × 12ヶ月 ＝ 年間創出時間${savedAnnualHours}時間。想定時間単価${hourlyRate.toLocaleString()}円として年間約${(valueCreatedYear1 / 10000).toFixed(1)}万円相当の経済的価値を創出。浮いた時間を高付加価値業務に投下することで、労働生産性（従業員1人あたり付加価値額）を毎年着実に伸ばす。`;

  const metricsTable: QuantitativeMetric[] = [
    {
      year: "導入前（基準年度）",
      laborProductivity: "4,200,000円 /人",
      productivityGrowthRate: "基準（0.0%）",
      annualHoursSaved: "0 時間",
      estimatedValueCreated: "0 万円"
    },
    {
      year: "1年目（導入・習熟期）",
      laborProductivity: "4,368,000円 /人",
      productivityGrowthRate: "+4.0%",
      annualHoursSaved: `${savedAnnualHours} 時間`,
      estimatedValueCreated: `${Math.round(valueCreatedYear1 / 10000)} 万円`
    },
    {
      year: "2年目（定着・活用期）",
      laborProductivity: "4,550,000円 /人",
      productivityGrowthRate: "+8.3%（累計）",
      annualHoursSaved: `${Math.round(savedAnnualHours * 1.1)} 時間`,
      estimatedValueCreated: `${Math.round(valueCreatedYear1 * 1.1 / 10000)} 万円`
    },
    {
      year: "3年目（目標達成年度★要件充足）",
      laborProductivity: "4,750,000円 /人",
      productivityGrowthRate: "+13.1%（年率換算 +4.2%）",
      annualHoursSaved: `${Math.round(savedAnnualHours * 1.15)} 時間`,
      estimatedValueCreated: `${Math.round(valueCreatedYear3 / 10000)} 万円`
    },
    {
      year: "5年目（長期発展年度）",
      laborProductivity: "5,120,000円 /人",
      productivityGrowthRate: "+21.9%（年率換算 +4.0%）",
      annualHoursSaved: `${Math.round(savedAnnualHours * 1.25)} 時間`,
      estimatedValueCreated: `${Math.round(valueCreatedYear5 / 10000)} 万円`
    }
  ];

  const fullMarkdown = `# ${title}

---

${section1}

---

${section2}

---

${section3}

---

### 4. 労働生産性向上の数値目標シミュレーション（定量的メリット）
${section4Explanation}

${section4CalcBasis}

| 対象年度 | 労働生産性（1人あたり付加価値額） | 伸び率（基準年度比） | 年間削減時間 | 創出見込み価値 |
| :--- | :--- | :--- | :--- | :--- |
${metricsTable.map(m => `| ${m.year} | ${m.laborProductivity} | **${m.productivityGrowthRate}** | ${m.annualHoursSaved} | ${m.estimatedValueCreated} |`).join('\n')}

> **【重要】**
> この診断と数値計画は申請準備用のドラフトです。採択・受給を保証するものではありません。提出前に最新の公募要領と専門家による確認を行ってください。

---

### 5. 北海道内の経営者への次のアクション（申請準備と専門家連携）
- **STEP 1：gBizIDプライムアカウントの取得（最優先）**
  本事業計画書下書きをベースに「IT導入補助金」や各種国・道独自補助金の電子申請を行うには、デジタル庁発行の法人代表者用認証ID**「gBizIDプライム」**が必須となります。
  ID発行には印鑑証明書の郵送審査等で**通常1〜2週間程度**を要します。公募締切直前では間に合わないリスクがあるため、まだお持ちでない経営者様は直ちに「gBizID公式サイト（gbiz-id.go.jp）」より無料発行手続きを開始してください。
- **STEP 2：道内提携行政書士・中小企業診断士への最終チェック委託**
  本下書きは審査基準に基づいた骨子ですが、実際の公募回ごとの最新公募要領、導入ITツール（IT導入支援事業者の登録ツール）との適合判定、加点項目（賃上げ表明、DX認定、SECURITY ACTION等）の精査が採択率を左右します。
  道内各地域（札幌・道央、道東・十勝・釧路・オホーツク、道南、道北）の商工会議所・商工会、またはIT導入補助金採択実績の豊富な提携行政書士・中小企業診断士への最終リーガルチェック・代理申請支援の委託をお勧めいたします。`;

  return {
    title,
    recommendedSubsidy,
    subsidyMatches,
    diagnosisNotice: "入力内容に基づく簡易診断です。対象要件・公募期間・補助対象経費は必ず最新の公式公募要領で確認してください。",
    overview: {
      industry,
      location,
      aiTool,
      challengeSummary: challenge
    },
    section1_ManagementChallenges: section1,
    section2_AiImplementationAndSteps: section2,
    section3_QualitativeEffectsAndShift: section3,
    section4_QuantitativeSimulation: {
      explanation: section4Explanation,
      calculationBasis: section4CalcBasis,
      metricsTable,
      targetMetBadge: "数値目標案（公募要領との照合が必要）"
    },
    section5_NextActionsAndGuidance: {
      gBizIdNotice: "申請には「gBizIDプライム」が必須です。発行には1〜2週間を要するため、直ちに取得手続きを開始してください。",
      specialistConsultationNotice: "道内の中小企業診断士・行政書士・商工会議所と連携し、最新の公募回要領と加点項目の最終チェックを行ってください。",
      actionSteps: [
        "gBizIDプライムの発行申請（印鑑証明書を準備して即日郵送）",
        "SECURITY ACTION（一つ星または二つ星）の自己宣言完了（必須要件）",
        "直近の決算書（別表4・勘定科目内訳明細等）および納税証明書その2の準備",
        "IT導入支援事業者（または生成AIツールベンダー）の選定と見積取得",
        "道内の専門家（行政書士・中小企業診断士）による申請書類の最終推敲"
      ]
    },
    fullMarkdownText: fullMarkdown
  };
}
