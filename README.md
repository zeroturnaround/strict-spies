# Strict spies

A strict alternative for [Jasmine spies][]. Also works for [Chai][].

## Install

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
