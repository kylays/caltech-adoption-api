"use strict";
/**
 * Name: Clara Wang, Kyla Yu-Swanson
 * CS 132 Spring 2022
 * Date: June 2022
 * This program defines a web service for file fetches for Caltech Wildlife Adoption.
 */

const express = require("express");
const fs = require("fs/promises");

const SERVER_ERROR = "Something went wrong on the server, please try again later.";
const SERVER_ERR_CODE = 500;
const CLIENT_ERR_CODE = 400;
const DEBUG = true;

const app = express();
app.use(express.static("public"));

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

/****************************** Helper Functions ******************************/
async function getAnimal(type, name) {
  let animalInfo = await fs.readFile("animals/" + type + "/" + name + "/info.txt", "utf8");
  let lines = animalInfo.split("\n");
  let result = 
    {
      "name" : lines[0],
      "age" : lines[1],
      "gender" : lines[2],
      "cost" : lines[3],
      "description" : lines[4],
      "image" : lines[5]
    };
  return result;
}

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
