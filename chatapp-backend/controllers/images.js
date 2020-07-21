const { User } = require("../Helpers/userClass");
const HttpStatus = require('http-status-codes');
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dea6cvtau',
    api_key: '334624569939463',
    api_secret: '6ac8RSN59PsSWYywm4ld4MRmv5Q'
});

module.exports = {
    uploadImage(req, res) {
        cloudinary.uploder.upload(req.body.image, async result => {
            console.log(result);

            await User.update(
                {
                    _id: req.user._id
                },
                {
                    $push: {
                        images: {
                            imgId: result.public_id,
                            imgVersion: result.version
                        }
                    }
                }
            )
            .then(() => res.status(HttpStatus.OK).json({message: 'Image upload succefully!'}))
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR)).json({message: 'Error occured!'})

        });
    },

    async setDefaultImage(req, res) {
        const { imgId, imgVersion } = req.params;

        await User.update(
            {
                _id: req.user._id
            },
            {
                picId: imgId,
                picVersion: imgVersion
            }
        )
        .then(() => res.status(HttpStatus.OK).json({message: 'default image set!'}))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured!'}));
    }
};