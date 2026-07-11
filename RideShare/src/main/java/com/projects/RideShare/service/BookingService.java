package com.projects.RideShare.service;

import com.projects.RideShare.entity.Booking;
import com.projects.RideShare.entity.BookingStatus;
import com.projects.RideShare.repository.BookingRepository;
import org.springframework.stereotype.Service;
import com.projects.RideShare.entity.Ride;
import com.projects.RideShare.repository.RideRepository;
import java.util.List;
import java.util.Optional;
import com.projects.RideShare.repository.UserRepository;
import com.projects.RideShare.entity.User;
import com.projects.RideShare.dto.BookingResponse;
import java.util.stream.Collectors;


@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            RideRepository rideRepository,
            UserRepository userRepository) {

        this.bookingRepository = bookingRepository;
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
    }

    public List<BookingResponse> getBookingsForUser(String email) {

        return bookingRepository.findByPassengerEmail(email)

                .stream()

                .map(booking -> {

                    Ride ride = rideRepository.findById(
                            booking.getRideId()
                    ).orElse(null);

                    return new BookingResponse(

                            booking.getId(),

                            booking.getPassengerName(),

                            ride != null ? ride.getSource() : "",

                            ride != null ? ride.getDestination() : "",

                            ride != null ? ride.getDriverName() : "",

                            ride != null ? ride.getVehicleName() : "",

                            ride != null ? ride.getPricePerSeat() : 0,

                            booking.getSeatsBooked(),

                            booking.getBookingStatus()
                    );

                })

                .collect(Collectors.toList());

    }
    public Booking createBooking(
            Booking booking,
            String email){
        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        booking.setPassengerName(
                user.getFullName()
        );
        booking.setPassengerEmail(
                user.getEmail()
        );
        Optional<Ride> optionalRide =
                rideRepository.findById(
                        booking.getRideId()
                );

        if(optionalRide.isEmpty()) {
            throw new RuntimeException(
                    "Ride not found"
            );
        }

        Ride ride = optionalRide.get();

        if (ride.getDriverEmail() != null && ride.getDriverEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException(
                    "You cannot book your own offered ride"
            );
        }

        if(ride.getAvailableSeats()
                < booking.getSeatsBooked()) {

            throw new RuntimeException(
                    "Not enough seats available"
            );
        }

        ride.setAvailableSeats(
                ride.getAvailableSeats()
                        - booking.getSeatsBooked()
        );

        rideRepository.save(ride);

        booking.setBookingStatus(
                BookingStatus.PENDING
        );

        return bookingRepository.save(
                booking
        );
    }
    public Booking cancelBooking(Long bookingId) {

        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found"
                        ));
        if (booking.getBookingStatus()
                == BookingStatus.CANCELLED) {

            throw new RuntimeException(
                    "Booking already cancelled"
            );
        }
        Ride ride = rideRepository
                .findById(booking.getRideId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ride not found"
                        ));

        ride.setAvailableSeats(
                ride.getAvailableSeats()
                        + booking.getSeatsBooked()
        );

        rideRepository.save(ride);

        booking.setBookingStatus(
                BookingStatus.CANCELLED
        );

        return bookingRepository.save(booking);
    }

    public List<BookingResponse> getBookingsForDriver(String driverEmail) {
        List<Long> rideIds = rideRepository.findByDriverEmail(driverEmail)
                .stream()
                .map(Ride::getId)
                .collect(Collectors.toList());

        if (rideIds.isEmpty()) {
            return List.of();
        }

        return bookingRepository.findByRideIdIn(rideIds)
                .stream()
                .map(booking -> {
                    Ride ride = rideRepository.findById(booking.getRideId()).orElse(null);
                    return new BookingResponse(
                            booking.getId(),
                            booking.getPassengerName(),
                            ride != null ? ride.getSource() : "",
                            ride != null ? ride.getDestination() : "",
                            ride != null ? ride.getDriverName() : "",
                            ride != null ? ride.getVehicleName() : "",
                            ride != null ? ride.getPricePerSeat() : 0,
                            booking.getSeatsBooked(),
                            booking.getBookingStatus()
                    );
                })
                .collect(Collectors.toList());
    }

    public Booking approveBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getBookingStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not in PENDING status");
        }

        booking.setBookingStatus(BookingStatus.APPROVED);
        return bookingRepository.save(booking);
    }
}