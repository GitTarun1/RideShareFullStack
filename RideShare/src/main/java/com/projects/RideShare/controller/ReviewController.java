package com.projects.RideShare.controller;

import com.projects.RideShare.entity.Review;
import com.projects.RideShare.service.ReviewService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(
            ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public Review createReview(
            @RequestBody Review review,
            Authentication authentication) {

        return reviewService.createReview(review, authentication.getName());
    }

    @GetMapping
    public List<Review> getAllReviews() {

        return reviewService.getAllReviews();
    }
}