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













module.exports = router;
