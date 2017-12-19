import chai, {expect} from "chai";
import StrictSpies, {assertions} from "../src/chai";

describe("StrictSpies for Chai", function() {
    beforeEach(function() {
        // Initialize spies container for each test run.
        this.spies = new StrictSpies();

        chai.use(assertions);
    });

    // Helper for testing that reset() functionality works with all the scenarios
    function resetRemovesAllCallsData() {
        describe("reset()", function() {
            beforeEach(function() {
                this.spies.reset();
            });

            it("removes all calls data", function() {
                expect(this.spies).not.to.have.anyCalls;
                expect(this.spies).to.have.calls([]);
            });
        });
    }

    describe("when no spies called", function() {
        beforeEach(function() {
            // Create a spy, but don't use it
            this.spies.create("callback");
        });

        it("to.have.calls() succeeds with empty calls array", function() {
            expect(this.spies).to.have.calls([]);
        });

        it("to.have.anyCalls fails", function() {
            expect(this.spies).not.to.have.anyCalls;
        });

        resetRemovesAllCallsData();
    });

    describe("when single spy called", function() {
        beforeEach(function() {
            const mySpy = this.spies.create("callback");

            this.returnValue = mySpy("hello", "world");
        });

        it("returns undefined", function() {
            expect(this.returnValue).to.equal(undefined);
        });

        it("to.have.singleCall() checks that it was called just once", function() {
            expect(this.spies).to.have.singleCall("callback", "hello", "world");
        });

        it("to.have.calls() can also be used, but it's a bit more verbose", function() {
            expect(this.spies).to.have.calls([
                ["callback", "hello", "world"],
            ]);
        });

        it("to.have.anyCalls succeeds", function() {
            expect(this.spies).to.have.anyCalls;
        });

        resetRemovesAllCallsData();
    });
});
