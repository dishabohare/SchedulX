package com.schedulex.controller;

import com.schedulex.dto.DoctorAvailabilityResponseDTO;
import com.schedulex.entity.DoctorAvailability;
import com.schedulex.service.DoctorAvailabilityService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorAvailabilityController {

    private final DoctorAvailabilityService availabilityService;

    public DoctorAvailabilityController(
            DoctorAvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @PostMapping("/{doctorId}/availability")
    public DoctorAvailabilityResponseDTO createAvailability(
            @PathVariable Long doctorId,
            @Valid @RequestBody DoctorAvailability availability) {

        return availabilityService.createAvailability(
                doctorId,
                availability
        );
    }

    @GetMapping("/{doctorId}/availability")
    public List<DoctorAvailabilityResponseDTO> getDoctorAvailability(
            @PathVariable Long doctorId) {

        return availabilityService.getDoctorAvailability(doctorId);
    }

    @GetMapping("/{doctorId}/availability/by-date")
    public List<DoctorAvailabilityResponseDTO> getAvailabilityByDate(
            @PathVariable Long doctorId,
            @RequestParam LocalDate date) {

        return availabilityService.getAvailabilityByDate(
                doctorId,
                date
        );
    }
}