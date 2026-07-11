package com.projects.RideShare.service;

import com.projects.RideShare.entity.Booking;
import com.projects.RideShare.entity.BookingStatus;
import com.projects.RideShare.entity.Review;
import com.projects.RideShare.entity.Ride;
import com.projects.RideShare.entity.User;
import com.projects.RideShare.repository.BookingRepository;
import com.projects.RideShare.repository.ReviewRepository;
import com.projects.RideShare.repository.RideRepository;
import com.projects.RideShare.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            BookingRepository bookingRepository,
            RideRepository rideRepository,
            UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
    }

    public Review createReview(Review review, String reviewerEmail) {
        // Fetch passenger user
        User user = userRepository.findByEmail(reviewerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Force reviewer name to match full name
        review.setReviewerName(user.getFullName());

        // Validate booking status
        // A user can only write a review for a driver if they had an APPROVED booking with that driver
        List<Booking> bookings = bookingRepository.findByPassengerEmail(reviewerEmail);
        
        boolean hasApprovedBooking = false;
        for (Booking booking : bookings) {
            if (booking.getBookingStatus() == BookingStatus.APPROVED) {
                Optional<Ride> optionalRide = rideRepository.findById(booking.getRideId());
                if (optionalRide.isPresent()) {
                    Ride ride = optionalRide.get();
                    if ((ride.getDriverName() != null && ride.getDriverName().equalsIgnoreCase(review.getReviewFor())) ||
                        (ride.getDriverEmail() != null && ride.getDriverEmail().equalsIgnoreCase(review.getReviewFor()))) {
                        hasApprovedBooking = true;
                        break;
                    }
                }
            }
        }

        if (!hasApprovedBooking) {
            throw new RuntimeException("You can only review drivers for rides you have booked and been approved for.");
        }

        return reviewRepository.save(review);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
}