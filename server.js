const jsonServer = require("json-server");
const multer = require("multer");

const server = jsonServer.create();
const router = jsonServer.router("products.json");
const middlewares = jsonServer.defaults();

//set defaul middlewears (logger, static, cors and no-cache)
server.use(middlewares);

//Add custom routes before JSON server router
// server.get("/echo", (req, res) => {
//   res.jsonp(req.query);
// });

// storage and random multiplier
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },

  //Uploads
  filename: function (req, file, cb) {
    let date = new Date();
    let imageFilename = date.getTime() + "_" + file.originalname;
    req.body.imageFilename = imageFilename;
    cb(null, imageFilename);
  },
});
const bodyParser = multer({ storage: storage }).any();

//to handle POST, PUT, and PATCH you need to use a body-parser
//You can use the one used by JSON server
server.use(bodyParser);
server.post("/products", (req, res, next) => {
  let date = new Date();
  req.body.createdAt = date.toISOString();
  if (req.body.price) {
    req.body.price = Number(req.body.price);
  }

  //Validating for errors
  let hasErrors = false;
  let errors = {};

  if (req.body.name.length < 3) {
    hasErrors = true;
    errors.name = "Name must be at least 3 characters";
  }
  if (req.body.brand.length < 2) {
    hasErrors = true;
    errors.brand = "Brand must be at least 2 characters";
  }
  if (req.body.category.length < 2) {
    hasErrors = true;
    errors.category = "Category must be at least 2 characters";
  }
  if (req.body.price < 0) {
    hasErrors = true;
    errors.price = "Price is not valid";
  }
  if (req.body.description.length < 10) {
    hasErrors = true;
    errors.description = "Description must be at least 10 characters";
  }

  if (hasErrors) {
    //return bad request (400) with validation errors
    res.status(400).jsonp(errors);
    return;
  }
  //continue to JSON server router
  next();
});

//Use default router
server.use(router);

server.listen(4000, () => {
  console.log("JSON Server is running");
});
