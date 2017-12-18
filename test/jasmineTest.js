import StrictSpies, {toHaveCalls, toHaveSingleCall, toHaveAnyCalls} from "../src/jasmine";

describe("StrictSpies", function() {
    beforeEach(function() {
        // Initialize spies container for each test run.
        this.spies = new StrictSpies();

        // Register Spies-specific assertions to be used insited of Jasmine built-in spy-assertions
        jasmine.addMatchers({toHaveCalls, toHaveSingleCall, toHaveAnyCalls});
    });

    // Helper for testing that reset() functionality works with all the scenarios
    function resetRemovesAllCallsData() {
        describe("reset()", function() {
            beforeEach(function() {
                this.spies.reset();
            });

            it("removes all calls data", function() {
                expect(this.spies).not.toHaveAnyCalls();
                expect(this.spies).toHaveCalls([]);
            });
        });
    }

    describe("when no spies called", function() {
        beforeEach(function() {
            // Create a spy, but don't use it
            this.spies.create("callback");
        });

        it("toHaveCalls() succeeds with empty calls array", function() {
            expect(this.spies).toHaveCalls([]);
        });

        it("toHaveAnyCalls() fails", function() {
            expect(this.spies).not.toHaveAnyCalls();
        });

        resetRemovesAllCallsData();
    });

    describe("when single spy called", function() {
        beforeEach(function() {
            const mySpy = this.spies.create("callback");

            this.returnValue = mySpy("hello", "world");
        });

        it("returns undefined", function() {
            expect(this.returnValue).toBe(undefined);
        });

        it("toHaveSingleCall() checks that it was called just once", function() {
            expect(this.spies).toHaveSingleCall("callback", "hello", "world");
        });

        it("toHaveCalls() can also be used, but it's a bit more verbose", function() {
            expect(this.spies).toHaveCalls([
                ["callback", "hello", "world"],
            ]);
        });

        it("toHaveAnyCalls() succeeds", function() {
            expect(this.spies).toHaveAnyCalls();
        });

        resetRemovesAllCallsData();
    });

    describe("when single spy called multiple times", function() {
        beforeEach(function() {
            ["a", "b", "c"].forEach(this.spies.create("callback"));
        });

        it("toHaveCalls() checks for all the calls (in order of execution)", function() {
            expect(this.spies).toHaveCalls([
                ["callback", "a", 0, ["a", "b", "c"]],
                ["callback", "b", 1, ["a", "b", "c"]],
                ["callback", "c", 2, ["a", "b", "c"]],
            ]);
        });

        it("toHaveAnyCalls() succeeds", function() {
            expect(this.spies).toHaveAnyCalls();
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

        it("toHaveCalls() checks for all the calls (in order of execution)", function() {
            expect(this.spies).toHaveCalls([
                ["callback1"],
                ["callback2"],
                ["callback1"],
            ]);
        });

        it("toHaveAnyCalls() succeeds", function() {
            expect(this.spies).toHaveAnyCalls();
        });

        resetRemovesAllCallsData();
    });

    describe("when spy is created with fake implementation", function() {
        beforeEach(function() {
            const mySpy = this.spies.create("callback", (x, y) => x * y);

            this.returnValue = mySpy(5, 6);
        });

        it("when called, the function is executed and the result returned", function() {
            expect(this.returnValue).toBe(30);
        });

        it("spy assertions work like before", function() {
            expect(this.spies).toHaveSingleCall("callback", 5, 6);
            expect(this.spies).toHaveCalls([["callback", 5, 6]]);
            expect(this.spies).toHaveAnyCalls();
        });
    });

    describe("when spies created with createObj()", function() {
        beforeEach(function() {
            const spyObj = this.spies.createObj("SpyObj", ["foo", "bar"]);

            spyObj.foo("arg1");
            spyObj.bar("arg2");
        });

        it("toHaveCalls() uses class+method name for spy names", function() {
            expect(this.spies).toHaveCalls([
                ["SpyObj.foo", "arg1"],
                ["SpyObj.bar", "arg2"],
            ]);
        });

        it("toHaveAnyCalls() succeeds", function() {
            expect(this.spies).toHaveAnyCalls();
        });

        resetRemovesAllCallsData();
    });

    describe("when scoped spy called", function() {
        beforeEach(function() {
            const spy1 = this.spies.createScoped("callback");
            const obj = {hello: "world"};
            spy1.call(obj, "arg1", "arg2");
        });

        it("toHaveSingleCall() checks for both `this` and arguments", function() {
            expect(this.spies).toHaveSingleCall("callback", {hello: "world"}, "arg1", "arg2");
        });

        it("toHaveCalls() checks for both `this` and arguments", function() {
            expect(this.spies).toHaveCalls([
                ["callback", {hello: "world"}, "arg1", "arg2"],
            ]);
        });

        it("toHaveAnyCalls() succeeds", function() {
            expect(this.spies).toHaveAnyCalls();
        });

        resetRemovesAllCallsData();
    });

    describe("when identity checks are required", function() {
        beforeEach(function() {
            this.obj = {};
            const spy = this.spies.create("callback");
            spy(this.obj);
        });

        it("toHaveSingleCall() compares using toEqual()", function() {
            expect(this.spies).toHaveSingleCall("callback", {});
        });

        it("calls() gives us the same data that toHaveCalls() compares against", function() {
            expect(this.spies.calls()).toEqual([
                ["callback", {}]
            ]);
        });

        it("use calls() to check the identity using toBe()", function() {
            const firstCall = this.spies.calls()[0];
            const firstArg = firstCall[1];
            expect(firstArg).toBe(this.obj);
        });

        describe("reset()", function() {
            beforeEach(function() {
                this.spies.reset();
            });

            it("also clears raw calls data", function() {
                expect(this.spies.calls()).toEqual([]);
            });
        });
    });
});
