// Analytics mock data for Chart.js visualizations
export const MONTHLY_VISITS = [
  { month: 'T1', visits: 3200 }, { month: 'T2', visits: 2800 },
  { month: 'T3', visits: 3500 }, { month: 'T4', visits: 3100 },
  { month: 'T5', visits: 3400 }, { month: 'T6', visits: 3800 },
  { month: 'T7', visits: 4100 }, { month: 'T8', visits: 3900 },
  { month: 'T9', visits: 4200 }, { month: 'T10', visits: 4500 },
  { month: 'T11', visits: 4100 }, { month: 'T12', visits: 4680 },
];

export const TOP_DISEASES = [
  { name: 'Tăng huyết áp (I10)', count: 892 },
  { name: 'Tiểu đường type 2 (E11)', count: 756 },
  { name: 'Viêm phổi (J18)', count: 534 },
  { name: 'Đau thắt ngực (I20)', count: 489 },
  { name: 'COPD (J44)', count: 412 },
  { name: 'Suy tim (I50)', count: 387 },
  { name: 'Viêm khớp (M13)', count: 345 },
  { name: 'Hen phế quản (J45)', count: 298 },
  { name: 'Rung nhĩ (I48)', count: 267 },
  { name: 'Suy thận (N18)', count: 234 },
];

export const BED_OCCUPANCY = [
  { dept: 'ICU', used: 18, total: 20 },
  { dept: 'Tim mạch', used: 35, total: 45 },
  { dept: 'Nội', used: 28, total: 40 },
  { dept: 'Ngoại', used: 22, total: 35 },
  { dept: 'Sản', used: 15, total: 25 },
  { dept: 'Nhi', used: 12, total: 20 },
  { dept: 'Lão khoa', used: 18, total: 25 },
];

export const DOCTOR_PERFORMANCE = [
  { name: 'BS. Nguyễn Văn Duy', dept: 'Tim mạch', visits: 42, avgTime: 18, rating: 4.8, accuracy: 94 },
  { name: 'BS. Trần Minh Hùng', dept: 'Nội', visits: 38, avgTime: 22, rating: 4.6, accuracy: 91 },
  { name: 'BS. Lê Thị Hương', dept: 'Sản phụ khoa', visits: 35, avgTime: 25, rating: 4.9, accuracy: 96 },
  { name: 'BS. Phạm Quốc Bảo', dept: 'Ngoại', visits: 30, avgTime: 20, rating: 4.5, accuracy: 89 },
  { name: 'BS. Hoàng Thị Lan', dept: 'Nhi', visits: 28, avgTime: 15, rating: 4.7, accuracy: 93 },
];

export const WEEKLY_REVENUE = [
  { day: 'T2', amount: 125 }, { day: 'T3', amount: 142 },
  { day: 'T4', amount: 138 }, { day: 'T5', amount: 155 },
  { day: 'T6', amount: 148 }, { day: 'T7', amount: 98 },
  { day: 'CN', amount: 65 },
];

export const PATIENT_HEATMAP_DATA = [
  { lat: 21.028, lng: 105.854, intensity: 0.9 },
  { lat: 21.013, lng: 105.820, intensity: 0.7 },
  { lat: 21.005, lng: 105.840, intensity: 0.85 },
  { lat: 21.035, lng: 105.835, intensity: 0.6 },
  { lat: 21.020, lng: 105.860, intensity: 0.75 },
  { lat: 21.000, lng: 105.850, intensity: 0.95 },
  { lat: 21.040, lng: 105.845, intensity: 0.5 },
  { lat: 21.010, lng: 105.830, intensity: 0.65 },
  { lat: 21.025, lng: 105.815, intensity: 0.8 },
  { lat: 21.018, lng: 105.870, intensity: 0.55 },
  { lat: 21.032, lng: 105.825, intensity: 0.7 },
  { lat: 21.008, lng: 105.855, intensity: 0.88 },
];

export const EHR_TIMELINE_EVENTS = [
  { date: '2024-10-15T09:00:00Z', type: 'note', title: 'SOAP Note', desc: 'Đau thắt ngực không ổn định', doctor: 'BS. Nguyễn Văn Duy', icon: 'fa-note-sticky', color: '#1574ea' },
  { date: '2024-10-15T08:30:00Z', type: 'lab', title: 'Xét nghiệm Troponin I', desc: '0.08 ng/mL (Bất thường)', doctor: 'BS. Nguyễn Văn Duy', icon: 'fa-flask', color: '#ef4444' },
  { date: '2024-10-14T15:00:00Z', type: 'imaging', title: 'X-quang ngực', desc: 'Bóng tim to, tỉ lệ tim/ngực 0.6', doctor: 'KTV. Nguyễn Hoàng', icon: 'fa-x-ray', color: '#8b5cf6' },
  { date: '2024-10-14T14:00:00Z', type: 'lab', title: 'Cholesterol toàn phần', desc: '6.2 mmol/L (Cao)', doctor: 'BS. Nguyễn Văn Duy', icon: 'fa-flask', color: '#f59e0b' },
  { date: '2024-10-10T10:00:00Z', type: 'diagnosis', title: 'Chẩn đoán I20.9', desc: 'Đau thắt ngực, không xác định', doctor: 'BS. Nguyễn Văn Duy', icon: 'fa-stethoscope', color: '#10b981' },
  { date: '2024-09-20T10:00:00Z', type: 'admission', title: 'Nhập viện', desc: 'Nhập ICU - Bed 12', doctor: 'BS. Nguyễn Văn Duy', icon: 'fa-hospital', color: '#64748b' },
];

export const MOCK_MEDICAL_IMAGES = [
  { id: 'IMG-001', patientId: 'P-0042', type: 'X-Ray', bodyPart: 'Ngực', fileUrl: '', thumbnailUrl: '', uploadedAt: '2024-10-14T15:00:00Z', reportSummary: 'Bóng tim to, tỉ lệ tim/ngực 0.6. Trung thất không lệch. Phổi trong.' },
  { id: 'IMG-002', patientId: 'P-0044', type: 'CT', bodyPart: 'Sọ não', fileUrl: '', thumbnailUrl: '', uploadedAt: '2024-10-14T15:00:00Z', reportSummary: 'Không thấy xuất huyết. Hệ thống não thất bình thường.' },
];

export const AUDIT_LOG_DATA = [
  { id: 'AUD-001', userId: 'USR-002', userName: 'BS. Nguyễn Văn Duy', action: 'VIEW_EHR', resource: 'P-0042', timestamp: '2024-10-15T09:00:00Z', ip: '192.168.1.45' },
  { id: 'AUD-002', userId: 'USR-001', userName: 'Nguyễn Quản Trị', action: 'CREATE_USER', resource: 'USR-009', timestamp: '2024-10-15T08:30:00Z', ip: '192.168.1.10' },
  { id: 'AUD-003', userId: 'USR-003', userName: 'BS. Trần Minh Hùng', action: 'CREATE_PRESCRIPTION', resource: 'RX-20241015-002', timestamp: '2024-10-15T08:00:00Z', ip: '192.168.1.51' },
  { id: 'AUD-004', userId: 'USR-006', userName: 'DS. Phạm Thanh Hà', action: 'DISPENSE_DRUG', resource: 'RX-20241015-001', timestamp: '2024-10-15T09:30:00Z', ip: '192.168.1.60' },
  { id: 'AUD-005', userId: 'USR-005', userName: 'ĐD. Trần Thị Mai', action: 'ACK_ALERT', resource: 'ALR-003', timestamp: '2024-10-15T08:16:00Z', ip: '192.168.1.55' },
];
