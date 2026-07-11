package com.projects.RideShare.repository;

import com.projects.RideShare.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository
        extends JpaRepository<Review, Long> {
}
