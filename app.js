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

const app = express();
app.use(express.static("public"));

/**
 * 
 */
app.get("/", async (req, res, next) => {
  try {
    
  } catch (err) {
    
  }
});