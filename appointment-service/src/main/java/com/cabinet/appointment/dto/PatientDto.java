package com.cabinet.appointment.dto;

import com.cabinet.appointment.enums.GroupeSanguin;

public record PatientDto(
        Long id,
        String nom,
        String prenom,
        GroupeSanguin groupeSanguin
) {}
