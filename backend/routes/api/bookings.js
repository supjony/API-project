const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, sequelize, User, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// const review = require('../../db/models/review');
// const user = require('../../db/models/user');

const router = express.Router();








router.get('/current', requireAuth, async(req, res, next) => {
    let allBookings = await Booking.findAll({
        where:{
            userId: req.user.id,
        },
        include:{
            model:Spot,
            attributes: {exclude : ['createdAt', 'updatedAt', 'description']},
            include: {
                model:SpotImage
            }
        }

    })
    if (allBookings) {}
    let Bookings = [];

    for (let i = 0; i < allBookings.length; i++) {
        const book = allBookings[i];
        Bookings.push(book.toJSON())
    }


    for (let i = 0; i < Bookings.length; i++) {
        const book = Bookings[i];
        book.Spot.SpotImages.forEach(image => {
            if (image.preview === true) {
        book.Spot.previewImage = image.url
            }
        })
        delete book.Spot.SpotImages

    }



 res.json({Bookings})
});






// router.get('/all', async(req, res, next) => {
//     let hi = await Booking.findAll()
//     res.json(hi)
// })


router.put('/:bookingId', requireAuth, async(req, res) => {

    let {startDate, endDate} = req.body;
    let currUserId = req.user.id;

    let newBooking = await Booking.findByPk(req.params.bookingId);

    if (!newBooking) {
        return res.status(404).json({
            "message": "Booking couldn't be found"
          })
    }

    let newBookingsToJSON = newBooking.toJSON();

    if (newBooking.userId !== currUserId) {
        return res.status(403).json({
            message: 'Forbidden'
        })
    }


let startDateTime = new Date(startDate).getTime();
let endDateTime = new Date(endDate).getTime();
let today = new Date().getTime();



    if (today > new Date(newBookingsToJSON.endDate).getTime()) {
        return res.status(403).json({
            message: "Past bookings cannot be edited"
        })
    }

    if (startDateTime > endDateTime) {
        return res.status(400).json({
            "message": "Validation error",
            "errors": {
              "endDate": "endDate cannot come before startDate"
            }
          })
    }

    let allSpotBookings = await Booking.findAll({
        where: {
            spotId: newBooking.spotId
        }
    })



    let bookings = [];
    for (let booking of allSpotBookings) {
        bookings.push(booking.toJSON());
    }



    for (let booking of bookings) {

        let existingBookingStart = new Date(booking.startDate).getTime();
        let existingBookingEnd = new Date(booking.endDate).getTime();

        if (booking.id === newBooking.id) {
            continue;
        }

        if (startDateTime >= existingBookingStart && startDateTime <= existingBookingEnd) {
            return res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "errors": {
                  "startDate": "Start date conflicts with an existing booking"
                }
              })
        }

        if (endDateTime <= existingBookingEnd && endDateTime >= existingBookingStart) {
            return res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "errors": {
                    "endDate": "End date conflicts with an existing booking"
                }
              })
        }

        if (startDateTime <= existingBookingStart && endDateTime >= existingBookingEnd) {
            return res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "errors": {
                  "startDate": "Start date conflicts with an existing booking",
                  "endDate": "End date conflicts with an existing booking"
                }
              })
        }
    }

    let updateBooking = await newBooking.update({
        startDate,
        endDate
    })

res.json(updateBooking)
})


router.delete('/:bookingId', requireAuth, async(req, res) => {
    let currUserId = req.user.id;

    let booking = await Booking.findByPk(req.params.bookingId);



    if (!booking) {
        return res.status(404).json({
            "message": "Booking couldn't be found"
          })
    }

    let user = await booking.getUser();
    if (user.id !== currUserId) {
        return res.status(403).json({
            message: 'Forbidden'
        })
    }

    let startDateTime = new Date(booking.startDate).getTime();
    let today = new Date().getTime();


    if (today >= startDateTime) {
        return res.status(200).json({
            "message": "Bookings that have been started can't be deleted"
          })
    }

    await booking.destroy();

    res.status(200).json({
        "message": "Successfully deleted"
      })

})






module.exports = router;
