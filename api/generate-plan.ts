import { GoogleGenAI, Type } from "@google/genai";
import type { UserProfileInput } from "../types.js";
import { generateLocalPlan } from "../services/localPlanGenerator.js";

interface ApiRequest {
  method?: string;
  body: UserProfileInput;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (data: any) => void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const input: UserProfileInput = req.body;
  if (!input || !input.industry || !input.primaryChallenge) {
    return res.status(400).json({ error: "業種と現在の悩みは必須項目です。" });
  }

  const baseline = generateLocalPlan(input);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "PLACEHOLDER_API_KEY") {
    // APIキーがない場合は高品質ローカルプランを返却
    return res.status(200).json({ success: true, plan: baseline });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `あなたは北海道の中小企業・小規模事業者向け補助金申請準備を支援するアシスタントです。採択・受給を保証せず、不明な制度要件は断定しないでください。
簡易診断で選ばれた「${baseline.recommendedSubsidy}」向けに、具体的で説得力のある事業計画書ドラフトを作成してください。

【事業者情報】
- 業種: ${input.industry}
- 所在地: ${input.location}
- 導入したい生成AIツール: ${input.aiTool}
- 現場の切実な悩み・課題: ${input.primaryChallenge}
- 従業員数: ${input.employeeCount || "5名"}
- 月間間接業務想定: ${input.monthlyAdminHoursPerPerson || 35}時間/人
- 想定時間単価: ${input.hourlyLaborCost || 3200}円/時
- 会社規模: ${input.companySize || "わからない"}
- 主な投資目的: ${input.investmentPurpose || "まだ決まっていない"}
- 予定予算: ${input.estimatedBudget || "未定"}

【計画書に必ず含める審査ポイント】
1. なぜその生成AIツールが必要なのか（北海道特有の広域移動・冬期積雪・労働力不足の文脈を反映）
2. 具体的にどの業務フローをどう改革するのか（3ステップ）
3. 浮いた時間をどの「本業（高付加価値業務）」へシフトさせるのか
4. 定量目標（3年後に年率3%以上の労働生産性向上を達成するシミュレーション）
5. 次のアクション（必要書類、公式公募要領の確認、道内公的窓口・専門家への相談）`,
      config: {
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
                challengeSummary: { type: Type.STRING },
              },
              required: ["industry", "location", "aiTool", "challengeSummary"],
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
                      estimatedValueCreated: { type: Type.STRING },
                    },
                    required: ["year", "laborProductivity", "productivityGrowthRate", "annualHoursSaved", "estimatedValueCreated"],
                  },
                },
                targetMetBadge: { type: Type.STRING },
              },
              required: ["explanation", "calculationBasis", "metricsTable", "targetMetBadge"],
            },
            section5_NextActionsAndGuidance: {
              type: Type.OBJECT,
              properties: {
                gBizIdNotice: { type: Type.STRING },
                specialistConsultationNotice: { type: Type.STRING },
                actionSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["gBizIdNotice", "specialistConsultationNotice", "actionSteps"],
            },
          },
          required: [
            "title",
            "recommendedSubsidy",
            "overview",
            "section1_ManagementChallenges",
            "section2_AiImplementationAndSteps",
            "section3_QualitativeEffectsAndShift",
            "section4_QuantitativeSimulation",
            "section5_NextActionsAndGuidance",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const fullMarkdownText = `# ${parsed.title}\n\n---\n\n## 1. 経営課題\n${parsed.section1_ManagementChallenges}\n\n---\n\n## 2. 活用方法\n${parsed.section2_AiImplementationAndSteps}\n\n---\n\n## 3. 効果\n${parsed.section3_QualitativeEffectsAndShift}\n\n---\n\n## 4. 数値目標\n${parsed.section4_QuantitativeSimulation?.explanation}\n\n${parsed.section4_QuantitativeSimulation?.calculationBasis}\n\n---\n\n## 5. 次のアクション\n${parsed.section5_NextActionsAndGuidance?.gBizIdNotice}\n${parsed.section5_NextActionsAndGuidance?.specialistConsultationNotice}`;

    return res.status(200).json({
      success: true,
      plan: {
        ...baseline,
        ...parsed,
        recommendedSubsidy: baseline.recommendedSubsidy,
        subsidyMatches: baseline.subsidyMatches,
        diagnosisNotice: baseline.diagnosisNotice,
        fullMarkdownText: `${fullMarkdownText}\n\n---\n\n> この文書は申請準備用のドラフトです。採択・受給を保証するものではありません。提出前に最新の公式公募要領と専門家による確認を行ってください。`,
      },
    });
  } catch (error) {
    console.warn("Gemini error in Vercel function, falling back to local generator:", error);
    return res.status(200).json({ success: true, plan: baseline });
  }
}
