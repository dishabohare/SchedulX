package com.schedulex.service;

import com.schedulex.dto.AppointmentResponseDTO;
import com.schedulex.entity.Appointment;
import com.schedulex.entity.AppointmentStatus;
import com.schedulex.entity.DoctorAvailability;
import com.schedulex.entity.Role;
import com.schedulex.entity.User;
import com.schedulex.exception.ResourceNotFoundException;
import com.schedulex.repository.AppointmentRepository;
import com.schedulex.repository.DoctorAvailabilityRepository;
import com.schedulex.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorAvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            DoctorAvailabilityRepository availabilityRepository,
            UserRepository userRepository) {

        this.appointmentRepository = appointmentRepository;
        this.availabilityRepository = availabilityRepository;
        this.userRepository = userRepository;
    }

    public AppointmentResponseDTO createAppointment(
            Long doctorId,
            Long patientId,
            Appointment appointment) {

        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        User patient = userRepository.findById(patientId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException("Selected user is not a doctor");
        }

        if (patient.getRole() != Role.PATIENT) {
            throw new RuntimeException("Selected user is not a patient");
        }

        if (appointment.getStartTime().isAfter(appointment.getEndTime())
                || appointment.getStartTime()
                .equals(appointment.getEndTime())) {

            throw new RuntimeException(
                    "Start time must be before end time"
            );
        }

        if (appointment.getAppointmentDate()
                .isBefore(LocalDate.now())) {

            throw new RuntimeException(
                    "Appointment date cannot be in the past"
            );
        }

        List<DoctorAvailability> availabilities =
                availabilityRepository.findByDoctorAndDate(
                        doctor,
                        appointment.getAppointmentDate()
                );

        boolean doctorAvailable = availabilities.stream()
                .anyMatch(availability ->
                        !appointment.getStartTime()
                                .isBefore(availability.getStartTime())
                        &&
                        !appointment.getEndTime()
                                .isAfter(availability.getEndTime())
                );

        if (!doctorAvailable) {
            throw new RuntimeException(
                    "Doctor is not available during this time"
            );
        }

        List<Appointment> existingAppointments =
                appointmentRepository
                        .findByDoctorAndAppointmentDateAndStartTimeLessThanAndEndTimeGreaterThan(
                                doctor,
                                appointment.getAppointmentDate(),
                                appointment.getEndTime(),
                                appointment.getStartTime()
                        );

        boolean conflictExists = existingAppointments.stream()
                .anyMatch(existing ->
                        existing.getStatus()
                                != AppointmentStatus.CANCELLED
                );

        if (conflictExists) {
            throw new RuntimeException(
                    "Doctor already has an appointment during this time"
            );
        }

        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setStatus(AppointmentStatus.SCHEDULED);

        Appointment savedAppointment =
                appointmentRepository.save(appointment);

        return convertToDTO(savedAppointment);
    }

    public List<AppointmentResponseDTO> getDoctorAppointments(
            Long doctorId) {

        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException("User is not a doctor");
        }

        return appointmentRepository.findByDoctor(doctor)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<AppointmentResponseDTO> getPatientAppointments(
            Long patientId) {

        User patient = userRepository.findById(patientId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        if (patient.getRole() != Role.PATIENT) {
            throw new RuntimeException("User is not a patient");
        }

        return appointmentRepository.findByPatient(patient)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public AppointmentResponseDTO cancelAppointment(
            Long appointmentId) {

        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Appointment not found"));

        if (appointment.getStatus() != AppointmentStatus.SCHEDULED) {
            throw new RuntimeException(
                    "Only scheduled appointments can be cancelled"
            );
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);

        Appointment savedAppointment =
                appointmentRepository.save(appointment);

        return convertToDTO(savedAppointment);
    }

    public AppointmentResponseDTO completeAppointment(
            Long appointmentId) {

        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Appointment not found"));

        if (appointment.getStatus() != AppointmentStatus.SCHEDULED) {
            throw new RuntimeException(
                    "Only scheduled appointments can be completed"
            );
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);

        Appointment savedAppointment =
                appointmentRepository.save(appointment);

        return convertToDTO(savedAppointment);
    }

    public AppointmentResponseDTO rescheduleAppointment(
            Long appointmentId,
            LocalDate newDate,
            LocalTime newStartTime,
            LocalTime newEndTime) {

        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Appointment not found"));

        if (appointment.getStatus() != AppointmentStatus.SCHEDULED) {
            throw new RuntimeException(
                    "Only scheduled appointments can be rescheduled"
            );
        }

        if (newStartTime.isAfter(newEndTime)
                || newStartTime.equals(newEndTime)) {

            throw new RuntimeException(
                    "Start time must be before end time"
            );
        }

        if (newDate.isBefore(LocalDate.now())) {
            throw new RuntimeException(
                    "Appointment date cannot be in the past"
            );
        }

        User doctor = appointment.getDoctor();

        List<DoctorAvailability> availabilities =
                availabilityRepository.findByDoctorAndDate(
                        doctor,
                        newDate
                );

        boolean doctorAvailable = availabilities.stream()
                .anyMatch(availability ->
                        !newStartTime.isBefore(
                                availability.getStartTime())
                        &&
                        !newEndTime.isAfter(
                                availability.getEndTime())
                );

        if (!doctorAvailable) {
            throw new RuntimeException(
                    "Doctor is not available during this time"
            );
        }

        List<Appointment> existingAppointments =
                appointmentRepository
                        .findByDoctorAndAppointmentDateAndStartTimeLessThanAndEndTimeGreaterThan(
                                doctor,
                                newDate,
                                newEndTime,
                                newStartTime
                        );

        boolean conflictExists = existingAppointments.stream()
                .anyMatch(existing ->
                        !existing.getId().equals(appointmentId)
                        &&
                        existing.getStatus()
                                != AppointmentStatus.CANCELLED
                );

        if (conflictExists) {
            throw new RuntimeException(
                    "Doctor already has another appointment during this time"
            );
        }

        appointment.setAppointmentDate(newDate);
        appointment.setStartTime(newStartTime);
        appointment.setEndTime(newEndTime);

        Appointment savedAppointment =
                appointmentRepository.save(appointment);

        return convertToDTO(savedAppointment);
    }

    private AppointmentResponseDTO convertToDTO(
            Appointment appointment) {

        return new AppointmentResponseDTO(
                appointment.getId(),

                appointment.getDoctor().getId(),
                appointment.getDoctor().getName(),

                appointment.getPatient().getId(),
                appointment.getPatient().getName(),

                appointment.getAppointmentDate(),
                appointment.getStartTime(),
                appointment.getEndTime(),

                appointment.getStatus(),
                appointment.getReason()
        );
    }
}