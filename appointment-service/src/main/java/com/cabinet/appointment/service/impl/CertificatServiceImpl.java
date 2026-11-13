// CertificatServiceImpl.java
package com.cabinet.appointment.service.impl;

import com.cabinet.appointment.dto.CertificatRequest;
import com.cabinet.appointment.dto.CertificatResponse;
import com.cabinet.appointment.exception.BusinessRuleException;
import com.cabinet.appointment.exception.ResourceNotFoundException;
import com.cabinet.appointment.mapper.CertificatMapper;
import com.cabinet.appointment.model.Certificat;
import com.cabinet.appointment.repository.AppointmentRepository;
import com.cabinet.appointment.repository.CertificatRepository;
import com.cabinet.appointment.service.CertificatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificatServiceImpl implements CertificatService {

    private final CertificatRepository certificatRepository;
    private final AppointmentRepository appointmentRepository;
    private final CertificatMapper certificatMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CertificatResponse> findByAppointment(Long appointmentId) {
        return certificatMapper.toResponseList(certificatRepository.findByAppointmentId(appointmentId));
    }

    @Override
    @Transactional
    public CertificatResponse create(CertificatRequest request) {
        if (!appointmentRepository.existsById(request.appointmentId())) {
            throw new ResourceNotFoundException("Rendez-vous", request.appointmentId());
        }
        if (request.dateFin().isBefore(request.dateDebut())) {
            throw new BusinessRuleException("La date de fin ne peut pas être antérieure à la date de début");
        }
        Certificat certificat = certificatMapper.toEntity(request);
        certificat.setDateEmission(LocalDate.now());
        return certificatMapper.toResponse(certificatRepository.save(certificat));
    }
}
