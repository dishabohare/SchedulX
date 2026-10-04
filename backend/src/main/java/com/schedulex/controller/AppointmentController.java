package com.schedulex.controller;

import com.schedulex.dto.AppointmentResponseDTO;
import com.schedulex.entity.Appointment;
import com.schedulex.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(
            AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public AppointmentResponseDTO createAppointment(
            @RequestParam Long doctorId,
            @RequestParam Long patientId,
            @Valid @RequestBody Appointment appointment) {

        return appointmentService.createAppointment(
                doctorId,
                patientId,
                appointment
        );
    }

    @GetMapping("/doctor/{doctorId}")
    public List<AppointmentResponseDTO> getDoctorAppointments(
            @PathVariable Long doctorId) {

        return appointmentService.getDoctorAppointments(doctorId);
    }

    @GetMapping("/patient/{patientId}")
    public List<AppointmentResponseDTO> getPatientAppointments(
            @PathVariable Long patientId) {

        return appointmentService.getPatientAppointments(patientId);
    }

    @PatchMapping("/{appointmentId}/cancel")
    public AppointmentResponseDTO cancelAppointment(
            @PathVariable Long appointmentId) {

        return appointmentService.cancelAppointment(appointmentId);
    }

    @PatchMapping("/{appointmentId}/complete")
    public AppointmentResponseDTO completeAppointment(
            @PathVariable Long appointmentId) {

        return appointmentService.completeAppointment(appointmentId);
    }

    @PutMapping("/{appointmentId}/reschedule")
    public AppointmentResponseDTO rescheduleAppointment(
            @PathVariable Long appointmentId,
            @RequestParam LocalDate newDate,
            @RequestParam LocalTime newStartTime,
            @RequestParam LocalTime newEndTime) {

        return appointmentService.rescheduleAppointment(
                appointmentId,
                newDate,
                newStartTime,
                newEndTime
        );
    }
}