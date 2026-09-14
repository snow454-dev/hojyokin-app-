export interface UserProfileInput {
  industry: string;
  location: string;
  aiTool: string;
  primaryChallenge: string;
  employeeCount?: string;
  monthlyAdminHoursPerPerson?: number;
  hourlyLaborCost?: number;
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
