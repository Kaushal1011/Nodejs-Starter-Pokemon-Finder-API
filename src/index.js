(function () {
    let express = require("express");
    let cors = require("cors");
    let bodyParser = require("body-parser");
    let mongoClient = require("mongodb").MongoClient;
    let morgan = require("morgan");
    let config = require("./config.js");
    let app = express();
    let dbHostUrl = "mongodb://" + config.server + ":" + config.db_port + "/";

    // initialise middleware

    app.use(cors());
    app.use(morgan("common"));
    app.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );
    app.use(bodyParser.json());

    mongoClient.connect(
        dbHostUrl + config.db_name,
        { useUnifiedTopology: true },
        runApp
    );

    server = app.listen(config.port);
    console.log("Server starting at http://localhost:" + config.port);

    function runApp(err, client) {
        console.log("MongoDB Connected");
        db = client.db(config.db_name);
        db.collection("pokemon").createIndex({ location: "2dsphere" });
        let PokemonApi = require("./routes/PokemonApi.js")(app, express, db);
        app.use("/", PokemonApi);

    }
})();
