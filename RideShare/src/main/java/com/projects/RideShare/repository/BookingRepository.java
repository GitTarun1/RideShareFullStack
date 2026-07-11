package com.projects.RideShare.repository;

import com.projects.RideShare.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    List<Booking> findByPassengerEmail(String passengerEmail);

    List<Booking> findByRideIdIn(List<Long> rideIds);
}