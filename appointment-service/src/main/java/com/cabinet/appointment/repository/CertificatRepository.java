package com.cabinet.appointment.repository;

import com.cabinet.appointment.model.Certificat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CertificatRepository extends JpaRepository<Certificat, Long> {
    List<Certificat> findByAppointmentId(Long appointmentId);
}
