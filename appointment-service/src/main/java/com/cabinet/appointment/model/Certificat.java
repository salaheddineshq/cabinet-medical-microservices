package com.cabinet.appointment.model;

import com.cabinet.appointment.enums.TypeCertificat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Certificat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long appointmentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TypeCertificat typeCertificat;

    @Column(length = 1000)
    private String texte;

    private LocalDate dateEmission;
    private LocalDate dateDebut;
    private LocalDate dateFin;
}
