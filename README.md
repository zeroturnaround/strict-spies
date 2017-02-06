# Strict spies

A strict alternative for [Jasmine spies][].

## Install

    yarn add --dev strict-spies

## Usage

Include in your Jasmine setup file that's run before all tests:

```js
import StrictSpies, {toHaveCalls, toHaveSingleCall, toHaveAnyCalls} from "strict-spies";

beforeEach(function() {
    // Initialize spies container for each test run.
    this.spies = new StrictSpies();

    // Register Spies-specific assertions to be used insited of Jasmine built-in spy-assertions
    jasmine.addMatchers({toHaveCalls, toHaveSingleCall, toHaveAnyCalls});
});
```


[Jasmine spies]: https://jasmine.github.io/2.5/introduction#section-Spies
