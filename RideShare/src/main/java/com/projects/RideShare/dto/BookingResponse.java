package com.projects.RideShare.dto;

import com.projects.RideShare.entity.BookingStatus;

public class BookingResponse {

    private Long id;
    private String passengerName;
    private String source;
    private String destination;
    private String driverName;
    private String vehicleName;
    private double pricePerSeat;
    private int seatsBooked;
    private BookingStatus bookingStatus;

    public BookingResponse(
            Long id,
            String passengerName,
            String source,
            String destination,
            String driverName,
            String vehicleName,
            double pricePerSeat,
            int seatsBooked,
            BookingStatus bookingStatus) {

        this.id = id;
        this.passengerName = passengerName;
        this.source = source;
        this.destination = destination;
        this.driverName = driverName;
        this.vehicleName = vehicleName;
        this.pricePerSeat = pricePerSeat;
        this.seatsBooked = seatsBooked;
        this.bookingStatus = bookingStatus;
    }

    public Long getId() {
        return id;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    public String getDriverName() {
        return driverName;
    }

    public String getVehicleName() {
        return vehicleName;
    }

    public double getPricePerSeat() {
        return pricePerSeat;
    }

    public int getSeatsBooked() {
        return seatsBooked;
    }

    public BookingStatus getBookingStatus() {
        return bookingStatus;
    }
}