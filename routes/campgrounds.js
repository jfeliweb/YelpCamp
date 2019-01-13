var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX - Show of All the Campgounds 
router.get("/", function(req, res) {
    // Get All Campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//CREATE - Add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add data to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: description, author: author};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
        //   redirect to campgrounds list
           console.log(newlyCreated);
           res.redirect("/campgrounds");
       }
    });
    
});

//NEW - show form to create new campground 
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

//SHOW - show the campgrounds details
router.get("/:id", function(req, res) {
    // Find the campground matching id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            // Display show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    
});

//EDIT - edit the campgrounds details in form
router.get("/:id/edit", middleware.checkCampgroundOnwership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE - update the form post
router.put("/:id", middleware.checkCampgroundOnwership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//DELETE - Remove campground from app
router.delete("/:id", middleware.checkCampgroundOnwership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;