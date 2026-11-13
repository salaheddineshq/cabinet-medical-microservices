package com.cabinet.appointment.dto;

import com.cabinet.appointment.enums.TypeCertificat;
import java.time.LocalDate;

public record CertificatResponse(
        Long id,
        Long appointmentId,
        TypeCertificat typeCertificat,
        String texte,
        LocalDate dateEmission,
        LocalDate dateDebut,
        LocalDate dateFin
) {}
