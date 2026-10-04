package com.schedulex.repository;

import com.schedulex.entity.DoctorAvailability;
import com.schedulex.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DoctorAvailabilityRepository
        extends JpaRepository<DoctorAvailability, Long> {

    List<DoctorAvailability> findByDoctor(User doctor);

    List<DoctorAvailability> findByDoctorAndDate(
            User doctor,
            LocalDate date
    );
}