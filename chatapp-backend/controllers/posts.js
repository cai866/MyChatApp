const Joi = require('@hapi/joi');
const { post } = require('../routes/authRoutes');
const HttpStatus = require('http-status-codes');
const Post = require('../models/postModels');
const User =require('../models/userModels');
const cloudinary = require('cloudinary');
const { request } = require('express');
const request = require('request');

cloudinary.config({
    cloud_name: '',
    api_key: '',
    api_secret: ''
});

module.exports = {
    addPost(req, res) {
            //valid user input data by Joi API
            const schema = Joi.object().keys({
                post: Joi.string().required()
            });
            const body = {
                post: req.body.post
            }
            const { error, value } = schema.validate(req.body);
            if(error && error.details){
                return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
            }

            //creat and store post into database, than respond message to client
            const body = {
                user: req.user._id,
                username: Helpers.firstUpper(req.user.username),
                post: req.body.post,
                created: new Date()
            };

            if(req.body.post && !req.body.image) {
                Post.create(body)
                 .then(async post => {
                //create json web token for authrizted user
                    await User.update({
                        _id: req.user._id
                    },
                    {
                     $push:{
                            posts: {
                                postId: post._id,
                                post: req.body.post,
                                created: new Date()
                            }
                        }
                    }
                    );
                    res.status(HttpStatus.Ok).json({message: 'User has been created successfully', post});
                })
                .catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'server error!'});
                });
            }


            
            if(req.body.post && req.body.image) {
               cloudinary.Uploader.upload(req.body.image, async (result) => {
                const reqBody = {
                    user: req.user._id,
                    username: Helpers.firstUpper(req.user.username),
                    post: req.body.post,
                    imgId: result.public_id,
                    imgVersion: result.version,
                    created: new Date()
                };
                Post.create(reqBody)
                .then(async post => {
               //create json web token for authrizted user
                   await User.update({
                       _id: req.user._id
                   },
                   {
                    $push:{
                           posts: {
                               postId: post._id,
                               post: req.body.post,
                               created: new Date()
                           }
                       }
                   }
                   );
                   res.status(HttpStatus.Ok).json({message: 'User has been created successfully', post});
               })
               .catch(err => {
               res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'server error!'});
               });

               })
            }
            
    
    },

    

    async getAllPosts(req, res){
        try {
            const today = moment().startOf('day');
            const tomorrow = moment(today).add(1, 'days');

            const posts = await Post.find({
                created: { $gte:today.toDate(), $lt: tomorrow.toDate() }
            })
            .populate('user')
            .sort({created:-1});//descend sort

            const topPosts = await Post.find({
                totalLikes: { $gte: 2 },
                created: { $gte:today.toDate(), $lt: tomorrow.toDate() }
            })
            .populate('user')
            .sort({created:-1});//descend sort

            const user = await User.findOne({ _id: req.user._id });
            if(user.city==='' && user.country === '') {
                request(
                    'https://geolocation-db.com/json/0f761a30-fe14-11e9-b59f-e53803842572',
                    {json: true},
                    async (err, res, body) => {
                        await User.update(
                            {
                                _id: req.user._id
                            },
                            {
                                city: body.city,
                                country: body.country_name
                            }
                        );
                    }
                );
            }

            return res.status(HttpStatus.OK).json({message:'these are all posts!', posts, topPosts});

        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'error occured!'});
        }
    },
    // add like for a post
    async addLike(req, res){
        const post_Id = req.body._id;
        await Post.update(
            {
                _id: post_Id,
                'likes.username': { $ne: req.user.username } //if the user already like the post before, update will not carry out
            },
            {
                $push: {
                    likes: {
                        username: req.user.username
                    }
                },
                $inc: {
                    totalLikes: 1
                }
            }
        ).then(() => {
            res.status(HttpStatus.OK).json({message:'You like this post!'});
        })
        .catch(err =>
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured!'})
        );
    },

    async addComment(req, res){
        const post_Id = req.body.postId;
        await Post.update(
            {
                _id: post_Id,
            },
            {
                $push: {
                    comments: {
                        userId: req.user._id,
                        username: req.user.username,
                        comment: req.body.comment,
                        createdAt: new Date()
                    }
                }  
            }
        ).then(() => {
            res.status(HttpStatus.OK).json({message:'You add a comment!'});
        })
        .catch(err =>
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured!'})
        );
    },

    async getPost(req, res){
        await Post.findOne({_id: req.params.id})
        .populate('user')
        .populate('comments.userId')
        .then((post) => {
            res.status(HttpStatus.OK).json({message:'this is the post!', post});
        })
        .catch(err =>
            res.status(HttpStatus.NOT_FOUND).json({message: 'post not found!', post})
        );
    },

    editPost(req, res) {
         //valid user input data by Joi API
         const schema = Joi.object().keys({
            post: Joi.string().required(),
            id: Joi.string().optional()
        });
    
        const { error } = schema.validate(req.body);
        if(error && error.details){
            return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
        }

        //creat and store post into database, than respond message to client
        const body = {
            post: req.body.post,
            created: new Date()
        };

        await Post.findOneAndUpdate(
            {
                _id: req.body._id
            },
            body,
            { new: true}
        ).then(post => {
            res.status(HttpStatus.OK).json({message:'You like this post!', post });
        })
        .catch(err => {
            return  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: err})
        }    
        );
    },

    async deletePost(req, res) {
        try {
          const { id } = req.params;
          const result = await Post.findByIdAndRemove(id);
          console.log(result);
          if (!result) {
            return res
              .status(HttpStatus.NOT_FOUND)
              .json({ message: 'Could not delete post' });
          } else {
            await User.update(
              {
                _id: req.user._id
              },
              {
                $pull: {
                  posts: {
                    postId: result._id
                  }
                }
              }
            );
            return res
              .status(HttpStatus.OK)
              .json({ message: 'Post deleted successfully' });
          }
        } catch (err) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: err });
        }
      }

}