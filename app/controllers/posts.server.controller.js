'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Post = mongoose.model('Post'),
	_ = require('lodash');

	var uuid = require('node-uuid'),
    	multiparty = require('multiparty');

	var path = require('path'),
    	fs = require('fs');


exports.create = function(req, res) {

	console.log(req.body);

	var post = new Post(req.body);

	post.user = req.user;

	post.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(post);
		}
	});
};

/**
 * Show the current post
 */
exports.read = function(req, res) {
	res.jsonp(req.post);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
	var post = req.post;

	post = _.extend(post, req.body);

	post.save(function(err) {
		console.log(req.body);
		if (err) {
				console.log('somfin');
		return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(post);
			console.log('anuyfn');
		}
	});
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
	var post = req.post;

	post.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(post);
		}
	});
};

/**
 * like a post
 */
exports.likePost = function(req, res) {
    var post = req.post;
	post.likes += 1;

	post.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(post);
		}
	});
};

/******************************************
			ANOTHER KIND OF LIKE
******************************************/
/*exports.likePost2 = function(req, res) {
  var post = req.post,
        like = req.body;
        like.user = req.user;
    var Liked = false; 
    
    if (req.user.id === post.user._id.toString()) { 
        return res.send(400, {
               message: 'You cannot like your own post'
        });
    } else {
        for(var i = 0; i < post.likes.length; i++) {
           if (req.user.id === post.likes[i].user.toString()) {
               Liked = true;
               break;
            }
        }
        if (!Liked) {
            post.likes.push(like);

            post.save(function(err) {
               if (err) {
                   return res.send(400, {
                      message: ''
                   });
                } else {
                    res.jsonp(post);
                }
            });
        } 
        else {
            return res.send(400, {
               message: 'you have already liked this post before'
            });
        }
    }
};
*/

/******************************************
		END OF THE LIKE 
******************************************/

/**
 * List of Posts
 */
exports.list = function(req, res) {
	Post.find().sort('-created').populate('user', 'displayName').populate('commentSchema','commentBy').exec(function(err, posts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(posts);
		}
	});
};

/**
 * Posts middleware
 */
exports.postByID = function(req, res, next, id) {
	console.log('we are here');
	Post.findById(id).populate('user', 'displayName').exec(function(err, post) {
		if (err) return next(err);
		if (!post) return next(new Error('Failed to load Post ' + id));
		req.post = post;
		next();
	});
};

/**
 * Posts authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.post.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};