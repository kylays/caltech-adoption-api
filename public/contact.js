/**
 * @author El Hovik
 * Last updated: 06-02-2021
 * JS for a contact form on the Cafe website, allowing users to send
 * messages to the web service.
 */
 (function() {
  "use strict";

  const DEBUG = true;
  const BASE_URL = "/"; // could also use published Heroku endpoint
  const CONTACT_EP = BASE_URL + "feedback";

  /**
   * Sets up the page for a submit event.
   */
  function init() {
    // Listen to the form's 'submit' event listener, which is fired
    // whenever any button in the form is clicked (not the 'click' event)
    id("contact-form").addEventListener("submit", (evt) => {
      // Prevent the default refresh behavior for forms (see Lecture 14 for more details)
      evt.preventDefault();
      postMsg();
    });
  }

  /**
   * Sends the user's inputted information to the web service.
   * Displays a success or user-friendly error message depending on the
   * service's response.
   */
  async function postMsg() {
    let data = new FormData(id("contact-form"));
    // let data = {
    //   "name": ,
    //   "email": ,
    //   "feedback":
    // };
    // data = JSON.stringify(data);

    fetch(CONTACT_EP, { method : "POST", body : data})
      .then(checkStatus)
      .then(resp => resp.text())
      .then(showSuccess)
      .catch(handleError);
  }

  /**
   * Displays the responseText on the page.
   * @param {String} responseText 
   */
  function showSuccess(responseText) {
    id("results").textContent = responseText;
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
