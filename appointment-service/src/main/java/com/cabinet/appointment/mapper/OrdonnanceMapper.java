package com.cabinet.appointment.mapper;

import com.cabinet.appointment.dto.OrdonnanceRequest;
import com.cabinet.appointment.dto.OrdonnanceResponse;
import com.cabinet.appointment.model.Ordonnance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface OrdonnanceMapper {
    OrdonnanceResponse toResponse(Ordonnance ordonnance);
    List<OrdonnanceResponse> toResponseList(List<Ordonnance> ordonnances);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateEmission", ignore = true)
    Ordonnance toEntity(OrdonnanceRequest request);
}
