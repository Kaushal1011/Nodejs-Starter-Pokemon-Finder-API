
(function () {
    module.exports = AdssApi;
    const objectId = require("mongodb").ObjectID;
    function AdssApi(app, express, db) {
        let apiRouter = express.Router();

        apiRouter.post("/admin/pokemon", addPokemon);
        apiRouter.delete("/admin/pokemon", delPokemon);
        apiRouter.get("/pokemon", getPokemon);

        function addPokemon(req, res) {
            let name = req.body.name;
            let coordinates = req.body.coords;
            let address = req.body.address;
            let type = req.body.type;
            let level = req.body.level;
            console.log(req.body);
            db.collection("pokemon").insertOne(
                {
                    name: name,
                    address: address,
                    location: {
                        type: "Point",
                        coordinates: [coordinates.x, coordinates.y],
                    },
                    type: type,
                    level: level,
                },
                (err, docs) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ message: "server error" });
                        return;
                    } else {
                        res.status(200).json({ message: "accepted" });
                        return;
                    }
                }
            );
        }


        function delPokemon(req, res) {
            id = req.body.id;
            db.collection("pokemon").deleteOne(
                {
                    _id: objectId(id),
                },
                (err, docs) => {
                    // console.log(docs);
                    if (err) {
                        console.log(err);
                        res.status(500).json({ message: "server error" });
                        return;
                    } else {
                        res.status(200).json({ message: "deleted" });
                        return;
                    }
                }
            );
        }

        function getPokemon(req, res) {
            let location = {};
            location.x = parseFloat(req.query.x);
            location.y = parseFloat(req.query.y);
            db.collection("pokemon")
                .find({
                    location: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [location.x, location.y],
                            },
                        },
                    },
                })
                .toArray()
                .then((docs0) => {
                    if (docs0) {
                        res.status(200).json(docs0);
                    } else {

                        responsejson.push("none");
                        res.status(404).json({ "message": "None Found" });
                    }
                });
        }


        return apiRouter;
    }
})();
