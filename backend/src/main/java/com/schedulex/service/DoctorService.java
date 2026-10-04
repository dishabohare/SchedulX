package com.schedulex.service;

import com.schedulex.dto.UserResponseDTO;
import com.schedulex.entity.Role;
import com.schedulex.entity.User;
import com.schedulex.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.schedulex.exception.ResourceNotFoundException;
import java.util.List;

@Service
public class DoctorService {

    private final UserRepository userRepository;

    public DoctorService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponseDTO> getAllDoctors() {

        return userRepository.findByRole(Role.DOCTOR)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public UserResponseDTO getDoctorById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        if (user.getRole() != Role.DOCTOR) {
            throw new RuntimeException("User is not a doctor");
        }

        return convertToDTO(user);
    }

    private UserResponseDTO convertToDTO(User user) {

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getDepartment()
        );
    }
}