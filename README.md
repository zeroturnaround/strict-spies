# Strict spies

A strict alternative for [Jasmine spies][]. Also works for [Chai][].

Jasmine treats each spy as a separate entity.
You can ask whether that spy was called, but you can't easily ask whether only that spy was called.


## Motivational example

Say, you have a button class that supports both clicking and double-clicking.
You want to test that click and double-click event handlers are called accordingly.
With strict spies, this is easy:

```js
describe("Button", function() {
    beforeEach(function() {
        this.domEl = document.createElement("button");
        this.button = new Button(this.domEl, {
            onClick: this.spies.create("onClick"),
            onDoubleClick: this.spies.create("onDoubleClick"),
        });
    });
    
    it("when not clicked, fires no events", function() {
        expect(this.button).not.toHaveAnyCalls();
    });
    
    describe("when clicked once", function() {
        beforeEach(function() {
            this.domEl.click();
        });
        
        it("fires only onClick event", function() {
            expect(this.spies).toHaveSingleCall("onClick", this.domEl);
        });
    });

    describe("when clicked two times in succession", function() {
        beforeEach(function() {
            this.domEl.click();
            this.domEl.click();
        });
        
        it("fires both onClick and onDoubleClick events", function() {
            expect(this.spies).toHaveCalls([
                ["onClick", this.domEl],
                ["onDoubleClick", this.domEl],
            ]);
        });
    });
});
```

Note that we were able to:

- test that none of the spies were called without explicitly naming each one.
- test that only one spy was called, without explicitly testing that the other wasn't.
- test that the two spies were called in the specified order.

## Install

    npm install --save-dev strict-spies

or

    yarn add --dev strict-spies

## Usage with Jasmine

Include in your Jasmine setup file that's run before all tests:

```js
import StrictSpies from "strict-spies/jasmine";

beforeEach(function() {
    // Initialize spies container for each test run.
    this.spies = new StrictSpies();

    // Register Spies-specific assertions to be used instead of Jasmine built-in spy-assertions
    jasmine.addMatchers(StrictSpies.assertions);
});
```

## Usage with Chai

Add to your Mocha setup file:

```js
import chai from "chai";
import StrictSpies from "strict-spies/chai";

// Register Spies-specific assertions
chai.use(StrictSpies.assertions);

beforeEach(function() {
    // Initialize spies container for each test run.
    this.spies = new StrictSpies();
});
```


[Jasmine spies]: https://jasmine.github.io/2.5/introduction#section-Spies
[Chai]: http://chaijs.com/
