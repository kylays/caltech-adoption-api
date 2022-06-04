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

const SERVER_ERROR = "Something went wrong on the server, please try again later.";
const SERVER_ERR_CODE = 500;
const CLIENT_ERR_CODE = 400;
const DEBUG = true;

const app = express();
app.use(express.static("public"));
// app.use(express.urlencoded({ extended: true })); 
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
    console.log(req.body);
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

app.post("/test", (req, res, next) => { // TODO delete this later
  console.log(req.body);
});

app.post("/buy", async (req, res, next) => {
  try {
    let name = req.body.name; 
    let type = req.body.type;

    if (!name || !type) { // TODO do we need to add type to the animal info.txt? otherwise how will we get this info on client side
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
    let type = req.body.type;
    let name = req.body.name;
    let age = req.body.age;
    let gender = req.body.gender;
    let cost = req.body.cost;
    let description = req.body.description;
    let image = req.body.image;
    let available = req.body.available;

    if (!type || !name || !age || !gender || !cost || !description || !image || !available) {
      res.status(CLIENT_ERR_CODE);
      next(Error("One or more required parameters for /admin/add endpoint are missing"));
    }

    let content = name + "\n" + type + "\n" + age + "\n" + gender + "\n" + cost 
                    + "\n" + description + "\n" + image + "\n" + available;
    await fs.writeFile("animals/" + type + "/" + name + "/info.txt", content);
    // TODO is there a way to upload an image to stock-imgs?
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
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
 */
 function errorHandler(err, req, res, next) {
  if (DEBUG) {
    console.error(err);
  }
  res.type("text");
  res.send(err.message);
}

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
