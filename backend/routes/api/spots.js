const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, sequelize, User, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const review = require('../../db/models/review');
const user = require('../../db/models/user');

const router = express.Router();


router.get('/current', requireAuth, async (req, res, next) => {

    let currentUserLoggedIn = req.user.id

    const spots = await Spot.findAll({
        where: {
            ownerId: currentUserLoggedIn
        }
    })
    const payload = []
    spotsObj = {}
    for (let i = 0; i < spots.length; i++) {
        const spot = spots[i];
        // const reviews = await spot.getReviews()
        // for (let i = 0; i < reviews.length; i++) {
        //     const review = reviews[i];
        const aggregates = {};
        const reviews = await Review.findOne({
            attributes: [
                [
                    sequelize.fn('AVG', sequelize.col('stars')),
                    'avgRating'
                ]
            ],
            where: { spotId: spot.id }
        });


aggregates.reviews = reviews.toJSON().avgRating;

        const previewImage = await SpotImage.findOne({
            attributes: ['url'],
            where: { spotId: spot.id }
        })



        const spotData = {

            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: aggregates.reviews,
            previewImage: previewImage.url

        }
        payload.push(spotData)
        spotsObj['Spots'] = payload
    // }
    }
    res.json(spotsObj)


})




router.get("/", async (req, res, next) => {
    const spots = await Spot.findAll()
    const payload = []
    spotsObj = {}
    for (let i = 0; i < spots.length; i++) {
        const spot = spots[i];
        // const reviews = await spot.getReviews()
        // for (let i = 0; i < reviews.length; i++) {
        //     const review = reviews[i];
        const aggregates = {};
        const reviews = await Review.findOne({
            attributes: [
                [
                    sequelize.fn('AVG', sequelize.col('stars')),
                    'avgRating'
                ]
            ],
            where: { spotId: spot.id }
        });


aggregates.reviews = reviews.toJSON().avgRating;

        const previewImage = await SpotImage.findOne({
            attributes: ['url'],
            where: { spotId: spot.id }
        })



        const spotData = {

            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: aggregates.reviews,
            previewImage: previewImage.url

        }
        payload.push(spotData)
        spotsObj['Spots'] = payload
    // }
    }
    res.json(spotsObj)
})


router.get('/:spotId', async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId);
    const payload = []
    spotsObj = {}
        if (!spot) {
            res.status(404);
            res.json({

                message: "Spot couldn't be found"


           });
        }

        const aggregates = {};
        const reviews = await Review.findOne({
            attributes: [
                [
                    sequelize.fn('AVG', sequelize.col('stars')),
                    'avgRating'
                ],
                [
                    sequelize.fn('COUNT', sequelize.col('stars')),
                    'numReviews'
                ]
            ],
            where: { spotId: spot.id }
        });

        const reviewsCount = await Review.findOne({
            attributes: [

                [
                    sequelize.fn('COUNT', sequelize.col('stars')),
                    'numReviews'
                ]
            ],
            where: { spotId: spot.id }
        });

        const spotimages = await SpotImage.findAll({
            attributes: ['id', 'url', 'preview'],
            where: { spotId: spot.id }
        })

        // const owner = await User.findOne({
        //     attributes: ['id', 'firstName', 'lastName'],
        //     where: { ownerId: user.id }
        // })
        let owner = await spot.getUser({
            attributes: ['id', 'firstName', 'lastName']
        })


aggregates.reviews = reviews.toJSON().avgRating;
aggregates.reviewsCount = reviews.toJSON().avgRating;




        const spotData = {

            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: aggregates.reviews,
            numReviews: aggregates.reviewsCount,
            SpotImages: spotimages,
            Owner: owner


        // payload.push(spotData)
        // spotsObj['Spots'] = payload

    }
    res.json(spotData)
});



module.exports = router;
