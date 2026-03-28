export type ApplicationState =
  | "NOVA"
  | "FORMALNI_KONTROLA"
  | "DOPLNENI"
  | "VECNE_HODNOCENI"
  | "PRIPRAVENO_K_ROZHODNUTI"
  | "SCHVALENO"
  | "ZAMITNUTO"
  | "ARCHIVOVANO";

export const STATE_LABELS: Record<ApplicationState, string> = {
  NOVA: "Nov\u00e1",
  FORMALNI_KONTROLA: "Form\u00e1ln\u00ed kontrola",
  DOPLNENI: "Dopln\u011bn\u00ed",
  VECNE_HODNOCENI: "V\u011bcn\u00e9 hodnocen\u00ed",
  PRIPRAVENO_K_ROZHODNUTI: "P\u0159ipraveno k rozhodnut\u00ed",
  SCHVALENO: "Schv\u00e1leno",
  ZAMITNUTO: "Zam\u00edtnuto",
  ARCHIVOVANO: "Archivov\u00e1no",
};

export const STATE_COLORS: Record<ApplicationState, string> = {
  NOVA: "bg-blue-100 text-blue-800",
  FORMALNI_KONTROLA: "bg-yellow-100 text-yellow-800",
  DOPLNENI: "bg-orange-100 text-orange-800",
  VECNE_HODNOCENI: "bg-purple-100 text-purple-800",
  PRIPRAVENO_K_ROZHODNUTI: "bg-indigo-100 text-indigo-800",
  SCHVALENO: "bg-green-100 text-green-800",
  ZAMITNUTO: "bg-red-100 text-red-800",
  ARCHIVOVANO: "bg-gray-100 text-gray-800",
};

export const STATE_TRANSITIONS: Record<ApplicationState, ApplicationState[]> = {
  NOVA: ["FORMALNI_KONTROLA"],
  FORMALNI_KONTROLA: ["DOPLNENI", "VECNE_HODNOCENI", "ZAMITNUTO"],
  DOPLNENI: ["FORMALNI_KONTROLA"],
  VECNE_HODNOCENI: ["PRIPRAVENO_K_ROZHODNUTI", "DOPLNENI", "ZAMITNUTO"],
  PRIPRAVENO_K_ROZHODNUTI: ["SCHVALENO", "ZAMITNUTO"],
  SCHVALENO: ["ARCHIVOVANO"],
  ZAMITNUTO: ["ARCHIVOVANO"],
  ARCHIVOVANO: [],
};

export interface Subject {
  ico: string;
  name: string;
  address: string;
  legalForm: string;
  aresVerified: boolean;
  active: boolean;
}

export interface Application {
  id: string;
  jid: string; // eSSL document ID
  title: string;
  programName: string;
  state: ApplicationState;
  subject: Subject;
  requestedAmount: number;
  approvedAmount: number | null;
  referent: string;
  createdAt: string;
  updatedAt: string;
  deadline: string;
  slaRemainingDays: number;
  slaPaused: boolean;
  notes: string;
}

export interface BudgetProgram {
  id: string;
  name: string;
  year: number;
  totalAllocation: number;
  approved: number;
  reserved: number;
  remaining: number;
  applicationsCount: number;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entityType: "APPLICATION" | "BUDGET" | "SYSTEM";
  entityId: string;
  detail: string;
  hashChain: string;
  previousHash: string;
}

export interface DashboardStats {
  totalApplications: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  totalRequested: number;
  totalApproved: number;
  avgProcessingDays: number;
  slaBreaches: number;
}
