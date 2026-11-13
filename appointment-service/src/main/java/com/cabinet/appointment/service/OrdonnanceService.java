// OrdonnanceService.java
package com.cabinet.appointment.service;

import com.cabinet.appointment.dto.OrdonnanceRequest;
import com.cabinet.appointment.dto.OrdonnanceResponse;
import java.util.List;

public interface OrdonnanceService {
    List<OrdonnanceResponse> findByAppointment(Long appointmentId);
    OrdonnanceResponse create(OrdonnanceRequest request);
}
