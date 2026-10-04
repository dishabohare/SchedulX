package com.schedulex.repository;

import com.schedulex.entity.Appointment;
import com.schedulex.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDoctor(User doctor);

    List<Appointment> findByPatient(User patient);

    List<Appointment> findByDoctorAndAppointmentDate(
            User doctor,
            LocalDate appointmentDate
    );

    List<Appointment> findByPatientAndAppointmentDate(
            User patient,
            LocalDate appointmentDate
    );

    List<Appointment> findByDoctorAndAppointmentDateAndStartTimeLessThanAndEndTimeGreaterThan(
            User doctor,
            LocalDate appointmentDate,
            LocalTime endTime,
            LocalTime startTime
    );
}