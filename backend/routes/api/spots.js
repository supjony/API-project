const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const review = require('../../db/models/review');

const router = express.Router();







// router.get("/", async (req, res, next) => {
//     const spots = await Spot.findAll()
//     res.json(spots)
// })


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



// const toySummary = await Toy.findAll({
//     attributes: [
//         [
//             sequelize.fn('AVG', sequelize.col('price')),
//             'averagePriceOfAToy'
//         ]
//     ]
// });


// app.get('/bands-lazy', async (req, res, next) => {
//     const allBands = await Band.findAll({ order: [ ['name'] ] })
//     const payload = [];
//     for(let i = 0; i < allBands.length; i++){
//         const band = allBands[i];
//         //!!START
//         const bandMembers = await band.getMusicians({ order: [ ['firstName'] ] });
//         //!!END
//         const bandData = {
//             id: band.id,
//             name: band.name,
//             createdAt: band.createdAt,
//             updatedAt: band.updatedAt,
//             //!!START
//             Musicians: bandMembers
//             //!!END
//         };
//         payload.push(bandData);
//     }
//     res.json(payload)
// });














module.exports = router;
