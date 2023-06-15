const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, ReviewImage } = require('../../db/models');


const router = express.Router();





router.delete('/:imageId', requireAuth, async (req, res) => {
    let currentUser = req.user.id;

    let reviewImage = await ReviewImage.findByPk(req.params.imageId);

    if (!reviewImage) {
        return res.status(404).json({
            "message": "Review Image could not be found"
          })
    }

    let review = await reviewImage.getReview({
        where: {
            userId: currentUser
        }
    })

    if (!review || review.id !== reviewImage.reviewId) {
        return res.status(403).json({
            message: 'Forbidden'
        })
    }

    await reviewImage.destroy();

    res.status(200).json({
        "message": "Successfully deleted",
      })
})










module.exports = router;
