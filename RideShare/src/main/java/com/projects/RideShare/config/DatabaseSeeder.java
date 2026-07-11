package com.projects.RideShare.config;

import com.projects.RideShare.entity.*;
import com.projects.RideShare.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository,
                          RideRepository rideRepository,
                          ReviewRepository reviewRepository,
                          BookingRepository bookingRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Clearing database tables...");
        bookingRepository.deleteAll();
        reviewRepository.deleteAll();
        rideRepository.deleteAll();
        userRepository.deleteAll();

        System.out.println("Seeding mock database data...");

        // 1. Create Users
        User tarun = new User();
        tarun.setFullName("Tarun K. Chintalapudi");
        tarun.setEmail("tarunk.chintalapudi@gmail.com");
        tarun.setPassword(passwordEncoder.encode("Password123!"));
        tarun.setRole(Role.USER);

        User amit = new User();
        amit.setFullName("Amit Sharma");
        amit.setEmail("amit@example.com");
        amit.setPassword(passwordEncoder.encode("Password123!"));
        amit.setRole(Role.USER);

        User priya = new User();
        priya.setFullName("Priya Patel");
        priya.setEmail("priya@example.com");
        priya.setPassword(passwordEncoder.encode("Password123!"));
        priya.setRole(Role.USER);

        User rohit = new User();
        rohit.setFullName("Rohit Verma");
        rohit.setEmail("rohit@example.com");
        rohit.setPassword(passwordEncoder.encode("Password123!"));
        rohit.setRole(Role.USER);

        userRepository.saveAll(List.of(tarun, amit, priya, rohit));

        // 2. Create Rides
        Ride ride1 = new Ride();
        ride1.setSource("Gurgaon Hub");
        ride1.setDestination("Noida Cyber City");
        ride1.setAvailableSeats(3);
        ride1.setPricePerSeat(150.0);
        ride1.setDriverName("Amit Sharma");
        ride1.setDriverEmail("amit@example.com");
        ride1.setVehicleName("Honda City");
        ride1.setDepartureDate("2026-07-15");
        ride1.setDepartureTime("09:00 AM");

        Ride ride2 = new Ride();
        ride2.setSource("Delhi Airport");
        ride2.setDestination("Connaught Place");
        ride2.setAvailableSeats(2);
        ride2.setPricePerSeat(200.0);
        ride2.setDriverName("Priya Patel");
        ride2.setDriverEmail("priya@example.com");
        ride2.setVehicleName("Maruti Swift");
        ride2.setDepartureDate("2026-07-16");
        ride2.setDepartureTime("02:30 PM");

        Ride ride3 = new Ride();
        ride3.setSource("Noida Sector 62");
        ride3.setDestination("Bangalore Tech Park");
        ride3.setAvailableSeats(4);
        ride3.setPricePerSeat(1800.0);
        ride3.setDriverName("Rohit Verma");
        ride3.setDriverEmail("rohit@example.com");
        ride3.setVehicleName("Hyundai Creta");
        ride3.setDepartureDate("2026-07-18");
        ride3.setDepartureTime("06:00 AM");

        Ride ride4 = new Ride();
        ride4.setSource("Gurgaon Sector 56");
        ride4.setDestination("Delhi University");
        ride4.setAvailableSeats(4);
        ride4.setPricePerSeat(120.0);
        ride4.setDriverName("Amit Sharma");
        ride4.setDriverEmail("amit@example.com");
        ride4.setVehicleName("Honda City");
        ride4.setDepartureDate("2026-07-15");
        ride4.setDepartureTime("04:30 PM");

        rideRepository.saveAll(List.of(ride1, ride2, ride3, ride4));

        // 3. Create Reviews
        Review review1 = new Review();
        review1.setReviewerName("Priya Patel");
        review1.setReviewFor("Amit Sharma");
        review1.setRating(5);
        review1.setComment("Very safe driver, reached on time!");

        Review review2 = new Review();
        review2.setReviewerName("Rohit Verma");
        review2.setReviewFor("Amit Sharma");
        review2.setRating(4);
        review2.setComment("Nice clean car and friendly behavior.");

        Review review3 = new Review();
        review3.setReviewerName("Amit Sharma");
        review3.setReviewFor("Priya Patel");
        review3.setRating(5);
        review3.setComment("Punctual and very smooth ride.");

        Review review4 = new Review();
        review4.setReviewerName("Amit Sharma");
        review4.setReviewFor("Tarun K. Chintalapudi");
        review4.setRating(5);
        review4.setComment("Excellent co-traveler, polite and shared costs promptly!");

        reviewRepository.saveAll(List.of(review1, review2, review3, review4));

        System.out.println("Database seeding completed successfully!");
    }
}
