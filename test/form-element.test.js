const assert = require('assert');
const Form = require('../models/form/form');

describe('Form model Test', () => {

    it('check if get without parameters returns object', () => {
        const all = Form.get();
        assert.strictEqual(typeof all === "object", true);
    });

    it('checkbox change', () => {
        Form.updateElement({kind: "checked", id: "second1", checked: false});
        Form.updateElement({kind: "checked", id: "second1", checked: true});
        assert.strictEqual(Form.get("second1").checked, true);
    });

    it('radio change', () => {
        Form.updateElement({kind: "radio", id: "third1", checked: true});
        Form.updateElement({kind: "radio", id: "third2", checked: true});
        Form.updateElement({kind: "radio", id: "third3", checked: true});
        assert.strictEqual(
            Form.get("third1").checked === false &&
            Form.get("third2").checked === false &&
            Form.get("third3").checked === true,
            true
        );
    });

    it('input text change', () => {
        const TEST_STRING = "JS rules!";
        Form.updateElement({kind: "value", id: "text1", value: TEST_STRING});
        assert.strictEqual(Form.get("text1").value, TEST_STRING)
    });
});
