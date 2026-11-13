package com.cabinet.appointment.mapper;

import com.cabinet.appointment.dto.CertificatRequest;
import com.cabinet.appointment.dto.CertificatResponse;
import com.cabinet.appointment.model.Certificat;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CertificatMapper {
    CertificatResponse toResponse(Certificat certificat);
    List<CertificatResponse> toResponseList(List<Certificat> certificats);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateEmission", ignore = true)
    Certificat toEntity(CertificatRequest request);
}
