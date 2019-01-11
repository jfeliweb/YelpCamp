var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

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
router.post("/", function(req, res){
    // get data from form and add data to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
        //   redirect to campgrounds list
           res.redirect("/campgrounds");
       }
    });
    
});

//NEW - show form to create new campground 
router.get("/new", function(req, res) {
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



module.exports = router;