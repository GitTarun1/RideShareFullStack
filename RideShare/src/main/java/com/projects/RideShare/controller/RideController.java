package com.projects.RideShare.controller;

import com.projects.RideShare.entity.Ride;
import com.projects.RideShare.service.RideService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/rides")
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    @PostMapping
    public Ride createRide(
            @RequestBody Ride ride,
            Authentication authentication) {

        ride.setDriverEmail(authentication.getName());
        return rideService.createRide(ride);
    }
    @GetMapping
    public List<Ride> getAllRides() {
        return rideService.getAllRides();
    }
    @GetMapping("/search")
    public List<Ride> searchRides(
            @RequestParam String source,
            @RequestParam String destination
    ) {

        return rideService.searchRides(
                source,
                destination
        );
    }
    @PutMapping("/{id}")
    public Ride updateRide(
            @PathVariable Long id,
            @RequestBody Ride ride) {

        return rideService.updateRide(id, ride);
    }
    @DeleteMapping("/{id}")
    public String deleteRide(
            @PathVariable Long id) {

        rideService.deleteRide(id);

        return "Ride deleted successfully";
    }
}