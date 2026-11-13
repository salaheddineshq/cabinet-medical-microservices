package com.cabinet.patient.service;

import com.cabinet.patient.dto.PatientRequest;
import com.cabinet.patient.dto.PatientResponse;
import java.util.List;

public interface PatientService {
    List<PatientResponse> findAll();
    PatientResponse findById(Long id);
    PatientResponse create(PatientRequest request);
    PatientResponse update(Long id, PatientRequest request);
    void delete(Long id);
}