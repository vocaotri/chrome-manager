const { urlencoded } = require("express");
let express = require("express");
let mongoose = require("mongoose");
let app = express();
require("dotenv").config();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(urlencoded({ extended: false }));
let server = require("http").Server(app);
let io = require("socket.io")(server);
let config = {
    app: app,
    io: io
};

server.listen(3000, () => {
    console.log("Server started on port 3000");
});
mongoose.connect(
    process.env.URL_DB,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err) {
        if (err) throw "Connect fail" + err;
        console.log("connect success");
    }
);
require("./routes/web")(config);