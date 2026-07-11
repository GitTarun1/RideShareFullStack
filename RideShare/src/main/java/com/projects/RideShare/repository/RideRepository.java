package com.projects.RideShare.repository;

import com.projects.RideShare.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findBySourceAndDestination(
            String source,
            String destination
    );

    List<Ride> findByDriverEmail(String driverEmail);
}