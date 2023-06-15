const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage } = require('../../db/models');


const router = express.Router();





router.delete('/:imageId', requireAuth, async (req, res) => {
    let currentUser = req.user.id;

    let spotImage = await SpotImage.findByPk(req.params.imageId);

    if (!spotImage) {
        return res.status(404).json({
            "message": "Spot Image could not be found"
          })
    }

    let spot = await spotImage.getSpot({
        where: {
            ownerId: currentUser
        }
    })

    if (!spot || spot.id !== spotImage.spotId) {
        return res.status(403).json({
            message: 'Forbidden'
        })
    }

    await spotImage.destroy();

    res.status(200).json({
        "message": "Successfully deleted"
      })
})










module.exports = router;
