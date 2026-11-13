package com.cabinet.appointment.dto;

import com.cabinet.appointment.enums.MotifConsultation;
import java.time.LocalDate;

public record AppointmentResponse(
        Long id,
        LocalDate date,
        MotifConsultation motif,
        String medecin,
        Long patientId,
        String remarques,
        PatientDto patient
) {}
