package com.cabinet.appointment.controller;

import com.cabinet.appointment.dto.CertificatRequest;
import com.cabinet.appointment.dto.CertificatResponse;
import com.cabinet.appointment.service.CertificatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/certificats")
@RequiredArgsConstructor
public class CertificatController {

    private final CertificatService certificatService;

    @GetMapping("/appointment/{appointmentId}")
    public List<CertificatResponse> getByAppointment(@PathVariable Long appointmentId) {
        return certificatService.findByAppointment(appointmentId);
    }

    @PostMapping
    public ResponseEntity<CertificatResponse> create(@Valid @RequestBody CertificatRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(certificatService.create(request));
    }
}
