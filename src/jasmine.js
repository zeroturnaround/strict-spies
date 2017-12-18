// Jasmine integration
export {default} from "./StrictSpies";

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
