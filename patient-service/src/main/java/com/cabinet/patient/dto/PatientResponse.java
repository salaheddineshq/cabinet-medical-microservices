package com.cabinet.patient.dto;

import com.cabinet.patient.enums.GroupeSanguin;

public record PatientResponse(
        Long id,
        String nom,
        String prenom,
        GroupeSanguin groupeSanguin,
        String telephone
) {}