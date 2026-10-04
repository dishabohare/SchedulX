package com.schedulex.controller;

import com.schedulex.dto.UserResponseDTO;
import com.schedulex.service.DoctorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public List<UserResponseDTO> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{id}")
    public UserResponseDTO getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id);
    }
}