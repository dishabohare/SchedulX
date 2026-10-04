package com.schedulex.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class DoctorAvailabilityResponseDTO {

    private Long id;

    private Long doctorId;
    private String doctorName;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    public DoctorAvailabilityResponseDTO() {}

    public DoctorAvailabilityResponseDTO(
            Long id,
            Long doctorId,
            String doctorName,
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime) {

        this.id = id;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getId() {
        return id;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public LocalDate getDate() {
        return date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }
}