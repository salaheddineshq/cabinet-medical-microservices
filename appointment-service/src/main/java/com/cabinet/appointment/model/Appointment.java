package com.cabinet.appointment.model;

import com.cabinet.appointment.enums.MotifConsultation;
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
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MotifConsultation motif;

    @Column(nullable = false, length = 100)
    private String medecin;

    @Column(nullable = false)
    private Long patientId;

    @Column(length = 2000)
    private String remarques;
}
