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
            userId: req.user.id
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


router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const booking = await Booking.findOne({
        where: { id: req.params.bookingId }
    });

    if (start >= end) {
        const err = new Error();
        err.status = 400;
        err.message = "Validation Error";
        err.errors = { endDate: 'endDate cannot come before startDate' };
        next(err);
    }
    if(!booking) {
        const err = new Error();
        err.message = "Booking couldn't be found";
        err.status = 404;
        return next(err);
    };

    const bookings = await Booking.findAll({
        where: {
            spotId: booking.spotId
        }
    });

    if(new Date(booking.startDate) < new Date()){
        const err = new Error();
        err.message = "Past bookings can't be modified"
        err.status = 403;
        return next(err);
    }
    if(req.user.id !== booking.userId) {
        const err = new Error();
        err.message = "Forbidden";
        err.status = 404;
        return next(err);
    };
    if (bookings.length) {
        let dateError = false;
        const err = new Error();
        err.errors = {};
        for (let i = 0; i < bookings.length; i++) {
            const booking = bookings[i].toJSON();
            const existingStart = new Date(booking.startDate);
            const existingEnd = new Date(booking.endDate);
            if (start <= existingEnd && start >= existingStart) {
                err.errors.startDate = "Start date conflicts with an existing booking";
                dateError = true;
            };
            if (end <= existingEnd && end >= existingStart) {
                err.errors.endDate = 'End date conflicts with an existing booking'
                dateError = true;
            };
        };
        if (dateError) {
            err.status = 403;
            err.message = 'Sorry, this spot is already booked for the specified dates';
            return next(err);
        };
    };

    await booking.update({
        startDate,
        endDate
    })

    const checkBooking = await Booking.findOne({
        where: { id: req.params.bookingId }
    });
    res.json(checkBooking);
});



router.delete('/:bookingId', requireAuth, async(req, res) => {
    let currentUserId = req.user.id;

    let booking = await Booking.findByPk(req.params.bookingId);



    if (!booking) {
        return res.status(404).json({
            "message": "Booking couldn't be found",
            "statusCode": 404
          })
    }

    let user = await booking.getUser();
    if (user.id !== currentUserId) {
        return res.status(403).json({
            message: 'Forbidden',
            statusCode: 403
        })
    }

    let newStartDate = new Date(booking.startDate).getTime();
    let today = new Date().getTime();


    if (today >= newStartDate) {
        return res.status(200).json({
            "message": "Bookings that have been started can't be deleted",
            "statusCode": 403
          })
    }

    await booking.destroy();

    res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
      })

})






module.exports = router;
