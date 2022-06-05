"use strict";
/**
 * Name: Clara Wang, Kyla Yu-Swanson
 * CS 132 Spring 2022
 * Date: June 2022
 * This program defines a web service for file fetches for Caltech Wildlife Adoption.
 */

const express = require("express");
const fs = require("fs/promises");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/stock-img')
  },
  filename: function (req, file, cb) {
    cb(null, req.image.name)
  }
})
const upload = multer({ storage : storage })

const SERVER_ERROR = "Something went wrong on the server, please try again later.";
const SERVER_ERR_CODE = 500;
const CLIENT_ERR_CODE = 400;
const DEBUG = true;

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(multer().none()); 

/***************************** Endpoints *********************************/

/**
 * Returns a JSON array of available categories of animals.
 */
app.get("/categories", async (req, res, next) => {
  try {
    let categories = await fs.readdir("animals");
    res.json(categories);
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});

/**
 * Returns a JSON collection of all animal information
 */
app.get("/all-animals", async (req, res, next) => {
  try {
    let categories = await fs.readdir("animals/");
    let animalInfos = [];
    for (let i = 0; i < categories.length; i++) {
      let info = await getAnimalsOfCategory(categories[i]);
      animalInfos = animalInfos.concat(info);
    }
    res.json(animalInfos);
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});

/**
 * Returns a JSON collection of the animal information for animals of the 
 * specified type
 */
app.get("/animals/:type", async (req, res, next) => {
  try {
    let type = req.params["type"];
    let info = await getAnimalsOfCategory(type);
    res.json(info);
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});

/**
 * Returns a JSON collection of information for a specific, single animal
 */
app.get("/one-animal/:type/:name", async (req, res, next) => {
  try {
    let type = req.params["type"];
    let name = req.params["name"];
    let info = await getAnimal(type, name);
    res.json(info);
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});

app.post("/feedback", async (req, res, next) => {
  try {
    let name = req.body.name;
    let email = req.body.email;
    let feedback = req.body.feedback;

    if (!name || !email || !feedback) {
      res.status(CLIENT_ERR_CODE);
      next(Error("One or more required POST parameters for /feedback are missing: name, email, feedback."));
    }

    let content = name + "\n" + email + "\n" + feedback;
    let currentFeedback = await fs.readdir("feedback");
    let feedbackIndex = currentFeedback.length + 1;
    await fs.writeFile("feedback/feedback-" + feedbackIndex.toString() + ".txt", content);
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});

app.post("/buy", async (req, res, next) => {
  try {
    let name = req.body.name.toLowerCase(); 
    let type = req.body.type.toLowerCase();

    if (!name || !type) {
      res.status(CLIENT_ERR_CODE);
      next(Error("One or more required POST parameters for /buy are missing: name, type."));
    }
    
    let animalInfo = await fs.readFile("animals/" + type + "/" + name + "/info.txt", "utf8");
    let lines = animalInfo.split("\n");
    lines[7] = "no";
    let content = "";
    for (let i = 0; i < lines.length; i++) {
      content = content + lines[i];
    }
    await fs.writeFile("animals/" + type + "/" + name + "/info.txt", content);
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});

app.post("/admin/add", async (req, res, next) => {
  try {
    let type = (req.body.type).toLowerCase();
    let name = (req.body.name).toLowerCase();
    let age = req.body.age;
    let gender = req.body.gender;
    let cost = req.body.cost;
    let description = req.body.description;
    let image = name + ".jpg"; 
    let available = "yes";

    if (!type || !name || !age || !gender || !cost || !description) {
      res.status(CLIENT_ERR_CODE);
      next(Error("One or more required parameters for /admin/add endpoint are missing:" 
                  + " type, name, age, gender, cost, description, image, available"));
    }

    let types = await fs.readdir("animals/");          
    if (!types.includes(type)) {
      await fs.mkdir("animals/" + type);
    }
    
    let names = await fs.readdir("animals/" + type + "/");
    if (names.includes(name)) {
      res.status(CLIENT_ERR_CODE);
      next(Error(capitalize(type) + " with name " + capitalize(name) + 
                 " already exists. Please choose another name."));
    }
    
    let content = capitalize(name) + "\n" + type + "\n" + age + "\n" + gender + 
                  "\n" + cost + "\n" + description + "\n" + image + "\n" + available;
    await fs.mkdir("animals/" + type + "/" + name);
    await fs.writeFile("animals/" + type + "/" + name + "/info.txt", content); 
  
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});

app.post("/stock-img/upload/:name", upload.single("image"), async (req, res, next) => { // TODO this is super broken
  console.log("here???");
  console.log(req);
  // let name = req.params["name"].toLowerCase();
  // req.image.name = name;
  if (!req.image) {
    res.status(CLIENT_ERR_CODE);
    next(Error("No photo file received."));
  }
});

/****************************** Helper Functions ******************************/
/**
 * Returns the collection of information given the specific animal type and name
 * @param {string} type - type of animal 
 * @param {string} name - name of the animal
 * @returns the JSON formatted collection of information for the specified animal
 */
async function getAnimal(type, name) {
  let animalInfo = await fs.readFile("animals/" + type + "/" + name + "/info.txt", "utf8");
  let lines = animalInfo.split("\n");
  let result = 
    {
      "name" : lines[0],
      "type" : lines[1],
      "age" : lines[2],
      "gender" : lines[3],
      "cost" : lines[4],
      "description" : lines[5],
      "image" : lines[6],
      "available": lines[7]
    };
  return result;
}

/**
 * Returns the collection of information for all animals in the given category
 * @param {string} type - the type or category of animal
 * @returns the JSON formatted collection of information for all animals of the type
 */
async function getAnimalsOfCategory(type) {
  let names = await fs.readdir("animals/" + type + "/");
  let animalInfos = [];
  for (let i = 0; i < names.length; i++) {
    let info = await getAnimal(type, names[i]);
    animalInfos.push(info);
  }
  return animalInfos;
}

/**
 * Error-handling middleware to cleanly handle different types of errors.
 * Any function that calls next with an Error object will hit this error-handling
 * middleware since it's defined with app.use at the end of the middleware stack.
 * @param {Error} err - The error details of the request
 * @param {Object} req - The request that had an error
 * @param {Object} res - The response for the request that had an error
 * @param {function} next - middleware callback function
 */
function errorHandler(err, req, res, next) {
  if (DEBUG) {
    console.error(err);
  }
  res.type("text");
  res.send(err.message);
}

/**
 * Capitalizes first letter of the given string
 * @param {string} s - string to capitalize
 * @returns the string with its first letter capitalized
 */
function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
