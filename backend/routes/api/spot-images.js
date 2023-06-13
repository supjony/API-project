const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage } = require('../../db/models');


const router = express.Router();


router.get('/imageId', async (req, res, next)=> {
    const spotimages = SpotImage.findByPk(req.params.imageId)
    res.json(spotimages)
})


router.delete('/imageId', requireAuth, async (req, res, next) => {
    const spotImage = await SpotImage.findByPk(req.params.imageId)

    if(!spotImage) {
        const error = new Error()
        error.message = "Spot Image couldn't be found"
        error.status = 404
        next(error)
    }

    const spot = await Spot.findByPk(spotImage.spotId)

    if(req.user.id !== spot.ownerId) {
        const error = new Error()
        error.message = 'Forbidden'
        error.status = 403
        next(error)
    }

    await spotImage.destory()

    res.json({
        message: "Successfully deleted"
    })
})















module.exports = router;
