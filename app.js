var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds")
    
    

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// Passport Config
app.use(require("express-session")({
    secret: "Bob Hope is the greatest game host in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================================================
// Routes
// ================================================

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
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
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
   res.render("campgrounds/new"); 
});

//SHOW - show the campgrounds details
app.get("/campgrounds/:id", function(req, res) {
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

// ===============================
// COMMENTS ROUTES
// ===============================

// New Route
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       } else {
           res.render("comments/new", {campground: campground});
       }
   });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
   // lookup campground usinf id
   Campground.findById(req.params.id, function(err, campground) {
       if(err){
           console.log(err);
       } else {
           // create new comment
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   // connect new comment to campground
                   // redirect campground show page
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
   });
});

// ================================================
// Auth Routes
// ================================================

// show register form
app.get("/register", function(req, res) {
    res.render("register");
});
// sign up logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});
// show login form
app.get("/login", function(req, res) {
    res.render("login");
});
// login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
});
// logout Route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

// MIDDLEWARE - check if user is login
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



//Tell Express to listen for requests (start server)
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has Started!!!");
});