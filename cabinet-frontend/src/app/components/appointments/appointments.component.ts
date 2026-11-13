import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CabinetService } from '../../services/cabinet.service';
import {
  Appointment, AppointmentRequest, Patient,
  MotifConsultation, MOTIF_LABELS,
  GROUPE_SANGUIN_LABELS,
  Ordonnance, Certificat, TypeCertificat, TYPE_CERTIFICAT_LABELS
} from '../../models/cabinet.models';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="no-print">
      <div class="header-bar">
        <h2>Rendez-vous</h2>
        <button class="btn-primary" (click)="openCreate()">+ Nouveau rendez-vous</button>
      </div>

      @if (serverError) {
        <div class="alert-error">
          <span>Impossible de joindre le serveur.</span>
          <button (click)="serverError = false">✕</button>
        </div>
      }

      @if (loading) {
        <p class="info-msg">Chargement...</p>
      } @else if (appointments.length === 0) {
        <p class="info-msg">Aucun rendez-vous pour le moment.</p>
      } @else {
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Motif</th>
              <th>Médecin</th>
              <th>Patient</th>
              <th>Remarques</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (rdv of appointments; track rdv.id) {
              <tr>
                <td>{{ rdv.id }}</td>
                <td>{{ rdv.date | date:'dd/MM/yyyy' }}</td>
                <td>{{ motifLabels[rdv.motif] }}</td>
                <td>{{ rdv.medecin }}</td>
                <td>
                  @if (!rdv.patient || rdv.patient.nom === 'Non disponible') {
                    <span class="muted">Patient #{{ rdv.patientId }} (indisponible)</span>
                  } @else {
                    <span>{{ rdv.patient.prenom }} {{ rdv.patient.nom }}</span>
                    @if (rdv.patient.groupeSanguin) {
                      <span class="badge">{{ groupeLabels[rdv.patient.groupeSanguin] }}</span>
                    }
                  }
                </td>
                <td>{{ rdv.remarques || '—' }}</td>
                <td class="actions">
                  <button class="btn-secondary" (click)="openDetails(rdv)">Ordonnances / Certificats</button>
                  <button class="btn-secondary" (click)="openRemarques(rdv)">Remarques</button>
                  <button class="btn-danger" (click)="confirmDelete(rdv)">Supprimer</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }

      <!-- Modale Nouveau Rendez-vous (F6) -->
      @if (showCreateModal) {
        <div class="modal-backdrop" (click)="showCreateModal = false">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Nouveau rendez-vous</h3>
              <button class="close-btn" (click)="showCreateModal = false">✕</button>
            </div>

            @if (patients.length === 0) {
              <div class="alert-error">Aucun patient enregistré : créez d'abord un patient.</div>
            }
            @if (generalError) {
              <div class="alert-error">{{ generalError }}</div>
            }

            <form (ngSubmit)="saveAppointment()">
              <div class="form-group">
                <label>Patient</label>
                <select [(ngModel)]="createForm.patientId" name="patientId">
                  @for (p of patients; track p.id) {
                    <option [ngValue]="p.id">{{ p.prenom }} {{ p.nom }} (#{{ p.id }})</option>
                  }
                </select>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label>Date</label>
                  <input type="date" [(ngModel)]="createForm.date" name="date" />
                  @if (fieldErrors['date']) { <small class="field-error">{{ fieldErrors['date'] }}</small> }
                </div>

                <div class="form-group">
                  <label>Motif</label>
                  <select [(ngModel)]="createForm.motif" name="motif">
                    @for (m of motifs; track m) {
                      <option [value]="m">{{ motifLabels[m] }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>Médecin</label>
                <input type="text" [(ngModel)]="createForm.medecin" name="medecin" placeholder="Dr Tazi" />
                @if (fieldErrors['medecin']) { <small class="field-error">{{ fieldErrors['medecin'] }}</small> }
              </div>

              <div class="form-group">
                <label>Remarques</label>
                <textarea [(ngModel)]="createForm.remarques" name="remarques" rows="3"></textarea>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn-secondary" (click)="showCreateModal = false">Annuler</button>
                <button type="submit" class="btn-primary" [disabled]="saving || patients.length === 0">
                  {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Modale Remarques (F7) -->
      @if (showRemarquesModal && selectedRdv) {
        <div class="modal-backdrop" (click)="showRemarquesModal = false">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Remarques du rendez-vous #{{ selectedRdv.id }}</h3>
              <button class="close-btn" (click)="showRemarquesModal = false">✕</button>
            </div>
            <div class="form-group">
              <label>Remarques</label>
              <textarea [(ngModel)]="remarquesText" rows="4"></textarea>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" (click)="showRemarquesModal = false">Annuler</button>
              <button class="btn-primary" (click)="saveRemarques()" [disabled]="saving">
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modale Détail Ordonnances & Certificats (F9, F10, F11) -->
      @if (showDetailsModal && selectedRdv) {
        <div class="modal-backdrop" (click)="showDetailsModal = false">
          <div class="modal modal-large" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div>
                <h3>Rendez-vous #{{ selectedRdv.id }}</h3>
                <small class="muted">
                  {{ selectedRdv.date | date:'dd/MM/yyyy' }} · {{ selectedRdv.medecin }} ·
                  {{ selectedRdv.patient?.prenom }} {{ selectedRdv.patient?.nom }}
                </small>
              </div>
              <button class="close-btn" (click)="showDetailsModal = false">✕</button>
            </div>

            <div class="two-cols">
              <!-- Colonne Ordonnances -->
              <div>
                <h4>Ordonnances</h4>
                @if (ordonnances.length === 0) {
                  <p class="muted">Aucune ordonnance.</p>
                } @else {
                  @for (ord of ordonnances; track ord.id) {
                    <div class="doc-card">
                      <div class="doc-card-header">
                        <strong>Ordonnance n° {{ ord.id }} · émise le {{ ord.dateEmission | date:'dd/MM/yyyy' }}</strong>
                        <button class="btn-secondary" (click)="printOrdonnance(ord)">Imprimer</button>
                      </div>
                      <ul>
                        @for (med of ord.medicaments; track $index) {
                          <li>{{ med }}</li>
                        }
                      </ul>
                    </div>
                  }
                }

                <div class="form-group" style="margin-top:1rem;">
                  <label>Médicaments (un par ligne)</label>
                  <textarea [(ngModel)]="medicamentsInput" rows="3"
                    placeholder="Paracétamol 1 g - 3 fois par jour"></textarea>
                  @if (ordError) { <small class="field-error">{{ ordError }}</small> }
                </div>
                <button class="btn-primary" (click)="addOrdonnance()">Ajouter l'ordonnance</button>
              </div>

              <!-- Colonne Certificats -->
              <div>
                <h4>Certificats</h4>
                @if (certificats.length === 0) {
                  <p class="muted">Aucun certificat.</p>
                } @else {
                  @for (cert of certificats; track cert.id) {
                    <div class="doc-card">
                      <div class="doc-card-header">
                        <strong>{{ certLabels[cert.typeCertificat] }} · émis le {{ cert.dateEmission | date:'dd/MM/yyyy' }}</strong>
                        <button class="btn-secondary" (click)="printCertificat(cert)">Imprimer</button>
                      </div>
                      <p>{{ cert.texte }}</p>
                      <small class="muted">Du {{ cert.dateDebut | date:'dd/MM/yyyy' }} au {{ cert.dateFin | date:'dd/MM/yyyy' }}</small>
                    </div>
                  }
                }

                <div class="form-group" style="margin-top:1rem;">
                  <label>Type</label>
                  <select [(ngModel)]="certForm.typeCertificat">
                    @for (t of typesCertificat; track t) {
                      <option [value]="t">{{ certLabels[t] }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label>Texte</label>
                  <textarea [(ngModel)]="certForm.texte" rows="2"></textarea>
                  @if (certErrors['texte']) { <small class="field-error">{{ certErrors['texte'] }}</small> }
                </div>
                <div class="form-grid">
                  <div class="form-group">
                    <label>Date de début</label>
                    <input type="date" [(ngModel)]="certForm.dateDebut" />
                    @if (certErrors['dateDebut']) { <small class="field-error">{{ certErrors['dateDebut'] }}</small> }
                  </div>
                  <div class="form-group">
                    <label>Date de fin</label>
                    <input type="date" [(ngModel)]="certForm.dateFin" />
                    @if (certErrors['dateFin']) { <small class="field-error">{{ certErrors['dateFin'] }}</small> }
                  </div>
                </div>
                @if (certGeneralError) { <small class="field-error">{{ certGeneralError }}</small> }
                <button class="btn-primary" (click)="addCertificat()">Ajouter le certificat</button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Zone Impression A4 (F12 & F13) -->
    <div class="print-only">
      @if (printingOrdonnance && selectedRdv) {
        <div class="a4-doc">
          <div class="a4-header">
            <div>
              <h2>Cabinet médical</h2>
              <p>Avenue Mohammed V, Rabat · Tél : +212 537 000 000</p>
              <p><strong>{{ selectedRdv.medecin }}</strong> — Médecine générale</p>
            </div>
            <p>Rabat, le {{ printingOrdonnance.dateEmission | date:'dd/MM/yyyy' }}</p>
          </div>
          <h1 class="a4-title">ORDONNANCE N° {{ printingOrdonnance.id }}</h1>
          <p>
            <strong>Patient :</strong> {{ selectedRdv.patient?.prenom }} {{ selectedRdv.patient?.nom | uppercase }}
            @if (selectedRdv.patient?.groupeSanguin) {
              — Groupe sanguin : {{ groupeLabels[selectedRdv.patient!.groupeSanguin!] }}
            }
          </p>
          <p>Consultation du {{ selectedRdv.date | date:'dd/MM/yyyy' }}</p>
          <ol class="a4-list">
            @for (med of printingOrdonnance.medicaments; track $index) {
              <li>{{ med }}</li>
            }
          </ol>
          <div class="a4-signature">Signature et cachet</div>
        </div>
      }

      @if (printingCertificat && selectedRdv) {
        <div class="a4-doc">
          <div class="a4-header">
            <div>
              <h2>Cabinet médical</h2>
              <p>Avenue Mohammed V, Rabat · Tél : +212 537 000 000</p>
              <p><strong>{{ selectedRdv.medecin }}</strong> — Médecine générale</p>
            </div>
            <p>Rabat, le {{ printingCertificat.dateEmission | date:'dd/MM/yyyy' }}</p>
          </div>
          <h1 class="a4-title">
            {{ printingCertificat.typeCertificat === 'APTITUDE' ? "CERTIFICAT D'APTITUDE" : 'CERTIFICAT MÉDICAL' }}
          </h1>
          <p class="a4-body">
            Je soussigné(e), {{ selectedRdv.medecin }}, certifie avoir examiné le
            {{ selectedRdv.date | date:'dd/MM/yyyy' }}
            M./Mme {{ selectedRdv.patient?.prenom }} {{ selectedRdv.patient?.nom | uppercase }}
            @if (printingCertificat.typeCertificat === 'ARRET_TRAVAIL') {
              et déclare que son état de santé nécessite un arrêt de travail de
              <strong>{{ getJoursArret(printingCertificat) }} jour(s)</strong>
              du {{ printingCertificat.dateDebut | date:'dd/MM/yyyy' }}
              au {{ printingCertificat.dateFin | date:'dd/MM/yyyy' }} inclus, sauf complications.
            } @else if (printingCertificat.typeCertificat === 'DISPENSE') {
              et déclare que son état de santé justifie une dispense
              du {{ printingCertificat.dateDebut | date:'dd/MM/yyyy' }}
              au {{ printingCertificat.dateFin | date:'dd/MM/yyyy' }} inclus.
            } @else {
              et n'avoir constaté à ce jour aucune contre-indication apparente.
            }
          </p>
          <p class="a4-body"><em>{{ printingCertificat.texte }}</em></p>
          <p class="a4-body">
            Certificat établi à la demande de l'intéressé(e) et remis en main propre pour servir et valoir ce que de droit.
          </p>
          <div class="a4-signature">Signature et cachet</div>
        </div>
      }
    </div>
  `
})
export class AppointmentsComponent implements OnInit {
  private cabinetService = inject(CabinetService);

  appointments: Appointment[] = [];
  patients: Patient[] = [];
  loading = false;
  serverError = false;
  saving = false;

  motifLabels = MOTIF_LABELS;
  groupeLabels = GROUPE_SANGUIN_LABELS;
  certLabels = TYPE_CERTIFICAT_LABELS;

  motifs: MotifConsultation[] = [
    'CONSULTATION_GENERALE', 'SUIVI', 'URGENCE',
    'VACCINATION', 'RESULTATS_ANALYSES', 'CERTIFICAT'
  ];
  typesCertificat: TypeCertificat[] = ['DISPENSE', 'ARRET_TRAVAIL', 'APTITUDE'];

  showCreateModal = false;
  generalError = '';
  fieldErrors: Record<string, string> = {};
  createForm: AppointmentRequest = this.defaultCreateForm();

  showRemarquesModal = false;
  remarquesText = '';

  showDetailsModal = false;
  selectedRdv: Appointment | null = null;
  ordonnances: Ordonnance[] = [];
  certificats: Certificat[] = [];
  medicamentsInput = '';
  ordError = '';

  certForm = {
    typeCertificat: 'DISPENSE' as TypeCertificat,
    texte: '',
    dateDebut: this.todayIso(),
    dateFin: this.todayIso()
  };
  certErrors: Record<string, string> = {};
  certGeneralError = '';

  printingOrdonnance: Ordonnance | null = null;
  printingCertificat: Certificat | null = null;

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.serverError = false;
    this.cabinetService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
      },
      error: () => {
        this.serverError = true;
        this.loading = false;
      }
    });
  }

  openCreate(): void {
    this.generalError = '';
    this.fieldErrors = {};
    this.cabinetService.getPatients().subscribe({
      next: (pts) => {
        this.patients = pts;
        this.createForm = this.defaultCreateForm();
        if (pts.length > 0) this.createForm.patientId = pts[0].id;
        this.showCreateModal = true;
      },
      error: () => (this.serverError = true)
    });
  }

  saveAppointment(): void {
    this.saving = true;
    this.generalError = '';
    this.fieldErrors = {};
    this.cabinetService.createAppointment(this.createForm).subscribe({
      next: () => {
        this.saving = false;
        this.showCreateModal = false;
        this.loadAppointments();
      },
      error: (err) => {
        this.saving = false;
        this.generalError = err.error?.message || 'Données invalides';
        this.fieldErrors = err.error?.details || {};
      }
    });
  }

  openRemarques(rdv: Appointment): void {
    this.selectedRdv = rdv;
    this.remarquesText = rdv.remarques || '';
    this.showRemarquesModal = true;
  }

  saveRemarques(): void {
    if (!this.selectedRdv) return;
    this.saving = true;
    this.cabinetService.updateRemarques(this.selectedRdv.id, this.remarquesText).subscribe({
      next: () => {
        this.saving = false;
        this.showRemarquesModal = false;
        this.loadAppointments();
      },
      error: () => (this.saving = false)
    });
  }

  confirmDelete(rdv: Appointment): void {
    if (confirm(`Supprimer le rendez-vous #${rdv.id} ?`)) {
      this.cabinetService.deleteAppointment(rdv.id).subscribe({
        next: () => this.loadAppointments()
      });
    }
  }

  openDetails(rdv: Appointment): void {
    this.selectedRdv = rdv;
    this.medicamentsInput = '';
    this.ordError = '';
    this.certErrors = {};
    this.certGeneralError = '';
    this.showDetailsModal = true;
    this.refreshDocuments(rdv.id);
  }

  refreshDocuments(appointmentId: number): void {
    this.cabinetService.getOrdonnances(appointmentId).subscribe((res) => (this.ordonnances = res));
    this.cabinetService.getCertificats(appointmentId).subscribe((res) => (this.certificats = res));
  }

  addOrdonnance(): void {
    if (!this.selectedRdv) return;
    const lignes = this.medicamentsInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lignes.length === 0) {
      this.ordError = 'Au moins un médicament est requis';
      return;
    }
    this.ordError = '';
    this.cabinetService.createOrdonnance(this.selectedRdv.id, lignes).subscribe({
      next: () => {
        this.medicamentsInput = '';
        this.refreshDocuments(this.selectedRdv!.id);
      },
      error: (err) => (this.ordError = err.error?.message || 'Erreur lors de la création')
    });
  }

  addCertificat(): void {
    if (!this.selectedRdv) return;
    this.certErrors = {};
    this.certGeneralError = '';
    this.cabinetService.createCertificat({
      appointmentId: this.selectedRdv.id,
      ...this.certForm
    }).subscribe({
      next: () => {
        this.certForm.texte = '';
        this.refreshDocuments(this.selectedRdv!.id);
      },
      error: (err) => {
        this.certErrors = err.error?.details || {};
        if (!err.error?.details) {
          this.certGeneralError = err.error?.message || 'Erreur lors de la création';
        }
      }
    });
  }

  printOrdonnance(ord: Ordonnance): void {
    this.printingCertificat = null;
    this.printingOrdonnance = ord;
    setTimeout(() => window.print(), 50);
  }

  printCertificat(cert: Certificat): void {
    this.printingOrdonnance = null;
    this.printingCertificat = cert;
    setTimeout(() => window.print(), 50);
  }

  getJoursArret(cert: Certificat): number {
    const start = new Date(cert.dateDebut).getTime();
    const end = new Date(cert.dateFin).getTime();
    return Math.floor((end - start) / 86400000) + 1;
  }

  private todayIso(): string {
    return new Date().toISOString().split('T')[0];
  }

  private defaultCreateForm(): AppointmentRequest {
    return {
      date: this.todayIso(),
      motif: 'CONSULTATION_GENERALE',
      medecin: '',
      patientId: 0,
      remarques: ''
    };
  }
}
