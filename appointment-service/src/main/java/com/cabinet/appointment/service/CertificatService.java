// CertificatService.java
package com.cabinet.appointment.service;

import com.cabinet.appointment.dto.CertificatRequest;
import com.cabinet.appointment.dto.CertificatResponse;
import java.util.List;

public interface CertificatService {
    List<CertificatResponse> findByAppointment(Long appointmentId);
    CertificatResponse create(CertificatRequest request);
}
