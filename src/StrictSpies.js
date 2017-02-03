/**
 * Helper for creating spies.
 */
export default class Spies {
    constructor() {
        this.allCalls = [];
    }

    /**
     * Creates a single spy function.
     *
     * Note that the created spy does not store information about the `this` value,
     * to gather `this` values, use createScoped().
     *
     * @param {String} name Unique name for the function
     * @param {Function} [mockFunc] A mocked function to call
     * @return {Function}
     */
    create(name, mockFunc) {
        return (...args) => {
            this.allCalls.push([name, ...args]);

            if (mockFunc) {
                return mockFunc(...args);
            }
        };
    }

    /**
     * Creates a single spy function that also monitors its `this` parameter.
     *
     * When a scoped spy is called, the calls() array will contain: [name, this, arg1, arg2, ...]
     *
     * @param {String} name Unique name for the function
     * @return {Function}
     */
    createScoped(name) {
        const self = this;
        return function(...args) {
            self.allCalls.push([name, this, ...args]);
        };
    }

    /**
     * Creates a Spy object with set of methods to spy on.
     * @param {String} prefix A prefix for each spy method name.
     *   This helps us differenciate between different spy objects
     *   that have methods with same names.
     * @param {String[]} methodNames Array of method names to spy
     * @return {Object}
     */
    createObj(prefix, methodNames) {
        const obj = {};
        methodNames.forEach((name) => {
            obj[name] = this.create(prefix + "." + name);
        });
        return obj;
    }

    /**
     * Clears all gathered spying data.
     */
    reset() {
        this.allCalls = [];
    }

    /**
     * Returns array of all calls to all the spies.
     * Each call being represented by array of: [name, arg1, arg2, ...]
     * @return {Array}
     */
    calls() {
        return this.allCalls;
    }
}

/**
 * Jasmine assertion to check all calls to spies.
 *
 * For example:
 *
 *     expect(this.spies).toHaveCalls([
 *         ["myFunc1", "arg1", "arg2"],
 *         ["myFunc2", "arg3", "arg4"],
 *     ]);
 */
export function toHaveCalls(...helpers) {
    return {
        compare(spies, expected) {
            return compareCalls(spies, expected, ...helpers);
        }
    };
}

/**
 * Jasmine assertion to check single call of a spy.
 * Will also fail when more than other spies have also been called.
 *
 * For example:
 *
 *     expect(this.spies).toHaveSingleCall("myFunc", "arg1", "arg2");
 */
export function toHaveSingleCall(...helpers) {
    return {
        compare(spies, ...expected) {
            return compareCalls(spies, [expected], ...helpers);
        }
    };
}

function compareCalls(spies, expected, util, customEqualityTesters) {
    const actual = spies.calls();
    const result = {};
    result.pass = util.equals(actual, expected, customEqualityTesters);

    if (result.pass) {
        result.message = () => {
            throw "Do not use negative assertions with spies";
        };
    }
    else {
        result.message = () => "Expected calls\n" + jasmine.pp(actual) + "\nto equal\n" + jasmine.pp(expected);
    }

    return result;
}

/**
 * Jasmine assertion to check whether any calls have happened at all.
 *
 * Mainly to be used for checking that no calls have happened.
 *
 *     expect(this.spies).not.toHaveAnyCalls();
 */
export function toHaveAnyCalls() {
    return {
        compare(spies) {
            const actual = spies.calls();

            const result = {};
            result.pass = actual.length > 0;

            if (result.pass) {
                result.message = () => "Expected no calls, but found\n" + jasmine.pp(actual);
            }
            else {
                result.message = () => "Expected at least some calls, but found none";
            }

            return result;
        }
    };
}
