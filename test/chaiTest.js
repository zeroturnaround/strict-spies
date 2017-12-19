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

    describe("when single spy called multiple times", function() {
        beforeEach(function() {
            ["a", "b", "c"].forEach(this.spies.create("callback"));
        });

        it("to.have.calls() checks for all the calls (in order of execution)", function() {
            expect(this.spies).to.have.calls([
                ["callback", "a", 0, ["a", "b", "c"]],
                ["callback", "b", 1, ["a", "b", "c"]],
                ["callback", "c", 2, ["a", "b", "c"]],
            ]);
        });

        it("to.have.anyCalls succeeds", function() {
            expect(this.spies).to.have.anyCalls;
        });

        resetRemovesAllCallsData();
    });

    describe("when multiple spies called", function() {
        beforeEach(function() {
            const spy1 = this.spies.create("callback1");
            const spy2 = this.spies.create("callback2");

            spy1();
            spy2();
            spy1();
        });

        it("to.have.calls() checks for all the calls (in order of execution)", function() {
            expect(this.spies).to.have.calls([
                ["callback1"],
                ["callback2"],
                ["callback1"],
            ]);
        });

        it("to.have.anyCalls succeeds", function() {
            expect(this.spies).to.have.anyCalls;
        });

        resetRemovesAllCallsData();
    });

    describe("when spy is created with fake implementation", function() {
        beforeEach(function() {
            const mySpy = this.spies.create("callback", (x, y) => x * y);

            this.returnValue = mySpy(5, 6);
        });

        it("when called, the function is executed and the result returned", function() {
            expect(this.returnValue).to.equal(30);
        });

        it("spy assertions work like before", function() {
            expect(this.spies).to.have.singleCall("callback", 5, 6);
            expect(this.spies).to.have.calls([["callback", 5, 6]]);
            expect(this.spies).to.have.anyCalls;
        });
    });

    describe("when spies created with createObj()", function() {
        beforeEach(function() {
            const spyObj = this.spies.createObj("SpyObj", ["foo", "bar"]);

            spyObj.foo("arg1");
            spyObj.bar("arg2");
        });

        it("to.have.calls() uses class+method name for spy names", function() {
            expect(this.spies).to.have.calls([
                ["SpyObj.foo", "arg1"],
                ["SpyObj.bar", "arg2"],
            ]);
        });

        it("to.have.anyCalls succeeds", function() {
            expect(this.spies).to.have.anyCalls;
        });

        resetRemovesAllCallsData();
    });

    describe("when scoped spy called", function() {
        beforeEach(function() {
            const spy1 = this.spies.createScoped("callback");
            const obj = {hello: "world"};
            spy1.call(obj, "arg1", "arg2");
        });

        it("to.have.singleCall() checks for both `this` and arguments", function() {
            expect(this.spies).to.have.singleCall("callback", {hello: "world"}, "arg1", "arg2");
        });

        it("to.have.calls() checks for both `this` and arguments", function() {
            expect(this.spies).to.have.calls([
                ["callback", {hello: "world"}, "arg1", "arg2"],
            ]);
        });

        it("to.have.anyCalls succeeds", function() {
            expect(this.spies).to.have.anyCalls;
        });

        resetRemovesAllCallsData();
    });

    describe("when identity checks are required", function() {
        beforeEach(function() {
            this.obj = {};
            const spy = this.spies.create("callback");
            spy(this.obj);
        });

        it("to.have.singleCall() compares using to.deep.equal()", function() {
            expect(this.spies).to.have.singleCall("callback", {});
        });

        it("calls() gives us the same data that to.have.calls() compares against", function() {
            expect(this.spies.calls()).to.deep.equal([
                ["callback", {}]
            ]);
        });

        it("use calls() to check the identity using to.equal()", function() {
            const firstCall = this.spies.calls()[0];
            const firstArg = firstCall[1];
            expect(firstArg).to.equal(this.obj);
        });

        describe("reset()", function() {
            beforeEach(function() {
                this.spies.reset();
            });

            it("also clears raw calls data", function() {
                expect(this.spies.calls()).to.deep.equal([]);
            });
        });
    });
});
