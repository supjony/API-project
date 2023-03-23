const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, sequelize, User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const review = require('../../db/models/review');
const user = require('../../db/models/user');

const router = express.Router();


const validateCreateASpot = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required.'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
       .exists({ checkFalsy: true })
      .withMessage('State is required.'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required.'),
      check('lat')
      .exists({checkFalsy: true})
      .isNumeric()
      .withMessage('Latitude is not valid'),
      check('lng')
      .exists({checkFalsy: true})
      .isNumeric()
      .withMessage('Longitude is not valid'),
      check('name')
      .exists({checkFalsy: true})
      .isLength({max: 50})
      .withMessage("Name must be less than 50 characters"),
      check('description')
      .exists({checkFalsy: true})
      .withMessage("Description is required"),
      check('price')
      .exists({checkFalsy: true})
      .isNumeric()
      .withMessage("Price per day is required"),
    handleValidationErrors
  ];






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




router.post('/', requireAuth, validateCreateASpot, async (req, res) => {
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    const { user } = req;

    let creatSpot = await user.createSpot({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    res.status(201).json(creatSpot);
})






router.post('/:spotId/images', requireAuth, async (req, res) => {

    const {url, preview} = req.body;

    let user = req.user.id;


    let spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
          })
    }


    if (user !== spot.ownerId) {
        return res.status(403).json({
            message: 'this is not your account to post!',
        })
    }


    let image = await spot.createSpotImage({
        url,
        preview
    })



    res.status(200).json({
        id: image.id,
        url: image.url,
        preview: image.preview
    })
})





router.put('/:spotId', requireAuth, validateCreateASpot, async(req, res) => {
    let user = req.user.id;

    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    let spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
          })
    }


    if (user !== spot.ownerId) {
        return res.status(403).json({
            message: 'this is not your account to edit!',
        })
    }


    let newSpot = await spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    res.status(200).json(newSpot)
})



router.delete('/:spotId', requireAuth, async (req, res) => {
    let user = req.user.id;

    let spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }

    if (user !== spot.ownerId) {
        return res.status(403).json({
            message: 'cannot delete posts that are not yours!',
        })
    }

    await spot.destroy();

    res.status(200).json({
  "message": "Successfully deleted",
})
})



module.exports = router;
