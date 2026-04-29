export type Severity = "LOW" | "MODERATE" | "HIGH";

export type AICondition = {
  name: string;
  probability: number;
  description: string;
};

export type AnalyzeResult = {
  red_flag: boolean;
  possible_conditions: AICondition[];
  severity: "low" | "moderate" | "high";
  immediate_actions: string;
  precautions: string;
  specialist: string;
  disclaimer: string;
};

export const RED_FLAG_PATTERNS: Array<{ keywords: string[]; label: string }> = [
  { keywords: ["chest pain", "sweating"], label: "Chest pain with sweating" },
  { keywords: ["chest pain", "left arm"], label: "Chest pain with arm pain" },
  { keywords: ["chest pain", "jaw"], label: "Chest pain with jaw pain" },
  { keywords: ["cannot breathe"], label: "Breathing emergency" },
  { keywords: ["can't breathe"], label: "Breathing emergency" },
  { keywords: ["not breathing"], label: "Breathing emergency" },
  { keywords: ["facial drooping"], label: "Possible stroke" },
  { keywords: ["face drooping"], label: "Possible stroke" },
  { keywords: ["face is drooping"], label: "Possible stroke" },
  { keywords: ["arm weakness", "speech"], label: "Possible stroke" },
  { keywords: ["sudden confusion"], label: "Possible stroke" },
  { keywords: ["severe bleeding"], label: "Severe bleeding" },
  { keywords: ["unresponsive"], label: "Loss of consciousness" },
  { keywords: ["unconscious"], label: "Loss of consciousness" },
  { keywords: ["passed out"], label: "Loss of consciousness" },
  { keywords: ["seizure"], label: "Seizure" },
  { keywords: ["heart attack"], label: "Cardiac emergency" },
  { keywords: ["stroke"], label: "Possible stroke" },
  { keywords: ["suicidal"], label: "Mental health emergency" },
  { keywords: ["overdose"], label: "Overdose emergency" },
  { keywords: ["anaphylaxis"], label: "Severe allergic reaction" },
  { keywords: ["throat closing"], label: "Severe allergic reaction" },
  { keywords: ["throat is closing"], label: "Severe allergic reaction" },
];

export type Condition = {
  condition: string;
  subtext: string;
  severity: Severity;
  confidence: number;
  description: string;
  tags: string[];
};

export type Precaution = {
  icon: string;
  title: string;
  desc: string;
};

export const SYMPTOM_CATEGORIES = [
  {
    label: "Head & Throat",
    symptoms: ["Headache", "Sore throat", "Runny nose", "Nasal congestion", "Ear pain", "Jaw pain"],
  },
  {
    label: "Chest & Breathing",
    symptoms: ["Cough", "Shortness of breath", "Chest tightness", "Wheezing", "Chest pain"],
  },
  {
    label: "Body & Temperature",
    symptoms: ["Fever", "Chills", "Fatigue", "Body ache", "Night sweats", "Weakness"],
  },
  {
    label: "Digestive",
    symptoms: ["Nausea", "Vomiting", "Diarrhea", "Stomach pain", "Loss of appetite", "Bloating"],
  },
  {
    label: "Other",
    symptoms: ["Dizziness", "Rash", "Swollen lymph nodes", "Joint pain", "Vision changes"],
  },
] as const;

export const DURATION_OPTIONS = [
  "Less than 24 hours",
  "1–3 days",
  "4–7 days",
  "More than a week",
] as const;

export const DUMMY_RESULTS: Condition[] = [
  {
    condition: "Common Cold",
    subtext: "Viral upper respiratory infection",
    severity: "LOW",
    confidence: 87,
    description:
      "This condition matches your reported symptoms. It is a common illness that typically resolves with rest and adequate hydration within 7–10 days.",
    tags: ["Self-care at home", "Monitor symptoms"],
  },
  {
    condition: "Influenza",
    subtext: "Seasonal flu virus",
    severity: "MODERATE",
    confidence: 62,
    description:
      "Influenza causes more severe symptoms than a common cold. Rest, fluids, and over-the-counter antivirals may help. Consider seeing a doctor if symptoms are severe.",
    tags: ["Antiviral treatment", "Doctor visit if severe"],
  },
  {
    condition: "Strep Throat",
    subtext: "Bacterial throat infection",
    severity: "MODERATE",
    confidence: 34,
    description:
      "Strep throat is a bacterial infection requiring antibiotic treatment. See a healthcare provider for a rapid strep test and prescription if confirmed.",
    tags: ["Antibiotic treatment", "See a doctor"],
  },
];

export const DUMMY_PRECAUTIONS: Precaution[] = [
  {
    icon: "droplets",
    title: "Rest and stay hydrated",
    desc: "Aim for 8+ glasses of water daily. Avoid strenuous activity until fever resolves.",
  },
  {
    icon: "thermometer",
    title: "Monitor your temperature",
    desc: "Check every 4–6 hours. Seek care if temperature exceeds 103°F (39.4°C).",
  },
  {
    icon: "shield",
    title: "Avoid spreading illness",
    desc: "Stay home if possible. Wash hands frequently and wear a mask in shared spaces.",
  },
  {
    icon: "pill",
    title: "Use over-the-counter relief",
    desc: "Ibuprofen or acetaminophen can reduce fever and body aches. Follow dosage instructions.",
  },
  {
    icon: "phone",
    title: "When to call a doctor",
    desc: "If symptoms worsen after 5 days, breathing becomes difficult, or you develop a rash.",
  },
];

export const EMERGENCY_SYMPTOMS = [
  "Severe chest pain or pressure",
  "Difficulty breathing or shortness of breath at rest",
  "Sudden confusion or altered mental state",
  "Face drooping, arm weakness, or speech difficulty (stroke signs)",
  "High fever above 104°F (40°C) that does not respond to medication",
];

export const DUMMY_SPECIALIST = {
  role: "General Physician",
  timing: "within 48 hours",
  note: "Based on your symptoms, a general physician visit is recommended if symptoms persist or worsen.",
};
