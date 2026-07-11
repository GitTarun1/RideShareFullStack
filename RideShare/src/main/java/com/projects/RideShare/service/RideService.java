package com.projects.RideShare.service;

import com.projects.RideShare.entity.Ride;
import com.projects.RideShare.repository.RideRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RideService {

    private final RideRepository rideRepository;

    public RideService(RideRepository rideRepository) {
        this.rideRepository = rideRepository;
    }

    public Ride createRide(Ride ride) {
        return rideRepository.save(ride);
    }
    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }
    public List<Ride> searchRides(
            String source,
            String destination
    ) {
        return rideRepository
                .findBySourceAndDestination(
                        source,
                        destination
                );
    }
    public Ride updateRide(Long id, Ride updatedRide) {

        Ride existingRide = rideRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ride not found"));

        existingRide.setSource(updatedRide.getSource());
        existingRide.setDestination(updatedRide.getDestination());
        existingRide.setAvailableSeats(updatedRide.getAvailableSeats());
        existingRide.setPricePerSeat(updatedRide.getPricePerSeat());
        existingRide.setDriverName(updatedRide.getDriverName());
        existingRide.setVehicleName(updatedRide.getVehicleName());
        existingRide.setDepartureDate(updatedRide.getDepartureDate());
        existingRide.setDepartureTime(updatedRide.getDepartureTime());

        return rideRepository.save(existingRide);
    }
    public void deleteRide(Long id) {

        rideRepository.deleteById(id);
    }
}