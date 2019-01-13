var Campground = require("../models/campground");
var Comment = require("../models/comment");
// All middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOnwership = function(req, res, next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err || !foundCampground){
                    req.flash("error", "Campground not found!");
                    res.redirect("back");
                } else {
                    // does user own the campground?
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    } else {
                        // otherwise, redirect
                        req.flash("error", "You do not have permission to do that!");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You must be logged in to do this.");
            res.redirect("back");
        }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err || !foundComment){
                    req.flash("error", "Comment not found!");
                    res.redirect("back");
                } else {
                    // does user own the comment?
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    } else {
                        // otherwise, redirect
                        req.flash("error", "You do not have permission to do that!");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to logged in first!");
            res.redirect("back");
        }
}

middlewareObj.isLoggedIn = function(req, res, next){
    // check if user is login
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in to do that.");
    res.redirect("/login");
}

module.exports = middlewareObj;