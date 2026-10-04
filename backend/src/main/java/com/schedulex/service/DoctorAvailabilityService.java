package com.schedulex.service;

import com.schedulex.dto.DoctorAvailabilityResponseDTO;
import com.schedulex.entity.DoctorAvailability;
import com.schedulex.entity.Role;
import com.schedulex.entity.User;
import com.schedulex.exception.ResourceNotFoundException;
import com.schedulex.repository.DoctorAvailabilityRepository;
import com.schedulex.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DoctorAvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;

    public DoctorAvailabilityService(
            DoctorAvailabilityRepository availabilityRepository,
            UserRepository userRepository) {

        this.availabilityRepository = availabilityRepository;
        this.userRepository = userRepository;
    }

    public DoctorAvailabilityResponseDTO createAvailability(
            Long doctorId,
            DoctorAvailability availability) {

        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException("User is not a doctor");
        }

        if (availability.getStartTime().isAfter(availability.getEndTime())
                || availability.getStartTime()
                .equals(availability.getEndTime())) {

            throw new RuntimeException(
                    "Start time must be before end time"
            );
        }

        availability.setDoctor(doctor);

        DoctorAvailability savedAvailability =
                availabilityRepository.save(availability);

        return convertToDTO(savedAvailability);
    }

    public List<DoctorAvailabilityResponseDTO> getDoctorAvailability(
            Long doctorId) {

        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException("User is not a doctor");
        }

        return availabilityRepository.findByDoctor(doctor)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<DoctorAvailabilityResponseDTO> getAvailabilityByDate(
            Long doctorId,
            LocalDate date) {

        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException("User is not a doctor");
        }

        return availabilityRepository.findByDoctorAndDate(
                        doctor,
                        date
                )
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public DoctorAvailabilityResponseDTO updateAvailability(
            Long availabilityId,
            DoctorAvailability updatedAvailability) {

        DoctorAvailability existingAvailability =
                availabilityRepository.findById(availabilityId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Availability not found"));

        if (updatedAvailability.getStartTime()
                .isAfter(updatedAvailability.getEndTime())
                || updatedAvailability.getStartTime()
                .equals(updatedAvailability.getEndTime())) {

            throw new RuntimeException(
                    "Start time must be before end time"
            );
        }

        existingAvailability.setDate(
                updatedAvailability.getDate()
        );

        existingAvailability.setStartTime(
                updatedAvailability.getStartTime()
        );

        existingAvailability.setEndTime(
                updatedAvailability.getEndTime()
        );

        DoctorAvailability savedAvailability =
                availabilityRepository.save(existingAvailability);

        return convertToDTO(savedAvailability);
    }

    public void deleteAvailability(Long availabilityId) {

        DoctorAvailability availability =
                availabilityRepository.findById(availabilityId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Availability not found"));

        availabilityRepository.delete(availability);
    }

    private DoctorAvailabilityResponseDTO convertToDTO(
            DoctorAvailability availability) {

        User doctor = availability.getDoctor();

        return new DoctorAvailabilityResponseDTO(
                availability.getId(),
                doctor.getId(),
                doctor.getName(),
                availability.getDate(),
                availability.getStartTime(),
                availability.getEndTime()
        );
    }
}