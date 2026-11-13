package com.cabinet.appointment.dto;

import java.time.LocalDate;
import java.util.List;

public record OrdonnanceResponse(
        Long id,
        Long appointmentId,
        LocalDate dateEmission,
        List<String> medicaments
) {}
