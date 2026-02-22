import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Patient, Appointment, Alert, Drug, Prescription, IoTDevice,
  StorageFile, Diagnosis, LabResult, ClinicalNote, DiagnosisResponse,
  DrugInteraction, GraphQueryResult, SearchResult, HospitalLocation
} from '../models';
import {
  MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_ALERTS, MOCK_DRUGS,
  MOCK_PRESCRIPTIONS, MOCK_DEVICES, MOCK_STORAGE_FILES,
  MOCK_DIAGNOSES, MOCK_LAB_RESULTS, MOCK_CLINICAL_NOTES,
  MOCK_AI_SUGGESTIONS, MOCK_DRUG_INTERACTIONS,
  MOCK_GRAPH_NODES, MOCK_GRAPH_RELATIONSHIPS,
  MOCK_HOSPITALS, MOCK_SYSTEM_USERS
} from '../mock-data';
import { User } from '../models';

/**
 * API Service - Mock implementation
 * In production: calls Spring Cloud Gateway → microservices
 * All endpoints match nghiệp_vụ.md API contracts
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  // ── Patient Service (port 8081) ──
  getPatients(): Observable<Patient[]> { return of(MOCK_PATIENTS).pipe(delay(300)); }
  getPatient(id: string): Observable<Patient | undefined> { return of(MOCK_PATIENTS.find(p => p.id === id)).pipe(delay(200)); }

  // ── Appointment Service (port 8084) ──
  getAppointments(): Observable<Appointment[]> { return of(MOCK_APPOINTMENTS).pipe(delay(300)); }

  // ── Alert/Notification Service (port 8086) ──
  getAlerts(): Observable<Alert[]> { return of(MOCK_ALERTS).pipe(delay(200)); }

  // ── Medication Service (port 8085) ──
  getDrugs(): Observable<Drug[]> { return of(MOCK_DRUGS).pipe(delay(300)); }
  getPrescriptions(): Observable<Prescription[]> { return of(MOCK_PRESCRIPTIONS).pipe(delay(300)); }
  checkDrugInteraction(drug1: string, drug2: string): Observable<DrugInteraction[]> {
    const results = MOCK_DRUG_INTERACTIONS.filter(
      i => (i.drug1.toLowerCase().includes(drug1.toLowerCase()) && i.drug2.toLowerCase().includes(drug2.toLowerCase()))
        || (i.drug1.toLowerCase().includes(drug2.toLowerCase()) && i.drug2.toLowerCase().includes(drug1.toLowerCase()))
    );
    return of(results).pipe(delay(500));
  }

  // ── EHR Service (port 8082) ──
  getDiagnoses(patientId: string): Observable<Diagnosis[]> { return of(MOCK_DIAGNOSES.filter(d => d.patientId === patientId)).pipe(delay(200)); }
  getLabResults(patientId: string): Observable<LabResult[]> { return of(MOCK_LAB_RESULTS.filter(l => l.patientId === patientId)).pipe(delay(200)); }
  getClinicalNotes(patientId: string): Observable<ClinicalNote[]> { return of(MOCK_CLINICAL_NOTES.filter(n => n.patientId === patientId)).pipe(delay(200)); }

  // ── AI Service (port 8088, gRPC via gateway) ──
  runSymptomCheck(symptoms: string): Observable<DiagnosisResponse> {
    const key = symptoms.toLowerCase().includes('ho') || symptoms.toLowerCase().includes('phổi') ? 'respiratory' : 'default';
    return of({
      suggestions: MOCK_AI_SUGGESTIONS[key] || MOCK_AI_SUGGESTIONS['default'],
      confidence: 0.85,
      recommendation: 'Nên chỉ định thêm xét nghiệm cận lâm sàng để xác nhận chẩn đoán.',
      triageLevel: 'URGENT' as any
    }).pipe(delay(1500));
  }

  // ── Device Service ──
  getDevices(): Observable<IoTDevice[]> { return of(MOCK_DEVICES).pipe(delay(300)); }

  // ── Storage Service (port 8090) ──
  getStorageFiles(): Observable<StorageFile[]> { return of(MOCK_STORAGE_FILES).pipe(delay(300)); }

  // ── Graph Service (Neo4j Bolt) ──
  getGraphData(): Observable<GraphQueryResult> {
    return of({ nodes: MOCK_GRAPH_NODES, relationships: MOCK_GRAPH_RELATIONSHIPS }).pipe(delay(500));
  }

  // ── GIS Service ──
  getHospitals(): Observable<HospitalLocation[]> { return of(MOCK_HOSPITALS).pipe(delay(300)); }

  // ── User Service ──
  getUsers(): Observable<User[]> { return of(MOCK_SYSTEM_USERS).pipe(delay(300)); }

  // ── Search Service (Elasticsearch, port 8089) ──
  search(query: string, type: string = 'all'): Observable<SearchResult[]> {
    const q = query.toLowerCase();
    const results: SearchResult[] = [];
    if (type === 'all' || type === 'patients') {
      MOCK_PATIENTS.filter(p => p.fullName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.phone.includes(q))
        .forEach(p => results.push({ type: 'patient', id: p.id, title: p.fullName, subtitle: `${p.id} · ${p.phone}`, score: 1 }));
    }
    if (type === 'all' || type === 'drugs') {
      MOCK_DRUGS.filter(d => d.name.toLowerCase().includes(q) || d.activeIngredient.toLowerCase().includes(q))
        .forEach(d => results.push({ type: 'drug', id: d.id, title: d.name, subtitle: `${d.activeIngredient} · ${d.atcCode}`, score: 0.9 }));
    }
    return of(results).pipe(delay(300));
  }
}
