/**
 * @author El Hovik
 * Last updated: 06-02-2022
 * Some JS to implement a basic login functionality (unfinished) and 
 * features for users to submit a new item proposal.
 */
 (function() {
  "use strict";

  const DEBUG = true;
  // const BASE_URL = "/"; // can also use published Heroku API url
  const BASE_URL = "/";

  // admin.js request endpoints
  // POST requests
  const LOGIN_EP = BASE_URL + "login"; 
  const ADD_ITEM_EP = BASE_URL + "admin/add"; 

  // GET request
  const IMAGES_EP = BASE_URL + "images"; 

  const IMG_URL = "imgs/"; 
  const MESSAGE_DELAY = 2000;

  /**
   * Retrieves the cafe menu dynamically using AJAX! If something goes
   * wrong with the request (e.g. the data is missing or there is no network
   * connection) will display an error message on the page instead.
   */
  async function init() {
    // Login feature currently unfinished
    // id("login").addEventListener("click", adminLogin);
    // Simulated login response:
    //updateResults("We don't have a login system hooked up yet. But we'll trust you!");
    id("login").addEventListener("click", async (evt) => {
      // This evt only fires if the HTML5 validation checks have passed.
      // prevent default page-refresh behavior
      evt.preventDefault();
      await adminLogin();
    });
    // todo: add a form to add an item!
    id("item-form").addEventListener("submit", async (evt) => {
      // This evt only fires if the HTML5 validation checks have passed.
      // prevent default page-refresh behavior
      evt.preventDefault();
      await addItem();
    });
    id("item-name").addEventListener("input", function() {
      id("item-template").querySelector("h3").textContent = this.value;
    });
    //await loadImages();
  }

  /**
   * A start to an admin login (insecure and incomplete, but gets students some ideas)
   */
  async function adminLogin() {
    // Create a new "FormData" object (these aren't in an HTML5 form element)
    let params =  new FormData();
    // Add the various parameters to the FormData object
    const username = id("username").value;
    const pw = id("password").value;

    params.append("username", username);
    params.append("password", pw);

    try {
      let resp = await fetch("/admin/login", { method : "POST", body : params });
      resp = checkStatus(resp);
      // A /login endpoint often returns a simple message about the result
      // Here, the login functionality is unimplemented, but students should be able to
      // reason about next steps (consider cookies from Lecture 19 to keep track of logged-in user)
      let results = await resp.text();
      updateResults(results);
      //loadImages();
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * Displays responseText in results area on page, hiding login section and showing admin section.
   * Definitely insecure, but a start.
   * @param {String} responseText 
   */
  function updateResults(responseText) {
    id("results").textContent = responseText;
    // setTimeout(() => {
    //   id("login-section").classList.add("hidden");
    //   id("admin-section").classList.remove("hidden");
    //   id("results").textContent = "";
    // }, MESSAGE_DELAY);
  }

  /**
   * Sends a request with a proposed new item to the Cafe web service based on
   * inputs of the #item-form. If an error occurs in a request, displays
   * an error message to the user, otherwise displays a success message.
   */
  async function addItem() {
    let params = new FormData(id("item-form"));
    let uploadParams = new FormData();
    let file = params.get("image");
    uploadParams.append("image", file);
    params.delete('image');
    // try {
    //   let resp = await fetch(ADD_ITEM_EP, { method : "POST", body : params });
    //   resp = checkStatus(resp);
    //   let data = await resp.text();
    //   updateResults(data);
    // } catch (err) {
    //   handleError("An error occurred when submitting new item request. " +
    //               "Please try again or email us!");
    // }

    try {
      let resp = await fetch("/stock-img/upload" , { method : "POST", body : uploadParams });
      resp = checkStatus(resp);
      let data = await resp.text();
      updateResults(data);
    } catch (err) {
      handleError("An error occurred when submitting new item request. " +
                  "Please try again or email us!");
    }
  }

  /**
   * Fetches a list of image names from the Cafe web service to populate the dropdown
   * a user can select from when proposing a new item.
   */
  async function loadImages() {
    try {
      let resp = await fetch(IMAGES_EP);
      resp = checkStatus(resp);
      let data = await resp.text();
      populateDropdown(data);
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * Populates the dropdown of image options given a \n-separated responseText.
   * When a user later changes the selected option, changes the image displayed in the
   * new item card with that image.
   * @param {String} responseText - \n-separated list of image names 
   *     (e.g. 'apple.png\nboba-tea.png\n')
   */
  function populateDropdown(responseText) {
    const lines = responseText.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let imageName = lines[i];
      if (imageName) {
        let option = gen("option");
        option.textContent = imageName;
        option.value = imageName;
        id("images").appendChild(option);
      }
    }
    id("images").addEventListener("change", changeImage);
  }

  /**
   * Updates the image currently displayed on the new item card with the selected option.
   */
  function changeImage() {
    if (this.value) { // e.g. coffee.png
      id("item-image").src = IMG_URL + this.value;
      // remove the extension (e.g. coffee.png -> "coffee menu item")
      id("item-image").alt = this.value.split(".")[0] + " menu item";
    }
  }

  /**
   * A user-friendly error message when something goes wrong in a fetch request.
   */
  function handleError(err) {
    if (DEBUG) {
      console.error(err);
    }
    // Remember not to leak err information on the page!
    id("results").textContent = "Something's wrong in the cafe kitchen... Please try again later!";
  }

  init();

})();