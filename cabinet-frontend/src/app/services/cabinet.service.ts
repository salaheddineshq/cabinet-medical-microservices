import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Patient, PatientRequest,
  Appointment, AppointmentRequest,
  Ordonnance, Certificat, TypeCertificat
} from '../models/cabinet.models';

@Injectable({ providedIn: 'root' })
export class CabinetService {
  private http = inject(HttpClient);
  private readonly GATEWAY = 'http://localhost:8888';

  // --- PATIENTS (F1 - F4) ---
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.GATEWAY}/patient-service/patients`);
  }

  createPatient(req: PatientRequest): Observable<Patient> {
    return this.http.post<Patient>(`${this.GATEWAY}/patient-service/patients`, req);
  }

  updatePatient(id: number, req: PatientRequest): Observable<Patient> {
    return this.http.put<Patient>(`${this.GATEWAY}/patient-service/patients/${id}`, req);
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.GATEWAY}/patient-service/patients/${id}`);
  }

  // --- RENDEZ-VOUS (F5 - F8) ---
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.GATEWAY}/appointment-service/appointments`);
  }

  createAppointment(req: AppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.GATEWAY}/appointment-service/appointments`, req);
  }

  updateRemarques(id: number, remarques: string): Observable<Appointment> {
    return this.http.patch<Appointment>(
      `${this.GATEWAY}/appointment-service/appointments/${id}/remarques`,
      { remarques }
    );
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.GATEWAY}/appointment-service/appointments/${id}`);
  }

  // --- ORDONNANCES & CERTIFICATS (F9 - F11) ---
  getOrdonnances(appointmentId: number): Observable<Ordonnance[]> {
    return this.http.get<Ordonnance[]>(
      `${this.GATEWAY}/appointment-service/ordonnances/appointment/${appointmentId}`
    );
  }

  createOrdonnance(appointmentId: number, medicaments: string[]): Observable<Ordonnance> {
    return this.http.post<Ordonnance>(
      `${this.GATEWAY}/appointment-service/ordonnances`,
      { appointmentId, medicaments }
    );
  }

  getCertificats(appointmentId: number): Observable<Certificat[]> {
    return this.http.get<Certificat[]>(
      `${this.GATEWAY}/appointment-service/certificats/appointment/${appointmentId}`
    );
  }

  createCertificat(payload: {
    appointmentId: number;
    typeCertificat: TypeCertificat;
    texte: string;
    dateDebut: string;
    dateFin: string;
  }): Observable<Certificat> {
    return this.http.post<Certificat>(
      `${this.GATEWAY}/appointment-service/certificats`,
      payload
    );
  }
}
