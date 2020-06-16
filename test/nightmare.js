/* global describe it */

const Nightmare = require("nightmare");
const expect = require("chai").expect;

describe("A Better You", function() {
  // The default timeout for tests in mocha is 2 seconds.
  // Extending it to 20 seconds to have time to load the pages

  this.timeout(100000);
  it("should send user to the home page", function(done) {
    Nightmare({ show: true })
      .goto("http://www.abetteryou.herokuapp.com")
      .wait(1000) //set time limits
      // Evaluate the title
      .evaluate(function() {
        return document.title;
      })
      .end()
      // Asset the title is as expected
      .then(function(title) {
        expect(title).to.equal("A Better you");
        done();
      })
      .catch(done);
  });

  it("should search for the recipes with the ingredient you add", function(done) {
    Nightmare({ show: true })
      .goto("http://localhost:8080/home")
      // Enter ingredient
      .type("#user-input", "tacos")
      // Click the search button
      .click(".search")
      .wait(1000) // set time limits
      // Evaluate the following selector
      .evaluate(function() {
        document.querySelector("a[href='/home']");
      })
      .end()
      // Assert the "learn" link can be found
      .then(function(link) {
        expect(link).to.not.equal(undefined);
        done();
      })
      .catch(done);
  });

  it("should throw an error to make your day", function() {
    throw new Error("Sorry, Charlie!");
  });
});
