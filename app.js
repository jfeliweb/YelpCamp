var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schema SETUP
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "River Pines", 
//         image: "https://farm3.staticflickr.com/2238/1514148183_092606ba94.jpg"
        
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

app.get("/campgrounds", function(req, res) {
    // Get All Campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
});


app.get("/campgrounds/new", function(req, res) {
   res.render("new"); 
});


app.post("/campgrounds", function(req, res){
    // get data from form and add data to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
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

//Tell Express to listen for requests (start server)
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has Started!!!");
});