const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, sequelize, User, ReviewImage, Booking } = require('../../db/models');

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
            message: 'Forbidden',
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
            message: 'Forbidden',
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
            message: 'Forbidden',
        })
    }

    await spot.destroy();

    res.status(200).json({
  "message": "Successfully deleted",
})
})


// router.get('/:spotId/reviews', async(req, res) => {
//     const {user} = req;

//     const reviews = await Spot.findByPk(req.params.spotId, {
//         where: {
//             spotId: spot.id
//         },
//         include: [
//             {model: Review, attributes:  ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', "updatedAt"]},
//             {model: User,
//                 attributes: ['id', 'firstName', 'lastName']
//             },
//             {model: ReviewImage, attributes: ['id', 'url']},
//         ]
//     })

//     const reviewImages = await Review.findAll({
//         where: {
//             reviewId: review.id
//         },
//         include: [
//             {model: ReviewImage, attributes: ['id', 'url']}
//         ]
//     })

//     const Reviews = {
//         reviews,
//         reviewImages
//     }
//     res.json(Reviews)
// })



router.get('/:spotId/reviews', async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }

    let Reviews = await spot.getReviews({
        include: {model: ReviewImage, attributes: ['id', 'url']}
    });
    for (let i = 0; i < Reviews.length; i++) {
        let user = await Reviews[i].getUser({
            attributes: ['id', 'firstName', 'lastName']
        });
        Reviews[i].dataValues.User = user
        let Reviews2 = await spot.getReviews({
            attributes: [],
            include: {model: ReviewImage, attributes: ['id', 'url']}
        });

    }



    return res.json({Reviews})
})


// const validateCreateReviewForASpot = [
//     check('review')
//       .exists({ checkFalsy: true })
//       .withMessage('Review text is required.'),
//     check('stars')
//       .exists({ checkFalsy: true })
//       .isNumeric()
//       .withMessage('Stars must be an integer from 1 to 5.'),
//     handleValidationErrors
//   ];

router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    let currentUserId = req.user.id;
    let spot = await Spot.findByPk(req.params.spotId);

    let {review, stars} = req.body;

    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }

    if (review === ''){
        return res.status(400).json({
            "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
            "errors": {
              "review": "Review text is required"
            }
          })
    }

    if (isNaN(stars) || stars < 1 || stars > 5){
        return res.status(400).json({
            "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
            "errors": {
                "stars": "Stars must be an integer from 1 to 5"
            }
          })
    }

    let userReviews = await spot.getReviews({
        where: {
            userId: currentUserId
        }
    })


    if (userReviews.length) {
        return res.status(403).json({
            "message": "User already has a review for this spot"
          })
    }

    let newReview = await spot.createReview({
        userId: currentUserId,
        review,
        stars
    })


    res.json(newReview)
})


router.get('/:spotId/bookings', requireAuth, async (req, res) => {

    let spot = await Spot.findByPk(req.params.spotId);

    let currUser = req.user.id;

    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }

    let Bookings = await spot.getBookings({
        attributes: ['spotId', 'startDate', 'endDate']
    })

    if (currUser !== spot.ownerId) {
        return res.status(200).json({Bookings})
    }

    if (currUser === spot.ownerId) {
        let Bookings = await Booking.findAll({
            where: {
                spotId: spot.id
            },
            include: {model: User, attributes: ['id', 'firstName', 'lastName']}
        })

        return res.status(200).json({Bookings})
    }
})

router.post('/:spotId/bookings', requireAuth, async(req, res) => {
    let {startDate, endDate} = req.body;

    let currentUserId = req.user.id;

    let spot = await Spot.findByPk(req.params.spotId);

    let startDateTime = new Date(startDate).getTime();
    let endDateTime = new Date(endDate).getTime();
    let today = new Date().getTime()


    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
          })
    }



    if (endDateTime <= startDateTime) {
        return res.status(400).json({
            "message": "Bad Request",
            "errors": {
              "endDate": "endDate cannot be on or before startDate"
            }
          })
    }


    let bookingsArray = [];
    let spotsBookings = await spot.getBookings();
    for (let i = 0; i < spotsBookings.length; i++) {
        const booking = spotsBookings[i];
        bookingsArray.push(booking.toJSON())
    }





    for (let i = 0; i < bookingsArray.length; i++) {
    const booking = bookingsArray[i];

        let BookingExistsStart = new Date(booking.startDate).getTime();
        let bookingExistsEnd = new Date(booking.endDate).getTime();

        if (startDateTime >= BookingExistsStart && startDateTime <= bookingExistsEnd) {
            return res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "errors": {
                  "startDate": "Start date conflicts with an existing booking"
                }
              })
        }

        if (endDateTime <= bookingExistsEnd && endDateTime >= BookingExistsStart) {
            return res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "errors": {
                    "endDate": "End date conflicts with an existing booking"
                }
              })
        }

        if (startDateTime <= BookingExistsStart && endDateTime >= bookingExistsEnd) {
            return res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "errors": {
                  "startDate": "Start date conflicts with an existing booking",
                  "endDate": "End date conflicts with an existing booking"
                }
              })
        }
    }

    let newBooking = await spot.createBooking({
        userId: currentUserId,
        startDate,
        endDate
    })

    res.status(200).json(newBooking)
})



module.exports = router;
