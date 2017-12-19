// Chai integration
export {default} from "./StrictSpies";

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
}
