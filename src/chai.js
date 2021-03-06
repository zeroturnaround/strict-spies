// Chai integration
import StrictSpies from "./StrictSpies";

// Export assertions() both as separate named export
// and as a static property of StrictSpies class.
StrictSpies.assertions = assertions;
export default StrictSpies;

export function assertions({Assertion}, utils) {
    Assertion.addProperty('anyCalls', function() {
        const calls = this._obj.calls();

        this.assert(
            calls.length > 0,
            "Expected at least some calls, but found none",
            `Expected no calls, but found ${calls.length}`,
            [],
            calls
        );
    });

    Assertion.addMethod('calls', function(expectedCalls) {
        const calls = this._obj.calls();

        new Assertion(calls).to.deep.equal(expectedCalls);
    });

    Assertion.addMethod('singleCall', function(...expectedCall) {
        const calls = this._obj.calls();

        new Assertion(calls).to.deep.equal([expectedCall]);
    });
}
