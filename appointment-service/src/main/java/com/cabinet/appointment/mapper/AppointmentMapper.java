package com.cabinet.appointment.mapper;

import com.cabinet.appointment.dto.AppointmentRequest;
import com.cabinet.appointment.dto.AppointmentResponse;
import com.cabinet.appointment.model.Appointment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {
    @Mapping(target = "patient", ignore = true)
    AppointmentResponse toResponse(Appointment appointment);

    @Mapping(target = "id", ignore = true)
    Appointment toEntity(AppointmentRequest request);
}
