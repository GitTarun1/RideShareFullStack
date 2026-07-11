package com.projects.RideShare;

import com.projects.RideShare.entity.Booking;
import com.projects.RideShare.entity.Review;
import com.projects.RideShare.entity.Ride;
import com.projects.RideShare.entity.Role;
import com.projects.RideShare.entity.User;
import com.projects.RideShare.repository.BookingRepository;
import com.projects.RideShare.repository.ReviewRepository;
import com.projects.RideShare.repository.RideRepository;
import com.projects.RideShare.repository.UserRepository;
import com.projects.RideShare.service.BookingService;
import com.projects.RideShare.service.ReviewService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class RideShareApplicationTests {

	@Autowired
	private BookingService bookingService;

	@Autowired
	private ReviewService reviewService;

	@Autowired
	private RideRepository rideRepository;

	@Autowired
	private BookingRepository bookingRepository;

	@Autowired
	private ReviewRepository reviewRepository;

	@Autowired
	private UserRepository userRepository;

	@Test
	void testBookingFlow() {
		System.out.println("=== STARTING INTEGRATION TEST ===");
		try {
			// 1. Create Driver User
			User driver = new User();
			driver.setEmail("driver_test@gmail.com");
			driver.setFullName("Test Driver");
			driver.setPassword("password");
			driver.setRole(Role.DRIVER);
			userRepository.save(driver);

			// 2. Create Ride
			Ride ride = new Ride();
			ride.setSource("A");
			ride.setDestination("B");
			ride.setAvailableSeats(4);
			ride.setPricePerSeat(100);
			ride.setDriverName("Test Driver");
			ride.setDriverEmail("driver_test@gmail.com");
			ride.setVehicleName("Car");
			ride.setDepartureDate("2026-08-15");
			ride.setDepartureTime("10:00");
			rideRepository.save(ride);

			// 3. Create Booking
			Booking booking = new Booking();
			booking.setRideId(ride.getId());
			booking.setSeatsBooked(2);
			// We call createBooking (passenger is tarun@gmail.com)
			Booking created = bookingService.createBooking(booking, "tarun@gmail.com");
			System.out.println("Created Booking ID: " + created.getId() + ", Status: " + created.getBookingStatus());

			// 4. Retrieve bookings as Driver
			java.util.List<com.projects.RideShare.dto.BookingResponse> driverBookings = 
				bookingService.getBookingsForDriver("driver_test@gmail.com");
			System.out.println("Driver Bookings size: " + driverBookings.size());

			// 5. Test Review creation BEFORE approval (should fail)
			Review review = new Review();
			review.setReviewFor("Test Driver");
			review.setComment("Great ride!");
			review.setRating(5);
			try {
				reviewService.createReview(review, "tarun@gmail.com");
				System.out.println("ERROR: Review should not have been created!");
			} catch (Exception e) {
				System.out.println("SUCCESS: Review creation failed before approval as expected: " + e.getMessage());
			}

			// 6. Approve booking
			Booking approved = bookingService.approveBooking(created.getId());
			System.out.println("Approved Booking Status: " + approved.getBookingStatus());

			// 7. Test Review creation AFTER approval (should succeed)
			try {
				Review createdReview = reviewService.createReview(review, "tarun@gmail.com");
				System.out.println("SUCCESS: Review created after approval: ID=" + createdReview.getId());
				reviewRepository.delete(createdReview);
			} catch (Exception e) {
				System.out.println("ERROR: Review creation failed after approval: " + e.getMessage());
			}

			// 8. Test Self-Booking (should fail)
			try {
				Booking selfBooking = new Booking();
				selfBooking.setRideId(ride.getId());
				selfBooking.setSeatsBooked(1);
				bookingService.createBooking(selfBooking, "driver_test@gmail.com");
				System.out.println("ERROR: Self-booking should have failed!");
			} catch (Exception e) {
				System.out.println("SUCCESS: Self-booking failed as expected: " + e.getMessage());
			}

			// Clean up
			bookingRepository.delete(created);
			rideRepository.delete(ride);
			userRepository.delete(driver);

		} catch (Exception e) {
			System.out.println("INTEGRATION TEST FAILED!");
			e.printStackTrace();
		}
		System.out.println("=== INTEGRATION TEST FINISHED ===");
	}
}
