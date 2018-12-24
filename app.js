var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
    {name: "Pembroke", image: "https://pixabay.com/get/e03db50f2af41c22d2524518b7444795ea76e5d004b0144590f5c97ea5edb0_340.jpg"},
    {name: "River Pines", image: "https://pixabay.com/get/ef3cb00b2af01c22d2524518b7444795ea76e5d004b0144590f5c97ea5edb0_340.jpg"},
    {name: "Rainberry Bay", image: "https://farm8.staticflickr.com/7338/9627572189_12dbd88ebe.jpg"}
    ]

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});

});


app.get("/campgrounds/new", function(req, res) {
   res.render("new"); 
});


app.post("/campgrounds", function(req, res){
    // get data from form and add data to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    // redirect to yelp list
    res.redirect("/campgrounds");
});

//Tell Express to listen for requests (start server)
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has Started!!!");
});