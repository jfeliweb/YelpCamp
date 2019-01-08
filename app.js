var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds")
    
    
seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


// Campground.create(
//     {
//         name: "River Pines", 
//         image: "https://farm3.staticflickr.com/2238/1514148183_092606ba94.jpg",
//         description: "There's a large lazy river filled with pine needles. A bathroom every 5 miles, sand vollyball fields and great open space. No boats allowed!"
        
//     }, function(err, campground){
//         if(err){
//             console.log("SOMETHING BROKE BOSS!!");
//         } else {
//             console.log("I just created " + campground.name + " in a new DB.");
//             console.log(campground);
//         }
//     })



app.get("/", function(req, res) {
    res.render("landing");
});

//INDEX - Show of All the Campgounds 
app.get("/campgrounds", function(req, res) {
    // Get All Campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

//CREATE - Add new campground to DB
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res) {
   res.render("new"); 
});

//SHOW - show the campgrounds details
app.get("/campgrounds/:id", function(req, res) {
    // Find the campground matching id
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            // Display show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
    
});

//Tell Express to listen for requests (start server)
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has Started!!!");
});