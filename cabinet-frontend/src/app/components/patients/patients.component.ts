import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CabinetService } from '../../services/cabinet.service';
import {
  Patient, PatientRequest, GroupeSanguin, GROUPE_SANGUIN_LABELS
} from '../../models/cabinet.models';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="header-bar">
      <h2>Patients</h2>
      <button class="btn-primary" (click)="openCreate()">+ Nouveau patient</button>
    </div>

    @if (serverError) {
      <div class="alert-error">
        <span>Impossible de joindre le serveur. Vérifiez que la passerelle (8888) est démarrée.</span>
        <button (click)="serverError = false">✕</button>
      </div>
    }

    @if (loading) {
      <p class="info-msg">Chargement...</p>
    } @else if (patients.length === 0) {
      <p class="info-msg">Aucun patient pour le moment.</p>
    } @else {
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Groupe</th>
            <th>Téléphone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (p of patients; track p.id) {
            <tr>
              <td>{{ p.id }}</td>
              <td><strong>{{ p.nom }}</strong></td>
              <td>{{ p.prenom }}</td>
              <td><span class="badge">{{ groupeLabels[p.groupeSanguin] }}</span></td>
              <td>{{ p.telephone || '—' }}</td>
              <td class="actions">
                <button class="btn-secondary" (click)="openEdit(p)">Modifier</button>
                <button class="btn-danger" (click)="confirmDelete(p)">Supprimer</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    }

    @if (showModal) {
      <div class="modal-backdrop" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingId ? 'Modifier le patient' : 'Nouveau patient' }}</h3>
            <button class="close-btn" (click)="closeModal()">✕</button>
          </div>

          @if (generalError) {
            <div class="alert-error">{{ generalError }}</div>
          }

          <form (ngSubmit)="save()">
            <div class="form-grid">
              <div class="form-group">
                <label>Nom</label>
                <input type="text" [(ngModel)]="form.nom" name="nom" />
                @if (fieldErrors['nom']) {
                  <small class="field-error">{{ fieldErrors['nom'] }}</small>
                }
              </div>

              <div class="form-group">
                <label>Prénom</label>
                <input type="text" [(ngModel)]="form.prenom" name="prenom" />
                @if (fieldErrors['prenom']) {
                  <small class="field-error">{{ fieldErrors['prenom'] }}</small>
                }
              </div>

              <div class="form-group">
                <label>Groupe sanguin</label>
                <select [(ngModel)]="form.groupeSanguin" name="groupeSanguin">
                  @for (g of groupes; track g) {
                    <option [value]="g">{{ groupeLabels[g] }}</option>
                  }
                </select>
                @if (fieldErrors['groupeSanguin']) {
                  <small class="field-error">{{ fieldErrors['groupeSanguin'] }}</small>
                }
              </div>

              <div class="form-group">
                <label>Téléphone</label>
                <input type="text" [(ngModel)]="form.telephone" name="telephone" placeholder="+212 600 000 000" />
                @if (fieldErrors['telephone']) {
                  <small class="field-error">{{ fieldErrors['telephone'] }}</small>
                }
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn-primary" [disabled]="saving">
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class PatientsComponent implements OnInit {
  private cabinetService = inject(CabinetService);

  patients: Patient[] = [];
  loading = false;
  serverError = false;

  showModal = false;
  editingId: number | null = null;
  saving = false;
  generalError = '';
  fieldErrors: Record<string, string> = {};

  groupes: GroupeSanguin[] = [
    'A_POSITIF', 'A_NEGATIF', 'B_POSITIF', 'B_NEGATIF',
    'AB_POSITIF', 'AB_NEGATIF', 'O_POSITIF', 'O_NEGATIF'
  ];
  groupeLabels = GROUPE_SANGUIN_LABELS;

  form: PatientRequest = {
    nom: '',
    prenom: '',
    groupeSanguin: 'A_POSITIF',
    telephone: ''
  };

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.serverError = false;
    this.cabinetService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.loading = false;
      },
      error: () => {
        this.serverError = true;
        this.loading = false;
      }
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.form = { nom: '', prenom: '', groupeSanguin: 'A_POSITIF', telephone: '' };
    this.resetErrors();
    this.showModal = true;
  }

  openEdit(p: Patient): void {
    this.editingId = p.id;
    this.form = {
      nom: p.nom,
      prenom: p.prenom,
      groupeSanguin: p.groupeSanguin,
      telephone: p.telephone || ''
    };
    this.resetErrors();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  save(): void {
    this.saving = true;
    this.resetErrors();

    const payload: PatientRequest = {
      ...this.form,
      telephone: this.form.telephone?.trim() ? this.form.telephone.trim() : undefined
    };

    const req$ = this.editingId
      ? this.cabinetService.updatePatient(this.editingId, payload)
      : this.cabinetService.createPatient(payload);

    req$.subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.loadPatients();
      },
      error: (err) => {
        this.saving = false;
        this.generalError = err.error?.message || 'Données invalides';
        this.fieldErrors = err.error?.details || {};
      }
    });
  }

  confirmDelete(p: Patient): void {
    if (confirm(`Supprimer ${p.prenom} ${p.nom} ?`)) {
      this.cabinetService.deletePatient(p.id).subscribe({
        next: () => this.loadPatients(),
        error: () => (this.serverError = true)
      });
    }
  }

  private resetErrors(): void {
    this.generalError = '';
    this.fieldErrors = {};
  }
}
