export interface UserProfileInput {
  industry: string;
  location: string;
  aiTool: string;
  primaryChallenge: string;
  employeeCount?: string;
  monthlyAdminHoursPerPerson?: number;
  hourlyLaborCost?: number;
  companySize?: "小規模事業者" | "中小企業" | "わからない";
  investmentPurpose?: "AI・IT導入" | "販路開拓・集客" | "設備・省力化" | "まだ決まっていない";
  estimatedBudget?: string;
}

export interface SubsidyMatch {
  name: string;
  score: number;
  status: "有力候補" | "確認が必要" | "対象外の可能性";
  reason: string;
  checks: string[];
}

export interface QuantitativeMetric {
  year: string;
  laborProductivity: string;
  productivityGrowthRate: string;
  annualHoursSaved: string;
  estimatedValueCreated: string;
}

export interface BusinessPlanResult {
  title: string;
  recommendedSubsidy: string;
  subsidyMatches: SubsidyMatch[];
  diagnosisNotice: string;
  overview: {
    industry: string;
    location: string;
    aiTool: string;
    challengeSummary: string;
  };
  section1_ManagementChallenges: string;
  section2_AiImplementationAndSteps: string;
  section3_QualitativeEffectsAndShift: string;
  section4_QuantitativeSimulation: {
    explanation: string;
    calculationBasis: string;
    metricsTable: QuantitativeMetric[];
    targetMetBadge: string;
  };
  section5_NextActionsAndGuidance: {
    gBizIdNotice: string;
    specialistConsultationNotice: string;
    actionSteps: string[];
  };
  fullMarkdownText: string;
}

export interface GeneratePlanResponse {
  success: boolean;
  plan?: BusinessPlanResult;
  error?: string;
}
