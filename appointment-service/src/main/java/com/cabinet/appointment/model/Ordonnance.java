package com.cabinet.appointment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ordonnance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long appointmentId;

    private LocalDate dateEmission;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ordonnance_medicaments", joinColumns = @JoinColumn(name = "ordonnance_id"))
    @Column(name = "ligne", length = 500)
    private List<String> medicaments;
}
