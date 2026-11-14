# 🏥 Système de Gestion d'un Cabinet Médical (Microservices)

Application distribuée de gestion d'un cabinet médical développée avec **Spring Boot / Spring Cloud** pour le backend et **Angular** pour l'interface utilisateur. Elle permet au personnel médical de gérer les patients, les rendez-vous, les ordonnances et les certificats médicaux imprimables au format A4.

---

## 🏗️ Architecture du Projet

Le projet est organisé en monorepo regroupant **5 microservices Spring Boot** et **1 application front-end Angular** :

```text
cabinet-medical-microservices/
├── discovery-service/      # Annuaire Eureka (Port 8761)
├── config-service/         # Serveur de configuration centralisé (Port 9999)
├── gateway-service/        # Passerelle API Spring Cloud Gateway + CORS (Port 8888)
├── patient-service/        # Gestion des patients (Port 8081)
├── appointment-service/    # Gestion des RDV, ordonnances, certificats & Circuit Breaker (Port 8082)
└── cabinet-frontend/       # Interface utilisateur Angular (Port 5173)
```

### Stack Technique

* **Backend :** Java 17, Spring Boot 3.3.4 / 4.x, Spring Cloud (Eureka Discovery, Config Server, Reactive Gateway, OpenFeign), Resilience4j (Circuit Breaker), Spring Data JPA, H2 Database, MapStruct, Lombok, Spring Boot Actuator.
* **Frontend :** Angular (Standalone Components), TypeScript, CSS (mise en page d'impression `@media print` A4).

---

## 🚀 Démarrage Rapide

### Prérequis

* **JDK 17+** et **Maven** (ou le wrapper `./mvnw` inclus dans chaque service)
* **Node.js 18+** et **Angular CLI** (`npm install -g @angular/cli`)

### 1. Démarrer le Backend (Ordre strict)

Démarrez chaque service dans un terminal séparé en respectant l'ordre suivant afin que l'enregistrement Eureka et le chargement de la configuration s'effectuent correctement :

1. **Discovery Service (Eureka — Port 8761)**
   ```bash
   cd discovery-service
   ./mvnw spring-boot:run
   ```
   > Vérifier le dashboard : `http://localhost:8761`

2. **Config Service (Port 9999)**
   ```bash
   cd config-service
   ./mvnw spring-boot:run
   ```
   > Vérifier la config servie : `http://localhost:9999/patient-service/default`

3. **Patient Service (Port 8081)**
   ```bash
   cd patient-service
   ./mvnw spring-boot:run
   ```

4. **Appointment Service (Port 8082)**
   ```bash
   cd appointment-service
   ./mvnw spring-boot:run
   ```

5. **Gateway Service (Port 8888)**
   ```bash
   cd gateway-service
   ./mvnw spring-boot:run
   ```

### 2. Démarrer le Frontend Angular (Port 5173)

```bash
cd cabinet-frontend
npm install
ng serve --port 5173
```

Ouvrez ensuite **`http://localhost:5173`** dans votre navigateur.

---

## ✨ Fonctionnalités Principales

* **Gestion des Patients (`patient-service`) :** Création, consultation, modification et suppression des dossiers patients (avec validation des champs et gestion des groupes sanguins).
* **Gestion des Rendez-vous (`appointment-service`) :** Planification des consultations, enrichissement automatique des données patient via **OpenFeign** et mise à jour des remarques médicales.
* **Ordonnances & Certificats :** Prescription de médicaments et génération de certificats (arrêt de travail avec calcul automatique de la durée, dispense, certificat d'aptitude) avec **impression directe au format A4**.
* **Résilience (Resilience4j) :** Protection des appels inter-services par un **Circuit Breaker** (`CLOSED`, `OPEN`, `HALF_OPEN`) avec méthode de repli (*fallback*) et supervision via **Actuator** (`/actuator/circuitbreakers`).

---

## 🔌 Endpoints Principaux (via la Passerelle `8888`)

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` / `POST` | `/patient-service/patients` | Lister ou créer un patient |
| `PUT` / `DELETE` | `/patient-service/patients/{id}` | Modifier ou supprimer un patient |
| `GET` / `POST` | `/appointment-service/appointments` | Lister ou créer un rendez-vous |
| `PATCH` | `/appointment-service/appointments/{id}/remarques` | Modifier les remarques d'un RDV |
| `GET` / `POST` | `/appointment-service/ordonnances` | Consulter ou créer une ordonnance |
| `GET` / `POST` | `/appointment-service/certificats` | Consulter ou créer un certificat |
| `GET` | `http://localhost:8082/actuator/circuitbreakers` | État du Circuit Breaker Resilience4j |