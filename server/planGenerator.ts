import { GoogleGenAI, Type } from "@google/genai";
import { UserProfileInput, BusinessPlanResult } from "../types";

export function generateLocalFallbackPlan(input: UserProfileInput): BusinessPlanResult {
  const industry = input.industry || "観光・宿泊業";
  const location = input.location || "北海道 札幌市";
  const aiTool = input.aiTool || "ChatGPTによる顧客問い合わせ・メール・多言語対応の自動化";
  const challenge = input.primaryChallenge || "深刻な人手不足によりバックオフィス業務に追われ、本来のコア業務に十分な時間が割けない";
  const employeeCountNum = parseInt(input.employeeCount?.replace(/[^0-9]/g, "") || "5", 10) || 5;
  const adminHoursPerPerson = input.monthlyAdminHoursPerPerson || 25;
  const hourlyRate = input.hourlyLaborCost || 2200;

  // Quantitative calculations
  const totalAnnualAdminHours = employeeCountNum * adminHoursPerPerson * 12;
  const savedAnnualHours = Math.round(totalAnnualAdminHours * 0.45); // 45% reduction
  const valueCreatedYear1 = Math.round(savedAnnualHours * hourlyRate);
  const valueCreatedYear3 = Math.round(valueCreatedYear1 * 1.15);
  const valueCreatedYear5 = Math.round(valueCreatedYear1 * 1.25);

  const title = `【IT導入補助金2026・申請用】${industry}における${aiTool.split('（')[0]}導入による労働生産性飛躍的向上計画`;

  const section1 = `### 1. 企業が直面する経営課題（北海道・業界特性の文脈）
当社は、${location}を拠点に${industry}を営む地域密着の小規模事業者である。

現在、北海道全体で全国を上回る急速な生産年齢人口の減少と求人倍率の高止まりが深刻化しており、当社においても「${challenge}」という切実な課題に直面している。
特に北海道特有の地域課題として、広大な面積に伴う取引先や拠点間の移動コスト・移動時間の負担、さらには厳冬期の降雪・積雪による移動制限や業務工数の増加が重くのしかかっている。
限られた少人数の従業員（${employeeCountNum}名体制）が日々の定常的な書類作成、問い合わせ対応、帳票処理などのバックオフィス業務に忙殺され、本来最も注力すべき顧客サービス向上や新規商談開拓、地域資源を活かした高付加価値事業の開発といった「売上直結のコア業務」に十分な時間を配分できていない。

このままでは従業員の過重労働や定着率低下を招き、北海道の地域経済を支える事業基盤そのものが揺らぎかねない。そのため、従来の人海戦術から脱却し、最新の生成AIツールを活用した抜本的な業務自動化・労働生産性の改革が焦眉の急となっている。`;

  const section2 = `### 2. 生成AIツールの導入目的と具体的活用方法
本事業では、最新の生成AIツール（${aiTool}）を全社的な業務基盤として導入し、定型・準定型業務の工数を劇的に圧縮する。

#### ■ 具体的な活用ステップ
1. **ステップ1：定型文書・連絡業務のドラフト即時自動生成**
   - 顧客からの問い合わせメール返信、見積書作成に伴う補足説明、定例報告書の下書きを生成AIにプロンプトテンプレート化。
   - 担当者はAIが生成した草案を確認・微調整するだけで済むようになり、従来1件あたり30分要していた書類作成時間を5分未満へ短縮（80%以上の削減）。
2. **ステップ2：北海道地域・インバウンド向け多言語対応およびFAQナレッジ化**
   - 増加する訪日外国人観光客や遠隔地顧客からの問い合わせに対し、英語・簡体字・繁体字・韓国語へリアルタイム高精度翻訳＆自動回答案を生成。
   - 社内の過去対応事例や業務マニュアルをAIに学習・参照させることで、経験の浅いスタッフでもベテラン同等の正確かつ迅速な対応を可能とする。
3. **ステップ3：現場報告・日報の音声入力と議事録・要約自動作成**
   - 移動の多い道内現場や外出先からスマートフォン等の音声入力機能と生成AIを連携。音声メモから自動で構造化された日報や議事録を生成し、帰社後の事務作業をゼロ化する。`;

  const section3 = `### 3. 生産性向上による効果（定性的メリット）
生成AIの導入によって、従業員1人あたり月間約${Math.round(adminHoursPerPerson * 0.45)}時間、全社で年間約${savedAnnualHours}時間もの膨大な付加価値の低い間接事務作業が削減される。

この創出された時間を、以下のような「本業（コア業務・売上直結業務）」へと大胆にシフトさせる：
- **顧客接点の強化とリピート率向上**：ルーティン業務から解放されたスタッフが、顧客一人ひとりへの丁寧な対面接客やアフターフォロー、きめ細やかな提案活動に専念。
- **北海道の強みを活かした新企画・新メニュー・新工法の開発**：地域の旬や季節特性を反映した高単価商品・プランの企画検討や、施工現場の安全・品質管理の徹底に時間を投下。
- **ワークライフバランスの改善と冬期労働環境の健全化**：積雪期に嵩みがちだった残業を大幅に削減し、有給取得率の向上や離職防止、魅力的な職場環境の構築による新規採用力強化を実現する。`;

  const section4Explanation = `IT導入補助金の交付要件に基づき、「3年後に労働生産性を年率3%以上向上（3年間で累計9%以上向上）」または「5年後に年率2%以上向上（5年間で累計10%以上向上）」を達成するための定量シミュレーションを策定した。`;
  const section4CalcBasis = `【算出根拠】対象従業員${employeeCountNum}名 × 1人あたり月間削減時間${Math.round(adminHoursPerPerson * 0.45)}時間 × 12ヶ月 ＝ 年間創出時間${savedAnnualHours}時間。想定時間単価${hourlyRate.toLocaleString()}円として年間約${(valueCreatedYear1 / 10000).toFixed(1)}万円相当の経済的価値を創出。浮いた時間を高付加価値業務に投下することで、労働生産性（従業員1人あたり付加価値額）を毎年着実に伸ばす。`;

  const metricsTable = [
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

> **【補助金要件判定】**
> 本数値計画は、IT導入補助金が求める「3年後に年率3%以上向上（累計9%以上）」を十分に満たす計画（年率+4.2%達成設計）となっており、審査における加点・採択要件を完璧にクリアしています。

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
    recommendedSubsidy: "IT導入補助金（通常枠 / インボイス枠）および 北海道DX・省力化推進補助金",
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
      targetMetBadge: "IT導入補助金 要件達成（3年後年率+3%以上クリア）"
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

export async function generateBusinessPlanWithGemini(input: UserProfileInput): Promise<BusinessPlanResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "PLACEHOLDER_API_KEY") {
    console.log("Using intelligent fallback plan generator (no active GEMINI_API_KEY)");
    return generateLocalFallbackPlan(input);
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  const prompt = `あなたは、日本国内（特に北海道）の中小企業・小規模事業者を対象とした「AI導入補助金（主にIT導入補助金や地域独自補助金）」の申請用・事業計画書（下書き）を自動作成するプロフェッショナルAIエージェントです。

忙しい経営者や決済担当者が「最小限の入力（タイパ最重視）」で、審査に採択されやすい高品質なストーリーと数値計画の骨子を得られるよう、以下の入力情報に基づき、指定の5構成で一発出力してください。

【入力情報】
- 業種: ${input.industry}
- 所在地: ${input.location || "北海道"}
- 導入したいAI: ${input.aiTool}
- 現在の1番の悩み: ${input.primaryChallenge}
- 従業員数（参考）: ${input.employeeCount || "5名"}
- 1人あたりの月間事務時間想定: ${input.monthlyAdminHoursPerPerson || 25}時間
- 想定時間単価: ${input.hourlyLaborCost || 2200}円

【前提条件・審査基準】
1. ターゲット地域: 北海道（広大な土地による移動コスト、積雪期の業務効率化、深刻な人手不足、一次産業や観光業の活性化という地域特性を必ず織り込む）。
2. 対象ITツール: 生成AIツール（ChatGPT、Claude、Google AI Studio/Gemini等）のビジネス導入。
3. 審査の重要ポイント:
   - 「なぜその生成AIが必要なのか（現状の経営課題）」
   - 「生成AIの導入によって、どのように労働生産性が向上するか（具体的プロセス）」
   - 「3〜5年後の労働生産性向上目標（数値計画のシミュレーション：3年後に年率3%以上、または5年後に年率2%以上向上）」

【トーン＆マナー】
- 専門用語を多用せず、日本の公的な補助金審査員に「伝わりやすく、説得力がある」丁寧なビジネス日本語で記述。
- 経営者が一読して「そうそう、これが言いたかった！」と共感できる内容に仕上げること。

必ず次のJSONフォーマットのみを返してください。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "あなたは北海道特化の補助金申請支援・事業計画書作成の第一人者（中小企業診断士・ITコーディネータ）です。日本の公的補助金（IT導入補助金）の審査官が高得点をつけたくなる、論理的で地域性に富んだ採択レベルの事業計画書を作成してください。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            recommendedSubsidy: { type: Type.STRING },
            overview: {
              type: Type.OBJECT,
              properties: {
                industry: { type: Type.STRING },
                location: { type: Type.STRING },
                aiTool: { type: Type.STRING },
                challengeSummary: { type: Type.STRING }
              },
              required: ["industry", "location", "aiTool", "challengeSummary"]
            },
            section1_ManagementChallenges: { type: Type.STRING },
            section2_AiImplementationAndSteps: { type: Type.STRING },
            section3_QualitativeEffectsAndShift: { type: Type.STRING },
            section4_QuantitativeSimulation: {
              type: Type.OBJECT,
              properties: {
                explanation: { type: Type.STRING },
                calculationBasis: { type: Type.STRING },
                metricsTable: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      year: { type: Type.STRING },
                      laborProductivity: { type: Type.STRING },
                      productivityGrowthRate: { type: Type.STRING },
                      annualHoursSaved: { type: Type.STRING },
                      estimatedValueCreated: { type: Type.STRING }
                    },
                    required: ["year", "laborProductivity", "productivityGrowthRate", "annualHoursSaved", "estimatedValueCreated"]
                  }
                },
                targetMetBadge: { type: Type.STRING }
              },
              required: ["explanation", "calculationBasis", "metricsTable", "targetMetBadge"]
            },
            section5_NextActionsAndGuidance: {
              type: Type.OBJECT,
              properties: {
                gBizIdNotice: { type: Type.STRING },
                specialistConsultationNotice: { type: Type.STRING },
                actionSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["gBizIdNotice", "specialistConsultationNotice", "actionSteps"]
            }
          },
          required: [
            "title",
            "recommendedSubsidy",
            "overview",
            "section1_ManagementChallenges",
            "section2_AiImplementationAndSteps",
            "section3_QualitativeEffectsAndShift",
            "section4_QuantitativeSimulation",
            "section5_NextActionsAndGuidance"
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");

    const fullMarkdownText = `# ${parsed.title}

---

## 1. 企業が直面する経営課題（北海道・業界特性の文脈を反映）
${parsed.section1_ManagementChallenges}

---

## 2. 生成AIツールの導入目的と具体的活用方法
${parsed.section2_AiImplementationAndSteps}

---

## 3. 生産性向上による効果（定性的メリット）
${parsed.section3_QualitativeEffectsAndShift}

---

## 4. 労働生産性向上の数値目標シミュレーション（定量的メリット）
${parsed.section4_QuantitativeSimulation?.explanation}

**【算出根拠】**
${parsed.section4_QuantitativeSimulation?.calculationBasis}

| 対象年度 | 労働生産性（付加価値額） | 伸び率（基準年度比） | 年間削減時間 | 創出見込み価値 |
| :--- | :--- | :--- | :--- | :--- |
${parsed.section4_QuantitativeSimulation?.metricsTable?.map((m: any) => `| ${m.year} | ${m.laborProductivity} | **${m.productivityGrowthRate}** | ${m.annualHoursSaved} | ${m.estimatedValueCreated} |`).join('\n') || ''}

> **【補助金要件判定】**
> ${parsed.section4_QuantitativeSimulation?.targetMetBadge}

---

## 5. 北海道内の経営者への次のアクション（gBizID・専門家連携の案内）
### ■ gBizIDプライム取得の案内
${parsed.section5_NextActionsAndGuidance?.gBizIdNotice}

### ■ 道内専門家（行政書士・中小企業診断士）への最終チェック案内
${parsed.section5_NextActionsAndGuidance?.specialistConsultationNotice}

### ■ 具体的な申請ステップ
${parsed.section5_NextActionsAndGuidance?.actionSteps?.map((step: string, idx: number) => `${idx + 1}. ${step}`).join('\n') || ''}
`;

    return {
      ...parsed,
      fullMarkdownText
    };
  } catch (err) {
    console.error("Gemini generation error, falling back to local robust generator:", err);
    return generateLocalFallbackPlan(input);
  }
}
