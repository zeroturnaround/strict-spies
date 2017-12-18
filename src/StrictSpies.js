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
