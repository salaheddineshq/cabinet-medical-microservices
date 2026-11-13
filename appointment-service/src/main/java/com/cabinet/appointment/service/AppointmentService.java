package com.cabinet.appointment.service;

import com.cabinet.appointment.dto.AppointmentRequest;
import com.cabinet.appointment.dto.AppointmentResponse;
import com.cabinet.appointment.dto.RemarquesRequest;
import java.util.List;

public interface AppointmentService {
    List<AppointmentResponse> findAll();
    AppointmentResponse findById(Long id);
    AppointmentResponse create(AppointmentRequest request);
    AppointmentResponse updateRemarques(Long id, RemarquesRequest request);
    void delete(Long id);
}
