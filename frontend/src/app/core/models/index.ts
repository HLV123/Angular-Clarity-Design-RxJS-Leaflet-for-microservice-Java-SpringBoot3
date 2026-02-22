// ============================================================
// CORE MODELS - Tương thích Backend Java DTOs
// REST API / WebSocket STOMP / Kafka Events
// ============================================================

// ── Auth & User (Module 11) ──────────────────────────────────
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface JwtPayload {
  sub: string;
  roles: UserRole[];
  permissions: string[];
  department: string;
  hospitalId: string;
  exp: number;
}

export type UserRole = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'PHARMACIST' | 'PATIENT' | 'DATA_ANALYST';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  roles: UserRole[];
  department: string;
  hospitalId: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
  lastLogin?: string;
  mfaEnabled: boolean;
}

// ── Patient (Module 1) ───────────────────────────────────────
export type PatientStatus = 'Nội trú' | 'Ngoại trú' | 'Khẩn cấp' | 'Ra viện';
export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender: 'Nam' | 'Nữ';
  idCard: string;
  phone: string;
  email: string;
  address: string;
  bloodType: string;
  insuranceId: string;
  status: PatientStatus;
  riskLevel: RiskLevel;
  riskScore: number;
  assignedDoctor: string;
  ward: string;
  bed: string;
  allergies: string[];
  chronicConditions: string[];
  familyHistory: string[];
  createdAt: string;
  updatedAt: string;
}

// ── Vital Signs (Module 2) ───────────────────────────────────
export interface VitalSign {
  patientId: string;
  timestamp: string;
  deviceId: string;
  vitals: {
    heartRate: number;
    systolicBP: number;
    diastolicBP: number;
    spO2: number;
    temperature: number;
    respiratoryRate: number;
    bloodGlucose?: number;
  };
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  anomalyScore: number;
}

// STOMP message format: /topic/patient/{id}/vitals
export interface VitalStreamMessage {
  patientId: string;
  timestamp: string;
  deviceId: string;
  vitals: VitalSign['vitals'];
  status: string;
  anomalyScore: number;
}

// ── EHR (Module 3) ──────────────────────────────────────────
export interface EHRRecord {
  patientId: string;
  notes: ClinicalNote[];
  diagnoses: Diagnosis[];
  labResults: LabResult[];
  imaging: MedicalImage[];
  procedures: Procedure[];
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  type: 'SOAP' | 'PROGRESS' | 'DISCHARGE';
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  createdAt: string;
  updatedAt: string;
  locked: boolean;
}

export interface Diagnosis {
  id: string;
  patientId: string;
  icd10Code: string;
  description: string;
  type: 'primary' | 'secondary' | 'suspected';
  diagnosedAt: string;
  doctorName: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  testName: string;
  category: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
  orderedBy: string;
  resultDate: string;
}

export interface MedicalImage {
  id: string;
  patientId: string;
  type: 'X-Ray' | 'CT' | 'MRI' | 'Ultrasound';
  bodyPart: string;
  fileUrl: string;
  thumbnailUrl: string;
  uploadedAt: string;
  reportSummary: string;
}

export interface Procedure {
  id: string;
  name: string;
  performedBy: string;
  date: string;
  result: string;
}

// ── AI Diagnosis (Module 4) ──────────────────────────────────
export interface SymptomCheckRequest {
  patientId?: string;
  symptoms: string[];
  vitalSigns?: string[];
  ageGroup: string;
  gender: string;
}

export interface DiagnosisSuggestion {
  icd10Code: string;
  diseaseName: string;
  probability: number;
  rationale: string;
}

export interface DiagnosisResponse {
  suggestions: DiagnosisSuggestion[];
  confidence: number;
  recommendation: string;
  triageLevel: TriageLevel;
}

export type TriageLevel = 'IMMEDIATE' | 'VERY_URGENT' | 'URGENT' | 'STANDARD' | 'NON_URGENT';

// ── Appointment (Module 5) ───────────────────────────────────
export type AppointmentStatus = 'Đã đặt' | 'Đã check-in' | 'Chờ khám' | 'Đang khám' | 'Đã hoàn thành' | 'Đã hủy';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  scheduledAt: string;
  department: string;
  reason: string;
  status: AppointmentStatus;
  queueNumber?: number;
  estimatedWait?: number;
  checkedInAt?: string;
  startedAt?: string;
  completedAt?: string;
}

// STOMP: /topic/queue/{doctorId}
export interface QueueUpdate {
  doctorId: string;
  currentNumber: number;
  waitingCount: number;
  avgWaitMinutes: number;
}

// ── Medication (Module 6) ────────────────────────────────────
export interface Drug {
  id: string;
  code: string;
  name: string;
  genericName: string;
  activeIngredient: string;
  atcCode: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  category: 'OTC' | 'PRESCRIPTION' | 'CONTROLLED';
  stockQuantity: number;
  contraindications: string[];
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  items: PrescriptionItem[];
  status: 'PENDING' | 'VERIFIED' | 'DISPENSED' | 'CANCELLED';
  createdAt: string;
  verifiedBy?: string;
  dispensedAt?: string;
}

export interface PrescriptionItem {
  drugId: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
}

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'MAJOR' | 'MODERATE' | 'MINOR';
  mechanism: string;
  clinicalEffect: string;
}

// ── Analytics (Module 7) ─────────────────────────────────────
export interface HospitalOverview {
  totalInpatients: number;
  totalOutpatients: number;
  bedOccupancyRate: number;
  emergencyCases: number;
  criticalAlerts: number;
  avgWaitTime: number;
  todayVisits: number;
  readmissionRate: number;
  satisfactionScore: number;
}

// STOMP: /topic/analytics/hospital-overview
export interface AnalyticsUpdate {
  timestamp: string;
  metrics: HospitalOverview;
}

// ── Alert & Notification (Module 8) ──────────────────────────
export type AlertLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'UNACKNOWLEDGED' | 'ACKNOWLEDGED' | 'RESOLVED' | 'SENT';

export interface Alert {
  id: string;
  timestamp: string;
  level: AlertLevel;
  type: string;
  message: string;
  patientId?: string;
  patientName?: string;
  status: AlertStatus;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

// STOMP: /topic/patient/{id}/alerts
export interface AlertStreamMessage {
  alertId: string;
  level: AlertLevel;
  type: string;
  message: string;
  patientId: string;
}

// ── IoT Device (Module 9) ────────────────────────────────────
export type DeviceType = 'Wearable' | 'Bedside Monitor' | 'Infusion Pump' | 'Ventilator' | 'Glucose Meter' | 'BP Monitor' | 'ECG Machine';
export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'WARNING' | 'ERROR';

export interface IoTDevice {
  id: string;
  type: DeviceType;
  model: string;
  firmwareVersion: string;
  assignedPatientId?: string;
  assignedPatientName?: string;
  ward: string;
  status: DeviceStatus;
  batteryLevel: number;
  dataQuality: number;
  lastSyncAt: string;
}

// ── Knowledge Graph (Module 10) ──────────────────────────────
export interface GraphNode {
  id: string;
  label: string;
  type: 'Patient' | 'Doctor' | 'Disease' | 'Symptom' | 'Drug' | 'RiskFactor' | 'Procedure' | 'Hospital';
  properties: Record<string, any>;
}

export interface GraphRelationship {
  source: string;
  target: string;
  type: string;
  properties: Record<string, any>;
}

export interface GraphQueryResult {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
}

// ── Search (Module 12) ──────────────────────────────────────
export interface SearchResult {
  type: 'patient' | 'drug' | 'icd10' | 'doctor' | 'ehr';
  id: string;
  title: string;
  subtitle: string;
  highlight?: string;
  score: number;
}

// ── Storage (Module 13) ─────────────────────────────────────
export interface StorageFile {
  id: string;
  fileName: string;
  fileType: string;
  mimeType: string;
  size: number;
  patientId: string;
  patientName: string;
  uploadedBy: string;
  uploadedAt: string;
  url?: string;
  bucket: string;
}

// ── GIS (Module 14) ──────────────────────────────────────────
export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface HospitalLocation {
  id: string;
  name: string;
  address: string;
  location: GeoPoint;
  beds: number;
  specialties: string[];
  type: 'hospital' | 'clinic' | 'pharmacy';
}

export interface DiseaseHeatmapData {
  location: GeoPoint;
  intensity: number;
  disease?: string;
}

// ── Sidebar Navigation ──────────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  section: string;
  roles?: UserRole[];
}
