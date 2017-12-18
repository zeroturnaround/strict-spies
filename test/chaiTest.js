import {expect} from "chai";
import StrictSpies from "../src/chai";

describe("StrictSpies for Chai", function() {
    beforeEach(function() {
        // Initialize spies container for each test run.
        this.spies = new StrictSpies();
    });

    it("initializes this.spies", function() {
        expect(this.spies).to.be.an.instanceof(StrictSpies);
    });
});
