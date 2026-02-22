import {
  Patient, User, Appointment, Alert, Drug, Prescription,
  IoTDevice, LabResult, Diagnosis, ClinicalNote, MedicalImage,
  StorageFile, HospitalLocation, DiagnosisSuggestion, DrugInteraction,
  GraphNode, GraphRelationship, VitalSign, NavItem
} from '../models';

// ═══════════════════════════════════════════════════════════════
//  MOCK USERS  ─ JWT auth simulation (Module 11)
// ═══════════════════════════════════════════════════════════════
export const MOCK_USERS: Record<string, { password: string; user: User }> = {
  admin: {
    password: 'admin123',
    user: {
      id: 'USR-001', username: 'admin', fullName: 'Nguyễn Quản Trị',
      email: 'admin@shms.vn', phone: '0901000001', roles: ['ADMIN'],
      department: 'IT', hospitalId: 'HN-001', status: 'ACTIVE',
      lastLogin: '2024-10-15T08:00:00Z', mfaEnabled: true,
      avatar: 'QT'
    }
  },
  doctor: {
    password: 'doctor123',
    user: {
      id: 'USR-002', username: 'doctor', fullName: 'BS. Nguyễn Văn Duy',
      email: 'duy@shms.vn', phone: '0901000002', roles: ['DOCTOR'],
      department: 'Tim mạch', hospitalId: 'HN-001', status: 'ACTIVE',
      lastLogin: '2024-10-15T07:45:00Z', mfaEnabled: true,
      avatar: 'DY'
    }
  },
  nurse: {
    password: 'nurse123',
    user: {
      id: 'USR-005', username: 'nurse', fullName: 'ĐD. Trần Thị Mai',
      email: 'mai@shms.vn', phone: '0901000005', roles: ['NURSE'],
      department: 'Hồi sức', hospitalId: 'HN-001', status: 'ACTIVE',
      lastLogin: '2024-10-15T06:00:00Z', mfaEnabled: false,
      avatar: 'TM'
    }
  },
  pharmacist: {
    password: 'pharma123',
    user: {
      id: 'USR-006', username: 'pharmacist', fullName: 'DS. Phạm Thanh Hà',
      email: 'ha@shms.vn', phone: '0901000006', roles: ['PHARMACIST'],
      department: 'Dược', hospitalId: 'HN-001', status: 'ACTIVE',
      lastLogin: '2024-10-15T07:30:00Z', mfaEnabled: false,
      avatar: 'TH'
    }
  },
  patient: {
    password: 'patient123',
    user: {
      id: 'USR-008', username: 'patient', fullName: 'Lê Hoàng Nam',
      email: 'nam@gmail.com', phone: '0901000008', roles: ['PATIENT'],
      department: '', hospitalId: 'HN-001', status: 'ACTIVE',
      lastLogin: '2024-10-14T20:00:00Z', mfaEnabled: false,
      avatar: 'LN'
    }
  },
  analyst: {
    password: 'analyst123',
    user: {
      id: 'USR-007', username: 'analyst', fullName: 'Vũ Minh Tuấn',
      email: 'tuan@shms.vn', phone: '0901000007', roles: ['DATA_ANALYST'],
      department: 'Phân tích', hospitalId: 'HN-001', status: 'ACTIVE',
      lastLogin: '2024-10-14T17:00:00Z', mfaEnabled: false,
      avatar: 'MT'
    }
  }
};

export const MOCK_SYSTEM_USERS: User[] = Object.values(MOCK_USERS).map(u => u.user).concat([
  {
    id: 'USR-003', username: 'doctor2', fullName: 'BS. Trần Minh Hùng',
    email: 'hung@shms.vn', phone: '0901000003', roles: ['DOCTOR'],
    department: 'Nội', hospitalId: 'HN-001', status: 'ACTIVE',
    lastLogin: '2024-10-15T07:50:00Z', mfaEnabled: true, avatar: 'MH'
  },
  {
    id: 'USR-004', username: 'doctor3', fullName: 'BS. Lê Thị Hương',
    email: 'huong@shms.vn', phone: '0901000004', roles: ['DOCTOR'],
    department: 'Sản phụ khoa', hospitalId: 'HN-001', status: 'ACTIVE',
    lastLogin: '2024-10-15T08:10:00Z', mfaEnabled: false, avatar: 'LH'
  }
]);

// ═══════════════════════════════════════════════════════════════
//  PATIENTS  ─ Module 1 (/api/v1/patients)
// ═══════════════════════════════════════════════════════════════
export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'P-0042', fullName: 'Nguyễn Văn An', dateOfBirth: '1966-03-15', age: 58,
    gender: 'Nam', idCard: '012345678901', phone: '0901234567',
    email: 'an.nguyen@gmail.com', address: '15 Trần Phú, Ba Đình, Hà Nội',
    bloodType: 'A+', insuranceId: 'DN-4012345678', status: 'Nội trú',
    riskLevel: 'Critical', riskScore: 0.92, assignedDoctor: 'BS. Nguyễn Văn Duy',
    ward: 'ICU', bed: '12', allergies: ['Penicillin'],
    chronicConditions: ['Đau thắt ngực', 'Tăng huyết áp'],
    familyHistory: ['Cha: Nhồi máu cơ tim'], createdAt: '2024-09-20T10:00:00Z',
    updatedAt: '2024-10-15T08:00:00Z'
  },
  {
    id: 'P-0043', fullName: 'Trần Thị Bích', dateOfBirth: '1979-07-22', age: 45,
    gender: 'Nữ', idCard: '012345678902', phone: '0912345678',
    email: 'bich.tran@gmail.com', address: '8 Lê Duẩn, Hoàn Kiếm, Hà Nội',
    bloodType: 'O+', insuranceId: 'HN-3012345679', status: 'Nội trú',
    riskLevel: 'High', riskScore: 0.75, assignedDoctor: 'BS. Trần Minh Hùng',
    ward: 'Nội tiết', bed: '5', allergies: [],
    chronicConditions: ['Tiểu đường type 2', 'Rối loạn lipid máu'],
    familyHistory: ['Mẹ: Tiểu đường'], createdAt: '2024-08-15T09:00:00Z',
    updatedAt: '2024-10-15T07:30:00Z'
  },
  {
    id: 'P-0044', fullName: 'Lê Văn Cường', dateOfBirth: '1952-11-08', age: 72,
    gender: 'Nam', idCard: '012345678903', phone: '0923456789',
    email: 'cuong.le@gmail.com', address: '22 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    bloodType: 'B+', insuranceId: 'HN-2012345680', status: 'Nội trú',
    riskLevel: 'Critical', riskScore: 0.95, assignedDoctor: 'BS. Nguyễn Văn Duy',
    ward: 'ICU', bed: '3', allergies: ['Sulfonamide'],
    chronicConditions: ['Suy tim độ III', 'COPD', 'Suy thận mạn'],
    familyHistory: [], createdAt: '2024-10-10T14:00:00Z',
    updatedAt: '2024-10-15T06:00:00Z'
  },
  {
    id: 'P-0045', fullName: 'Phạm Thị Dung', dateOfBirth: '1990-05-20', age: 34,
    gender: 'Nữ', idCard: '012345678904', phone: '0934567890',
    email: 'dung.pham@gmail.com', address: '5 Cầu Giấy, Cầu Giấy, Hà Nội',
    bloodType: 'AB+', insuranceId: 'SG-5012345681', status: 'Ngoại trú',
    riskLevel: 'Low', riskScore: 0.15, assignedDoctor: 'BS. Lê Thị Hương',
    ward: '-', bed: '-', allergies: [],
    chronicConditions: [], familyHistory: [],
    createdAt: '2024-10-01T08:00:00Z', updatedAt: '2024-10-14T16:00:00Z'
  },
  {
    id: 'P-0046', fullName: 'Hoàng Minh Đức', dateOfBirth: '1963-09-12', age: 61,
    gender: 'Nam', idCard: '012345678905', phone: '0945678901',
    email: 'duc.hoang@gmail.com', address: '10 Đội Cấn, Ba Đình, Hà Nội',
    bloodType: 'O-', insuranceId: 'DN-4012345682', status: 'Khẩn cấp',
    riskLevel: 'High', riskScore: 0.85, assignedDoctor: 'BS. Trần Minh Hùng',
    ward: 'Cấp cứu', bed: '1', allergies: ['Ibuprofen'],
    chronicConditions: ['Nhồi máu cơ tim cấp'],
    familyHistory: ['Anh: Đột quỵ'], createdAt: '2024-10-15T03:00:00Z',
    updatedAt: '2024-10-15T08:30:00Z'
  },
  {
    id: 'P-0047', fullName: 'Võ Thị Hoa', dateOfBirth: '1996-12-03', age: 28,
    gender: 'Nữ', idCard: '012345678906', phone: '0956789012',
    email: 'hoa.vo@gmail.com', address: '18 Giải Phóng, Hai Bà Trưng, Hà Nội',
    bloodType: 'A-', insuranceId: 'HN-3012345683', status: 'Ngoại trú',
    riskLevel: 'Low', riskScore: 0.20, assignedDoctor: 'BS. Lê Thị Hương',
    ward: '-', bed: '-', allergies: [],
    chronicConditions: ['Thai 32 tuần'], familyHistory: [],
    createdAt: '2024-06-15T10:00:00Z', updatedAt: '2024-10-14T14:00:00Z'
  },
  {
    id: 'P-0048', fullName: 'Đặng Văn Giang', dateOfBirth: '1944-01-28', age: 80,
    gender: 'Nam', idCard: '012345678907', phone: '0967890123',
    email: 'giang.dang@gmail.com', address: '30 Hoàng Hoa Thám, Tây Hồ, Hà Nội',
    bloodType: 'B-', insuranceId: 'HN-2012345684', status: 'Nội trú',
    riskLevel: 'High', riskScore: 0.78, assignedDoctor: 'BS. Nguyễn Văn Duy',
    ward: 'Lão khoa', bed: '8', allergies: ['Aspirin', 'Morphine'],
    chronicConditions: ['Alzheimer giai đoạn 2', 'Loãng xương'],
    familyHistory: ['Mẹ: Alzheimer'], createdAt: '2024-09-01T09:00:00Z',
    updatedAt: '2024-10-15T07:00:00Z'
  },
  {
    id: 'P-0049', fullName: 'Ngô Thị Hằng', dateOfBirth: '1974-08-15', age: 50,
    gender: 'Nữ', idCard: '012345678908', phone: '0978901234',
    email: 'hang.ngo@gmail.com', address: '7 Nguyễn Du, Hoàn Kiếm, Hà Nội',
    bloodType: 'AB-', insuranceId: 'SG-5012345685', status: 'Ra viện',
    riskLevel: 'Medium', riskScore: 0.45, assignedDoctor: 'BS. Trần Minh Hùng',
    ward: '-', bed: '-', allergies: [],
    chronicConditions: ['Viêm khớp dạng thấp'],
    familyHistory: [], createdAt: '2024-07-20T08:00:00Z',
    updatedAt: '2024-10-13T16:00:00Z'
  },
  {
    id: 'P-0050', fullName: 'Bùi Quang Khải', dateOfBirth: '2009-04-10', age: 15,
    gender: 'Nam', idCard: '012345678909', phone: '0989012345',
    email: 'khai.bui@gmail.com', address: '12 Láng Hạ, Đống Đa, Hà Nội',
    bloodType: 'O+', insuranceId: 'HN-3012345686', status: 'Ngoại trú',
    riskLevel: 'Low', riskScore: 0.12, assignedDoctor: 'BS. Lê Thị Hương',
    ward: '-', bed: '-', allergies: [],
    chronicConditions: ['Hen phế quản'],
    familyHistory: ['Bố: Hen phế quản'], createdAt: '2024-05-10T10:00:00Z',
    updatedAt: '2024-10-12T09:00:00Z'
  },
  {
    id: 'P-0051', fullName: 'Trịnh Thị Lan', dateOfBirth: '1957-06-25', age: 67,
    gender: 'Nữ', idCard: '012345678910', phone: '0990123456',
    email: 'lan.trinh@gmail.com', address: '25 Kim Mã, Ba Đình, Hà Nội',
    bloodType: 'A+', insuranceId: 'DN-4012345687', status: 'Nội trú',
    riskLevel: 'Medium', riskScore: 0.55, assignedDoctor: 'BS. Nguyễn Văn Duy',
    ward: 'Tim mạch', bed: '14', allergies: ['Codein'],
    chronicConditions: ['Rung nhĩ', 'Suy thận độ II'],
    familyHistory: ['Mẹ: Rung nhĩ'], createdAt: '2024-10-05T11:00:00Z',
    updatedAt: '2024-10-15T06:30:00Z'
  }
];

// ═══════════════════════════════════════════════════════════════
//  APPOINTMENTS  ─ Module 5
// ═══════════════════════════════════════════════════════════════
export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'APT-001', patientId: 'P-0042', patientName: 'Nguyễn Văn An', doctorId: 'USR-002', doctorName: 'BS. Nguyễn Văn Duy', scheduledAt: '2024-10-15T08:00:00Z', department: 'Tim mạch', reason: 'Tái khám đau thắt ngực', status: 'Đang khám', queueNumber: 1 },
  { id: 'APT-002', patientId: 'P-0043', patientName: 'Trần Thị Bích', doctorId: 'USR-003', doctorName: 'BS. Trần Minh Hùng', scheduledAt: '2024-10-15T08:30:00Z', department: 'Nội tiết', reason: 'Kiểm tra đường huyết', status: 'Chờ khám', queueNumber: 2 },
  { id: 'APT-003', patientId: 'P-0045', patientName: 'Phạm Thị Dung', doctorId: 'USR-004', doctorName: 'BS. Lê Thị Hương', scheduledAt: '2024-10-15T09:00:00Z', department: 'Sản phụ khoa', reason: 'Khám thai định kỳ', status: 'Chờ khám', queueNumber: 3 },
  { id: 'APT-004', patientId: 'P-0046', patientName: 'Hoàng Minh Đức', doctorId: 'USR-003', doctorName: 'BS. Trần Minh Hùng', scheduledAt: '2024-10-15T09:30:00Z', department: 'Cấp cứu', reason: 'Nhồi máu cơ tim', status: 'Đang khám', queueNumber: 1 },
  { id: 'APT-005', patientId: 'P-0047', patientName: 'Võ Thị Hoa', doctorId: 'USR-004', doctorName: 'BS. Lê Thị Hương', scheduledAt: '2024-10-15T10:00:00Z', department: 'Sản phụ khoa', reason: 'Siêu âm thai', status: 'Chờ khám', queueNumber: 4 },
  { id: 'APT-006', patientId: 'P-0050', patientName: 'Bùi Quang Khải', doctorId: 'USR-004', doctorName: 'BS. Lê Thị Hương', scheduledAt: '2024-10-15T10:30:00Z', department: 'Nhi', reason: 'Khám hen phế quản', status: 'Đã check-in', queueNumber: 5 },
  { id: 'APT-007', patientId: 'P-0051', patientName: 'Trịnh Thị Lan', doctorId: 'USR-002', doctorName: 'BS. Nguyễn Văn Duy', scheduledAt: '2024-10-15T11:00:00Z', department: 'Tim mạch', reason: 'Theo dõi rung nhĩ', status: 'Chờ khám', queueNumber: 6 },
  { id: 'APT-008', patientId: 'P-0044', patientName: 'Lê Văn Cường', doctorId: 'USR-002', doctorName: 'BS. Nguyễn Văn Duy', scheduledAt: '2024-10-15T14:00:00Z', department: 'Tim mạch', reason: 'Đánh giá suy tim', status: 'Đã hoàn thành', queueNumber: 0 },
  { id: 'APT-009', patientId: 'P-0049', patientName: 'Ngô Thị Hằng', doctorId: 'USR-003', doctorName: 'BS. Trần Minh Hùng', scheduledAt: '2024-10-15T14:30:00Z', department: 'Nội', reason: 'Tái khám viêm khớp', status: 'Đã hoàn thành', queueNumber: 0 },
];

// ═══════════════════════════════════════════════════════════════
//  ALERTS  ─ Module 8 (Kafka → WebSocket)
// ═══════════════════════════════════════════════════════════════
export const MOCK_ALERTS: Alert[] = [
  { id: 'ALR-001', timestamp: '2024-10-15T08:28:00Z', level: 'CRITICAL', type: 'Sinh hiệu nguy kịch', message: 'SpO2 giảm đột ngột (88%) - Nguyễn Văn An', patientId: 'P-0042', patientName: 'Nguyễn Văn An', status: 'UNACKNOWLEDGED' },
  { id: 'ALR-002', timestamp: '2024-10-15T08:23:00Z', level: 'HIGH', type: 'Tương tác thuốc', message: 'Warfarin + Aspirin (MAJOR) - Đơn BS. Hùng', patientId: 'P-0048', patientName: 'Đặng Văn Giang', status: 'UNACKNOWLEDGED' },
  { id: 'ALR-003', timestamp: '2024-10-15T08:16:00Z', level: 'CRITICAL', type: 'Sinh hiệu nguy kịch', message: 'Nhịp tim > 140 bpm - ICU Bed 3', patientId: 'P-0044', patientName: 'Lê Văn Cường', status: 'ACKNOWLEDGED', acknowledgedBy: 'ĐD. Trần Thị Mai' },
  { id: 'ALR-004', timestamp: '2024-10-15T07:58:00Z', level: 'MEDIUM', type: 'Tuân thủ thuốc', message: 'Bỏ thuốc 3 ngày liên tiếp', patientId: 'P-0043', patientName: 'Trần Thị Bích', status: 'ACKNOWLEDGED' },
  { id: 'ALR-005', timestamp: '2024-10-15T07:15:00Z', level: 'HIGH', type: 'Xét nghiệm bất thường', message: 'Glucose máu: 15.2 mmol/L (cao)', patientId: 'P-0043', patientName: 'Trần Thị Bích', status: 'RESOLVED' },
  { id: 'ALR-006', timestamp: '2024-10-15T06:00:00Z', level: 'LOW', type: 'Nhắc lịch hẹn', message: 'Nhắc lịch tái khám ngày mai', patientId: 'P-0045', patientName: 'Phạm Thị Dung', status: 'SENT' },
  { id: 'ALR-007', timestamp: '2024-10-15T05:30:00Z', level: 'MEDIUM', type: 'Giường bệnh', message: 'Khoa ICU: 90% giường đã sử dụng', status: 'ACKNOWLEDGED' },
  { id: 'ALR-008', timestamp: '2024-10-15T04:45:00Z', level: 'CRITICAL', type: 'Sinh hiệu nguy kịch', message: 'Huyết áp tâm thu 180 mmHg', patientId: 'P-0046', patientName: 'Hoàng Minh Đức', status: 'RESOLVED' },
];

// ═══════════════════════════════════════════════════════════════
//  DRUGS & PRESCRIPTIONS  ─ Module 6
// ═══════════════════════════════════════════════════════════════
export const MOCK_DRUGS: Drug[] = [
  { id: 'DRG-001', code: 'AMX500', name: 'Amoxicillin 500mg', genericName: 'Amoxicillin', activeIngredient: 'Amoxicillin trihydrate', atcCode: 'J01CA04', dosageForm: 'Viên nang', strength: '500mg', manufacturer: 'Sanofi', category: 'PRESCRIPTION', stockQuantity: 2450, contraindications: ['Dị ứng Penicillin'] },
  { id: 'DRG-002', code: 'PCM500', name: 'Paracetamol 500mg', genericName: 'Paracetamol', activeIngredient: 'Paracetamol', atcCode: 'N02BE01', dosageForm: 'Viên nén', strength: '500mg', manufacturer: 'Sanofi', category: 'OTC', stockQuantity: 8200, contraindications: [] },
  { id: 'DRG-003', code: 'MTF850', name: 'Metformin 850mg', genericName: 'Metformin', activeIngredient: 'Metformin HCl', atcCode: 'A10BA02', dosageForm: 'Viên nén', strength: '850mg', manufacturer: 'Merck', category: 'PRESCRIPTION', stockQuantity: 3100, contraindications: ['Suy thận nặng'] },
  { id: 'DRG-004', code: 'WRF5', name: 'Warfarin 5mg', genericName: 'Warfarin', activeIngredient: 'Warfarin sodium', atcCode: 'B01AA03', dosageForm: 'Viên nén', strength: '5mg', manufacturer: 'Bristol-Myers', category: 'CONTROLLED', stockQuantity: 890, contraindications: ['Xuất huyết não', 'Thai kỳ'] },
  { id: 'DRG-005', code: 'ASP100', name: 'Aspirin 100mg', genericName: 'Aspirin', activeIngredient: 'Acid acetylsalicylic', atcCode: 'B01AC06', dosageForm: 'Viên nén', strength: '100mg', manufacturer: 'Bayer', category: 'OTC', stockQuantity: 5600, contraindications: ['Loét dạ dày'] },
  { id: 'DRG-006', code: 'ATV20', name: 'Atorvastatin 20mg', genericName: 'Atorvastatin', activeIngredient: 'Atorvastatin calcium', atcCode: 'C10AA05', dosageForm: 'Viên nén', strength: '20mg', manufacturer: 'Pfizer', category: 'PRESCRIPTION', stockQuantity: 4200, contraindications: ['Bệnh gan nặng'] },
  { id: 'DRG-007', code: 'OMP20', name: 'Omeprazole 20mg', genericName: 'Omeprazole', activeIngredient: 'Omeprazole', atcCode: 'A02BC01', dosageForm: 'Viên nang', strength: '20mg', manufacturer: 'AstraZeneca', category: 'PRESCRIPTION', stockQuantity: 6100, contraindications: [] },
  { id: 'DRG-008', code: 'INS-L', name: 'Insulin Lantus', genericName: 'Insulin Glargine', activeIngredient: 'Insulin glargine', atcCode: 'A10AE04', dosageForm: 'Bút tiêm', strength: '100IU/mL', manufacturer: 'Sanofi', category: 'CONTROLLED', stockQuantity: 340, contraindications: ['Hạ đường huyết'] },
];

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  { id: 'RX-20241015-001', patientId: 'P-0042', patientName: 'Nguyễn Văn An', doctorId: 'USR-002', doctorName: 'BS. Nguyễn Văn Duy', status: 'DISPENSED', createdAt: '2024-10-15T09:00:00Z', verifiedBy: 'DS. Phạm Thanh Hà', dispensedAt: '2024-10-15T09:30:00Z',
    items: [
      { drugId: 'DRG-006', drugName: 'Atorvastatin 20mg', dosage: '1 viên', frequency: '1 lần/ngày (tối)', duration: '30 ngày', quantity: 30, instructions: 'Uống sau ăn tối' },
      { drugId: 'DRG-007', drugName: 'Omeprazole 20mg', dosage: '1 viên', frequency: '1 lần/ngày (sáng)', duration: '14 ngày', quantity: 14, instructions: 'Uống trước ăn 30 phút' },
      { drugId: 'DRG-005', drugName: 'Aspirin 100mg', dosage: '1 viên', frequency: '1 lần/ngày', duration: '30 ngày', quantity: 30, instructions: 'Uống sau ăn' },
    ]
  },
  { id: 'RX-20241015-002', patientId: 'P-0043', patientName: 'Trần Thị Bích', doctorId: 'USR-003', doctorName: 'BS. Trần Minh Hùng', status: 'PENDING', createdAt: '2024-10-15T08:00:00Z',
    items: [
      { drugId: 'DRG-003', drugName: 'Metformin 850mg', dosage: '1 viên', frequency: '2 lần/ngày', duration: '30 ngày', quantity: 60, instructions: 'Uống trong bữa ăn' },
      { drugId: 'DRG-008', drugName: 'Insulin Lantus', dosage: '10 IU', frequency: '1 lần/ngày (tối)', duration: '30 ngày', quantity: 1, instructions: 'Tiêm dưới da vùng bụng' },
    ]
  },
  { id: 'RX-20241014-003', patientId: 'P-0044', patientName: 'Lê Văn Cường', doctorId: 'USR-002', doctorName: 'BS. Nguyễn Văn Duy', status: 'DISPENSED', createdAt: '2024-10-14T14:00:00Z', verifiedBy: 'DS. Phạm Thanh Hà', dispensedAt: '2024-10-14T15:00:00Z',
    items: [
      { drugId: 'DRG-004', drugName: 'Warfarin 5mg', dosage: '1 viên', frequency: '1 lần/ngày', duration: '30 ngày', quantity: 30, instructions: 'Uống cùng giờ mỗi ngày, kiểm tra INR thường xuyên' },
    ]
  },
];

export const MOCK_DRUG_INTERACTIONS: DrugInteraction[] = [
  { drug1: 'Warfarin', drug2: 'Aspirin', severity: 'MAJOR', mechanism: 'Tăng nguy cơ xuất huyết do ức chế kết tập tiểu cầu + kháng vitamin K', clinicalEffect: 'Tăng nguy cơ xuất huyết tiêu hóa và xuất huyết nội sọ' },
  { drug1: 'Warfarin', drug2: 'Omeprazole', severity: 'MODERATE', mechanism: 'Ức chế CYP2C19 làm tăng nồng độ Warfarin', clinicalEffect: 'Tăng INR, cần theo dõi chặt chẽ' },
  { drug1: 'Metformin', drug2: 'Insulin', severity: 'MODERATE', mechanism: 'Tăng cường tác dụng hạ đường huyết', clinicalEffect: 'Nguy cơ hạ đường huyết, cần điều chỉnh liều' },
];

// ═══════════════════════════════════════════════════════════════
//  IoT DEVICES  ─ Module 9
// ═══════════════════════════════════════════════════════════════
export const MOCK_DEVICES: IoTDevice[] = [
  { id: 'IOT-WR-001', type: 'Wearable', model: 'Philips BX100', firmwareVersion: '3.2.1', assignedPatientId: 'P-0042', assignedPatientName: 'Nguyễn Văn An', ward: 'ICU-12', status: 'ONLINE', batteryLevel: 82, dataQuality: 96, lastSyncAt: '2024-10-15T08:30:00Z' },
  { id: 'IOT-BM-002', type: 'Bedside Monitor', model: 'GE CARESCAPE B650', firmwareVersion: '5.1.0', assignedPatientId: 'P-0044', assignedPatientName: 'Lê Văn Cường', ward: 'ICU-3', status: 'ONLINE', batteryLevel: 100, dataQuality: 99, lastSyncAt: '2024-10-15T08:30:00Z' },
  { id: 'IOT-WR-003', type: 'Wearable', model: 'Philips BX100', firmwareVersion: '3.2.1', assignedPatientId: 'P-0043', assignedPatientName: 'Trần Thị Bích', ward: 'Nội-5', status: 'ONLINE', batteryLevel: 45, dataQuality: 88, lastSyncAt: '2024-10-15T08:29:00Z' },
  { id: 'IOT-BP-004', type: 'BP Monitor', model: 'Omron HEM-7600T', firmwareVersion: '2.0.3', assignedPatientId: 'P-0051', assignedPatientName: 'Trịnh Thị Lan', ward: 'Tim mạch-14', status: 'ONLINE', batteryLevel: 67, dataQuality: 94, lastSyncAt: '2024-10-15T08:25:00Z' },
  { id: 'IOT-GL-005', type: 'Glucose Meter', model: 'Accu-Chek Guide', firmwareVersion: '1.5.2', assignedPatientId: 'P-0043', assignedPatientName: 'Trần Thị Bích', ward: 'Nội-5', status: 'WARNING', batteryLevel: 12, dataQuality: 72, lastSyncAt: '2024-10-15T08:20:00Z' },
  { id: 'IOT-BM-006', type: 'Bedside Monitor', model: 'Mindray BeneVision N22', firmwareVersion: '4.3.0', assignedPatientId: 'P-0048', assignedPatientName: 'Đặng Văn Giang', ward: 'Lão khoa-8', status: 'ONLINE', batteryLevel: 100, dataQuality: 97, lastSyncAt: '2024-10-15T08:30:00Z' },
  { id: 'IOT-EC-007', type: 'ECG Machine', model: 'Mortara ELI 280', firmwareVersion: '2.1.0', ward: 'Tim mạch', status: 'OFFLINE', batteryLevel: 0, dataQuality: 0, lastSyncAt: '2024-10-14T16:00:00Z' },
  { id: 'IOT-VN-008', type: 'Ventilator', model: 'Hamilton C6', firmwareVersion: '6.0.1', assignedPatientId: 'P-0044', assignedPatientName: 'Lê Văn Cường', ward: 'ICU-3', status: 'ONLINE', batteryLevel: 100, dataQuality: 100, lastSyncAt: '2024-10-15T08:30:00Z' },
];

// ═══════════════════════════════════════════════════════════════
//  EHR DATA  ─ Module 3
// ═══════════════════════════════════════════════════════════════
export const MOCK_DIAGNOSES: Diagnosis[] = [
  { id: 'DX-001', patientId: 'P-0042', icd10Code: 'I20.9', description: 'Đau thắt ngực, không xác định', type: 'primary', diagnosedAt: '2024-09-20', doctorName: 'BS. Nguyễn Văn Duy' },
  { id: 'DX-002', patientId: 'P-0042', icd10Code: 'I10', description: 'Tăng huyết áp vô căn (nguyên phát)', type: 'secondary', diagnosedAt: '2024-09-20', doctorName: 'BS. Nguyễn Văn Duy' },
  { id: 'DX-003', patientId: 'P-0043', icd10Code: 'E11.9', description: 'Đái tháo đường type 2 không biến chứng', type: 'primary', diagnosedAt: '2024-08-15', doctorName: 'BS. Trần Minh Hùng' },
  { id: 'DX-004', patientId: 'P-0044', icd10Code: 'I50.9', description: 'Suy tim, không xác định', type: 'primary', diagnosedAt: '2024-10-10', doctorName: 'BS. Nguyễn Văn Duy' },
  { id: 'DX-005', patientId: 'P-0044', icd10Code: 'J44.1', description: 'COPD với đợt cấp', type: 'secondary', diagnosedAt: '2024-10-10', doctorName: 'BS. Nguyễn Văn Duy' },
];

export const MOCK_LAB_RESULTS: LabResult[] = [
  { id: 'LAB-001', patientId: 'P-0042', testName: 'Troponin I', category: 'Tim mạch', value: '0.08', unit: 'ng/mL', referenceRange: '< 0.04', status: 'Abnormal', orderedBy: 'BS. Nguyễn Văn Duy', resultDate: '2024-10-15' },
  { id: 'LAB-002', patientId: 'P-0042', testName: 'Cholesterol toàn phần', category: 'Sinh hóa', value: '6.2', unit: 'mmol/L', referenceRange: '< 5.2', status: 'Abnormal', orderedBy: 'BS. Nguyễn Văn Duy', resultDate: '2024-10-14' },
  { id: 'LAB-003', patientId: 'P-0043', testName: 'HbA1c', category: 'Nội tiết', value: '8.5', unit: '%', referenceRange: '< 7.0', status: 'Abnormal', orderedBy: 'BS. Trần Minh Hùng', resultDate: '2024-10-15' },
  { id: 'LAB-004', patientId: 'P-0043', testName: 'Glucose máu đói', category: 'Sinh hóa', value: '15.2', unit: 'mmol/L', referenceRange: '3.9 - 7.0', status: 'Critical', orderedBy: 'BS. Trần Minh Hùng', resultDate: '2024-10-15' },
  { id: 'LAB-005', patientId: 'P-0044', testName: 'BNP', category: 'Tim mạch', value: '1250', unit: 'pg/mL', referenceRange: '< 100', status: 'Critical', orderedBy: 'BS. Nguyễn Văn Duy', resultDate: '2024-10-14' },
  { id: 'LAB-006', patientId: 'P-0042', testName: 'Công thức máu (WBC)', category: 'Huyết học', value: '7.5', unit: 'x10⁹/L', referenceRange: '4.0 - 11.0', status: 'Normal', orderedBy: 'BS. Nguyễn Văn Duy', resultDate: '2024-10-14' },
];

export const MOCK_CLINICAL_NOTES: ClinicalNote[] = [
  {
    id: 'NOTE-001', patientId: 'P-0042', doctorId: 'USR-002', doctorName: 'BS. Nguyễn Văn Duy',
    type: 'SOAP', subjective: 'Bệnh nhân khai đau tức ngực trái khi gắng sức từ 1 tuần nay, kèm khó thở',
    objective: 'Mạch 92 bpm, HA 145/90, SpO2 97%. ECG: ST chênh xuống DII, DIII, aVF',
    assessment: 'I20.9 - Đau thắt ngực không ổn định. Nghi ngờ hẹp mạch vành',
    plan: 'Chỉ định chụp CT mạch vành, kê Aspirin 100mg, Atorvastatin 20mg. Theo dõi ICU',
    createdAt: '2024-10-15T09:00:00Z', updatedAt: '2024-10-15T09:00:00Z', locked: false
  },
  {
    id: 'NOTE-002', patientId: 'P-0043', doctorId: 'USR-003', doctorName: 'BS. Trần Minh Hùng',
    type: 'PROGRESS', subjective: 'Bệnh nhân mệt mỏi, khát nước nhiều, tiểu nhiều',
    objective: 'Glucose máu đói: 15.2 mmol/L, HbA1c: 8.5%',
    assessment: 'E11.9 - Tiểu đường type 2 kiểm soát kém',
    plan: 'Tăng liều Metformin 850mg x 2/ngày, thêm Insulin Lantus 10IU tối. Tái khám 2 tuần',
    createdAt: '2024-10-15T08:30:00Z', updatedAt: '2024-10-15T08:30:00Z', locked: false
  }
];

// ═══════════════════════════════════════════════════════════════
//  STORAGE FILES  ─ Module 13 (Ceph S3)
// ═══════════════════════════════════════════════════════════════
export const MOCK_STORAGE_FILES: StorageFile[] = [
  { id: 'FILE-001', fileName: 'xray_chest_P0042_20241015.jpg', fileType: 'X-Ray', mimeType: 'image/jpeg', size: 4200000, patientId: 'P-0042', patientName: 'Nguyễn Văn An', uploadedBy: 'BS. Nguyễn Văn Duy', uploadedAt: '2024-10-15T10:00:00Z', bucket: 'medical-imaging/xray' },
  { id: 'FILE-002', fileName: 'ct_brain_P0044_20241014.dcm', fileType: 'CT (DICOM)', mimeType: 'application/dicom', size: 128000000, patientId: 'P-0044', patientName: 'Lê Văn Cường', uploadedBy: 'KTV. Nguyễn Hoàng', uploadedAt: '2024-10-14T15:00:00Z', bucket: 'medical-imaging/ct' },
  { id: 'FILE-003', fileName: 'lab_cbc_P0043_20241015.pdf', fileType: 'Lab PDF', mimeType: 'application/pdf', size: 800000, patientId: 'P-0043', patientName: 'Trần Thị Bích', uploadedBy: 'KTV. Trần Văn Nam', uploadedAt: '2024-10-15T07:00:00Z', bucket: 'lab-reports' },
  { id: 'FILE-004', fileName: 'mri_spine_P0048_20241013.dcm', fileType: 'MRI (DICOM)', mimeType: 'application/dicom', size: 256000000, patientId: 'P-0048', patientName: 'Đặng Văn Giang', uploadedBy: 'KTV. Lê Hải', uploadedAt: '2024-10-13T11:00:00Z', bucket: 'medical-imaging/mri' },
  { id: 'FILE-005', fileName: 'ecg_report_P0042_20241015.pdf', fileType: 'ECG Report', mimeType: 'application/pdf', size: 1100000, patientId: 'P-0042', patientName: 'Nguyễn Văn An', uploadedBy: 'BS. Nguyễn Văn Duy', uploadedAt: '2024-10-15T09:30:00Z', bucket: 'lab-reports' },
  { id: 'FILE-006', fileName: 'ultrasound_P0047_20241012.mp4', fileType: 'Siêu âm', mimeType: 'video/mp4', size: 45000000, patientId: 'P-0047', patientName: 'Võ Thị Hoa', uploadedBy: 'BS. Lê Thị Hương', uploadedAt: '2024-10-12T14:00:00Z', bucket: 'medical-imaging/ultrasound' },
];

// ═══════════════════════════════════════════════════════════════
//  GIS DATA  ─ Module 14 (Leaflet)
// ═══════════════════════════════════════════════════════════════
export const MOCK_HOSPITALS: HospitalLocation[] = [
  { id: 'H-001', name: 'BV Bạch Mai', address: '78 Giải Phóng, Đống Đa, Hà Nội', location: { lat: 21.0000, lng: 105.8400 }, beds: 1800, specialties: ['Tim mạch', 'Thần kinh', 'Ung bướu'], type: 'hospital' },
  { id: 'H-002', name: 'BV Việt Đức', address: '40 Tràng Thi, Hoàn Kiếm, Hà Nội', location: { lat: 21.0260, lng: 105.8440 }, beds: 1200, specialties: ['Ngoại khoa', 'Chấn thương'], type: 'hospital' },
  { id: 'H-003', name: 'BV Nhi TƯ', address: '18/879 La Thành, Đống Đa, Hà Nội', location: { lat: 21.0190, lng: 105.8200 }, beds: 800, specialties: ['Nhi khoa', 'Sơ sinh'], type: 'hospital' },
  { id: 'H-004', name: 'BV Phụ sản HN', address: '929 La Thành, Ba Đình, Hà Nội', location: { lat: 21.0220, lng: 105.8150 }, beds: 600, specialties: ['Sản phụ khoa'], type: 'hospital' },
  { id: 'H-005', name: 'BV Thanh Nhàn', address: '42 Thanh Nhàn, Hai Bà Trưng, Hà Nội', location: { lat: 21.0050, lng: 105.8600 }, beds: 500, specialties: ['Nội', 'Ngoại'], type: 'hospital' },
  { id: 'H-006', name: 'PK Đa khoa Hồng Ngọc', address: '55 Yên Ninh, Ba Đình, Hà Nội', location: { lat: 21.0380, lng: 105.8400 }, beds: 100, specialties: ['Đa khoa'], type: 'clinic' },
];

// ═══════════════════════════════════════════════════════════════
//  AI DIAGNOSIS MOCK  ─ Module 4
// ═══════════════════════════════════════════════════════════════
export const MOCK_AI_SUGGESTIONS: Record<string, DiagnosisSuggestion[]> = {
  'default': [
    { icd10Code: 'I20.9', diseaseName: 'Đau thắt ngực, không xác định', probability: 0.89, rationale: 'Triệu chứng đau ngực trái khi gắng sức, khó thở phù hợp với đau thắt ngực' },
    { icd10Code: 'I21.9', diseaseName: 'Nhồi máu cơ tim cấp, không xác định', probability: 0.45, rationale: 'Cần loại trừ NMCT dựa trên ECG và Troponin' },
    { icd10Code: 'I10', diseaseName: 'Tăng huyết áp vô căn', probability: 0.72, rationale: 'Huyết áp ghi nhận cao, tiền sử tăng HA' },
  ],
  'respiratory': [
    { icd10Code: 'J18.9', diseaseName: 'Viêm phổi, không xác định', probability: 0.82, rationale: 'Ho, sốt, khó thở và ran phổi gợi ý viêm phổi' },
    { icd10Code: 'J44.1', diseaseName: 'COPD đợt cấp', probability: 0.56, rationale: 'Tiền sử COPD kèm khó thở tăng cần xem xét đợt cấp' },
  ]
};

// ═══════════════════════════════════════════════════════════════
//  KNOWLEDGE GRAPH  ─ Module 10 (Neo4j)
// ═══════════════════════════════════════════════════════════════
export const MOCK_GRAPH_NODES: GraphNode[] = [
  { id: 'n1', label: 'Đau thắt ngực (I20.9)', type: 'Disease', properties: { icd10: 'I20.9' } },
  { id: 'n2', label: 'Tăng huyết áp (I10)', type: 'Disease', properties: { icd10: 'I10' } },
  { id: 'n3', label: 'Nhồi máu cơ tim (I21)', type: 'Disease', properties: { icd10: 'I21' } },
  { id: 'n4', label: 'Aspirin', type: 'Drug', properties: { atc: 'B01AC06' } },
  { id: 'n5', label: 'Warfarin', type: 'Drug', properties: { atc: 'B01AA03' } },
  { id: 'n6', label: 'Atorvastatin', type: 'Drug', properties: { atc: 'C10AA05' } },
  { id: 'n7', label: 'Đau ngực', type: 'Symptom', properties: {} },
  { id: 'n8', label: 'Khó thở', type: 'Symptom', properties: {} },
  { id: 'n9', label: 'Hút thuốc', type: 'RiskFactor', properties: {} },
  { id: 'n10', label: 'Béo phì', type: 'RiskFactor', properties: {} },
  { id: 'n11', label: 'Nguyễn Văn An', type: 'Patient', properties: { id: 'P-0042' } },
  { id: 'n12', label: 'BS. Nguyễn Văn Duy', type: 'Doctor', properties: { specialty: 'Tim mạch' } },
];

export const MOCK_GRAPH_RELATIONSHIPS: GraphRelationship[] = [
  { source: 'n1', target: 'n7', type: 'PRESENTS_WITH', properties: {} },
  { source: 'n1', target: 'n8', type: 'PRESENTS_WITH', properties: {} },
  { source: 'n3', target: 'n7', type: 'PRESENTS_WITH', properties: {} },
  { source: 'n1', target: 'n4', type: 'TREATED_WITH', properties: {} },
  { source: 'n1', target: 'n6', type: 'TREATED_WITH', properties: {} },
  { source: 'n3', target: 'n5', type: 'TREATED_WITH', properties: {} },
  { source: 'n4', target: 'n5', type: 'INTERACTS_WITH', properties: { severity: 'MAJOR' } },
  { source: 'n1', target: 'n9', type: 'RISK_FACTOR', properties: {} },
  { source: 'n1', target: 'n10', type: 'RISK_FACTOR', properties: {} },
  { source: 'n11', target: 'n1', type: 'HAS_DIAGNOSIS', properties: {} },
  { source: 'n11', target: 'n2', type: 'HAS_DIAGNOSIS', properties: {} },
  { source: 'n11', target: 'n12', type: 'TREATED_BY', properties: {} },
  { source: 'n12', target: 'n1', type: 'SPECIALIZES_IN', properties: {} },
];

// ═══════════════════════════════════════════════════════════════
//  NAVIGATION CONFIG
// ═══════════════════════════════════════════════════════════════
export const NAV_ITEMS: NavItem[] = [
  // === Tổng quan ===
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-line', route: '/dashboard', section: 'Tổng quan', roles: ['ADMIN', 'DOCTOR', 'NURSE', 'PHARMACIST', 'DATA_ANALYST', 'PATIENT'] },

  // === Lâm sàng — Bác sĩ, Điều dưỡng, Admin ===
  { id: 'patients', label: 'Quản lý Bệnh nhân', icon: 'fa-solid fa-hospital-user', route: '/patients', section: 'Lâm sàng', roles: ['ADMIN', 'DOCTOR', 'NURSE'] },
  { id: 'monitoring', label: 'Giám sát Realtime', icon: 'fa-solid fa-heart-pulse', route: '/monitoring', section: 'Lâm sàng', roles: ['ADMIN', 'DOCTOR', 'NURSE'] },
  { id: 'ehr', label: 'Hồ sơ Điện tử (EHR)', icon: 'fa-solid fa-folder-open', route: '/ehr', section: 'Lâm sàng', roles: ['ADMIN', 'DOCTOR', 'NURSE'] },
  { id: 'appointments', label: 'Lịch hẹn & Hàng đợi', icon: 'fa-solid fa-calendar-check', route: '/appointments', section: 'Lâm sàng', roles: ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT'] },

  // === AI & Dữ liệu — Bác sĩ, Admin, Analyst ===
  { id: 'ai-diagnosis', label: 'AI Chẩn đoán', icon: 'fa-solid fa-brain', route: '/ai-diagnosis', section: 'AI & Dữ liệu', roles: ['ADMIN', 'DOCTOR'] },
  { id: 'knowledge-graph', label: 'Knowledge Graph', icon: 'fa-solid fa-circle-nodes', route: '/knowledge-graph', section: 'AI & Dữ liệu', roles: ['ADMIN', 'DOCTOR', 'DATA_ANALYST'] },
  { id: 'analytics', label: 'Phân tích & Báo cáo', icon: 'fa-solid fa-chart-pie', route: '/analytics', section: 'AI & Dữ liệu', roles: ['ADMIN', 'DATA_ANALYST'] },

  // === Dược & Thiết bị — Dược sĩ, Bác sĩ, Admin, Nurse ===
  { id: 'medications', label: 'Thuốc & Đơn thuốc', icon: 'fa-solid fa-pills', route: '/medications', section: 'Dược & Thiết bị', roles: ['ADMIN', 'DOCTOR', 'PHARMACIST', 'NURSE'] },
  { id: 'devices', label: 'Thiết bị IoT', icon: 'fa-solid fa-microchip', route: '/devices', section: 'Dược & Thiết bị', roles: ['ADMIN', 'NURSE', 'DOCTOR'] },

  // === Hệ thống — phân quyền chặt ===
  { id: 'alerts', label: 'Cảnh báo & Thông báo', icon: 'fa-solid fa-bell', route: '/alerts', section: 'Hệ thống', roles: ['ADMIN', 'DOCTOR', 'NURSE'] },
  { id: 'storage', label: 'Lưu trữ Y tế', icon: 'fa-solid fa-cloud-arrow-up', route: '/storage', section: 'Hệ thống', roles: ['ADMIN', 'DOCTOR', 'NURSE'] },
  { id: 'gis', label: 'Bản đồ Dịch tễ', icon: 'fa-solid fa-map-location-dot', route: '/gis', section: 'Hệ thống', roles: ['ADMIN', 'DATA_ANALYST', 'DOCTOR'] },
  { id: 'users', label: 'Người dùng & RBAC', icon: 'fa-solid fa-users-gear', route: '/users', section: 'Hệ thống', roles: ['ADMIN'] },
  { id: 'search', label: 'Tìm kiếm nâng cao', icon: 'fa-solid fa-magnifying-glass', route: '/search', section: 'Hệ thống', roles: ['ADMIN', 'DOCTOR', 'NURSE', 'PHARMACIST'] },
];

// Additional AI mock data
export const MOCK_AI_RESPIRATORY: any = {
  suggestions: [
    { icd10Code: 'J18.9', diseaseName: 'Viêm phổi, không xác định', probability: 0.82, rationale: 'Ho, sốt, khó thở và ran phổi gợi ý viêm phổi' },
    { icd10Code: 'J44.1', diseaseName: 'COPD đợt cấp', probability: 0.56, rationale: 'Tiền sử COPD kèm khó thở tăng cần xem xét đợt cấp' },
    { icd10Code: 'J06.9', diseaseName: 'Nhiễm trùng hô hấp trên cấp', probability: 0.34, rationale: 'Triệu chứng ho, sốt nhẹ phù hợp' },
  ],
  confidence: 0.78,
  recommendation: 'Cần chụp X-quang ngực, xét nghiệm CRP, cấy đàm để xác nhận viêm phổi.',
  triageLevel: 'URGENT'
};
