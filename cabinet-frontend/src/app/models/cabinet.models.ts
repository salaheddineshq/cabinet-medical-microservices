export type GroupeSanguin =
  | 'A_POSITIF' | 'A_NEGATIF'
  | 'B_POSITIF' | 'B_NEGATIF'
  | 'AB_POSITIF' | 'AB_NEGATIF'
  | 'O_POSITIF' | 'O_NEGATIF';

export const GROUPE_SANGUIN_LABELS: Record<GroupeSanguin, string> = {
  A_POSITIF: 'A+', A_NEGATIF: 'A-',
  B_POSITIF: 'B+', B_NEGATIF: 'B-',
  AB_POSITIF: 'AB+', AB_NEGATIF: 'AB-',
  O_POSITIF: 'O+', O_NEGATIF: 'O-'
};

export type MotifConsultation =
  | 'CONSULTATION_GENERALE' | 'SUIVI' | 'URGENCE'
  | 'VACCINATION' | 'RESULTATS_ANALYSES' | 'CERTIFICAT';

export const MOTIF_LABELS: Record<MotifConsultation, string> = {
  CONSULTATION_GENERALE: 'Consultation générale',
  SUIVI: 'Suivi médical',
  URGENCE: 'Urgence',
  VACCINATION: 'Vaccination',
  RESULTATS_ANALYSES: "Résultats d'analyses",
  CERTIFICAT: 'Demande de certificat'
};

export type TypeCertificat = 'DISPENSE' | 'ARRET_TRAVAIL' | 'APTITUDE';

export const TYPE_CERTIFICAT_LABELS: Record<TypeCertificat, string> = {
  DISPENSE: 'Dispense',
  ARRET_TRAVAIL: 'Arrêt de travail',
  APTITUDE: "Certificat d'aptitude"
};

export interface Patient {
  id: number;
  nom: string;
  prenom: string;
  groupeSanguin: GroupeSanguin;
  telephone?: string;
}

export interface PatientRequest {
  nom: string;
  prenom: string;
  groupeSanguin: GroupeSanguin;
  telephone?: string;
}

export interface Appointment {
  id: number;
  date: string; // YYYY-MM-DD
  motif: MotifConsultation;
  medecin: string;
  patientId: number;
  remarques?: string;
  patient?: {
    id: number;
    nom: string;
    prenom: string;
    groupeSanguin: GroupeSanguin | null;
  } | null;
}

export interface AppointmentRequest {
  date: string;
  motif: MotifConsultation;
  medecin: string;
  patientId: number;
  remarques?: string;
}

export interface Ordonnance {
  id: number;
  appointmentId: number;
  dateEmission: string;
  medicaments: string[];
}

export interface Certificat {
  id: number;
  appointmentId: number;
  typeCertificat: TypeCertificat;
  texte: string;
  dateEmission: string;
  dateDebut: string;
  dateFin: string;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  details?: Record<string, string>;
}
