class Led {

    /**
     * Led constructor
     * @param element {SVGElement}
     * @param color {string}
     */
    constructor(element, color = "#000") {
        this.element = element;
        this.color = color;
        this.set();
    }

    /**
     * Set self object or custom color
     * @param color {string|null}
     */
    set(color = null) {
        this.element.setAttribute("fill", color || this.color);
    }

    /**
     * Blink
     * @param color {string} blink color
     * @param time {int} blink time [ms]
     */
    blink(color, time = 300) {
        this.set(color || '#FFF');
        setTimeout(() => {this.set(this.color)}, time);
    }

    /**
     * Set color to red
     */
    red() {
        this.color = '#F00';
        this.set();
    }

    /**
     * Set color to darkred
     */
    darkred() {
        this.color = '#600';
        this.set();
    }

    /**
     * Set color to green
     */
    green() {
        this.color = '#0F0';
        this.set();
    }

    /**
     * Set color to blue
     */
    blue() {
        this.color = '#00F';
        this.set();
    }

    /**
     * Set color to yellow
     */
    yellow() {
        this.color = '#FF0';
        this.set();
    }

    /**
     * Set color to orange
     */
    orange() {
        this.color = '#FA0';
        this.set();
    }

    /**
     * Set color to black
     */
    black() {
        this.color = '#000';
        this.set();
    }

    /**
     * Set color to white
     */
    white() {
        this.color = '#FFF';
        this.set();
    }
}
