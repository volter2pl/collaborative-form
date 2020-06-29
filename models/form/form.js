class Form {
    /**
     * Form constructor
     */
    constructor() {
        this.elements = {
            first1: {kind: "checked", id: "first1", label: "1", name: "first", type: "checkbox", value: "1", checked: false},
            first2: {kind: "checked", id: "first2", label: "2", name: "first", type: "checkbox", value: "2", checked: false},
            first3: {kind: "checked", id: "first3", label: "3", name: "first", type: "checkbox", value: "3", checked: false},
            second1: {kind: "checked", id: "second1", label: "a", name: "second", type: "checkbox", value: "a", checked: false},
            second2: {kind: "checked", id: "second2", label: "b", name: "second", type: "checkbox", value: "b", checked: false},
            text1: {kind: "value",  id: "text1", label: "text", name: "text", type: "text", value: "hello world"},
            range1: {kind: "value", id: "range1", label: "range", name: "range", type: "range", value: 100, min: 50, max: 200},
            third1: {kind: "radio", id: "third1", label: "x", name: "third", type: "radio", value: "x", checked: false},
            third2: {kind: "radio", id: "third2", label: "y", name: "third", type: "radio", value: "y", checked: false},
            third3: {kind: "radio", id: "third3", label: "z", name: "third", type: "radio", value: "z", checked: false},
        };
    }

    /**
     * Get element(s)
     * @returns {Object}
     */
    get() {
        return this.elements;
    }

    /**
     * Set element value
     * @param id {string}
     * @param value {string|int}
     * @private
     */
    __setValue(id, value) {
        this.elements[id].value = value;
    };

    /**
     * Set element checked value
     * @param id {string|null}
     * @param checked {boolean}
     * @private
     */
    __setChecked(id, checked) {
        if (this.elements[id].kind === "radio") {
            for (let element in this.elements) {
                if (!this.elements.hasOwnProperty(element)) continue;
                if (this.elements[element].name !== this.elements[id].name) continue;
                this.elements[element].checked = false;
            }
        }
        this.elements[id].checked = checked;
    };

    /**
     * Update element value or checked depends on type
     * @param element
     * @returns {*}
     */
    updateElement(element) {
        if (element.kind === "value") {
            this.__setValue(element.id, element.value);
        }

        if (["checked", "radio"].includes(element.kind)) {
            this.__setChecked(element.id, element.checked);
        }

        return this.elements[element.id];
    };
}

module.exports = new Form();
