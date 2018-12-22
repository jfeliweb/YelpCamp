var express = require("express");
var app = express();

app.set("view engine", "ejs");


app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    var campgrounds = [
    {name: "Pembroke", image: "https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104491f5c578a4e8b7ba_340.jpg"},
    {name: "River Pines", image: "https://pixabay.com/get/e136b80728f31c22d2524518b7444795ea76e5d004b0144590f4c07aa2efb7_340.jpg"},
    {name: "Rainberry Bay", image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104491f5c578a4e8b7ba_340.jpg"}
    ]

    res.render("campgrounds", {campgrounds: campgrounds});

});



//Tell Express to listen for requests (start server)
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has Started!!!");
});