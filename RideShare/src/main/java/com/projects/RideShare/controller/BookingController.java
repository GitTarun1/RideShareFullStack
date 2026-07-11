package com.projects.RideShare.controller;

import com.projects.RideShare.entity.Booking;
import com.projects.RideShare.service.BookingService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import com.projects.RideShare.dto.BookingResponse;
import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(
            BookingService bookingService) {

        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking createBooking(
            @RequestBody Booking booking,
            Authentication authentication) {

        return bookingService.createBooking(
                booking,
                authentication.getName()
        );
    }

    @GetMapping
    public List<BookingResponse> getAllBookings(
            Authentication authentication) {
        return bookingService.getBookingsForUser(
                authentication.getName()
        );
    }
    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(
            @PathVariable Long id) {

        return bookingService
                .cancelBooking(id);
    }

    @GetMapping("/driver")
    public List<BookingResponse> getBookingsForDriver(
            Authentication authentication) {
        return bookingService.getBookingsForDriver(
                authentication.getName()
        );
    }

    @PutMapping("/{id}/approve")
    public Booking approveBooking(
            @PathVariable Long id) {
        return bookingService.approveBooking(id);
    }
}
