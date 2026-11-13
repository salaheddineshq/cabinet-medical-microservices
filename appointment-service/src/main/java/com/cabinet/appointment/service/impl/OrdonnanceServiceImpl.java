// OrdonnanceServiceImpl.java
package com.cabinet.appointment.service.impl;

import com.cabinet.appointment.dto.OrdonnanceRequest;
import com.cabinet.appointment.dto.OrdonnanceResponse;
import com.cabinet.appointment.exception.ResourceNotFoundException;
import com.cabinet.appointment.mapper.OrdonnanceMapper;
import com.cabinet.appointment.model.Ordonnance;
import com.cabinet.appointment.repository.AppointmentRepository;
import com.cabinet.appointment.repository.OrdonnanceRepository;
import com.cabinet.appointment.service.OrdonnanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrdonnanceServiceImpl implements OrdonnanceService {

    private final OrdonnanceRepository ordonnanceRepository;
    private final AppointmentRepository appointmentRepository;
    private final OrdonnanceMapper ordonnanceMapper;

    @Override
    @Transactional(readOnly = true)
    public List<OrdonnanceResponse> findByAppointment(Long appointmentId) {
        return ordonnanceMapper.toResponseList(ordonnanceRepository.findByAppointmentId(appointmentId));
    }

    @Override
    @Transactional
    public OrdonnanceResponse create(OrdonnanceRequest request) {
        if (!appointmentRepository.existsById(request.appointmentId())) {
            throw new ResourceNotFoundException("Rendez-vous", request.appointmentId());
        }
        Ordonnance ordonnance = ordonnanceMapper.toEntity(request);
        ordonnance.setDateEmission(LocalDate.now());
        return ordonnanceMapper.toResponse(ordonnanceRepository.save(ordonnance));
    }
}
