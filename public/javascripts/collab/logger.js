class Logger {

    /**
     * Logger constructor
     * @param target {HTMLDivElement}
     * @param config {{max: int, showNotice: boolean}}
     */
    constructor(target, config) {
        this.content = [];
        this.target = target;
        this.max = config.max || 10;
        this.showNotice = config.showNotice || false;
        this.counter = 0;
    }

    /**
     * Add  text to log and print all content
     * @param text {string}
     */
    add(text) {
        this.counter++;
        this.content.push(this.counter.toString().padStart(3, '0') + ": " + text);
        if (this.content.length > this.max) {
            this.content.shift();
        }

        this.print();
    }

    /**
     * Add notice to log
     * @param text
     */
    notice(text) {
        if (this.showNotice) {
            this.add(text);
        }
    }

    /**
     * Get log content
     * @returns {[]|*[]}
     */
    get() {
        return this.content;
    }

    /**
     * Print logs to HTML element
     */
    print() {
        if (typeof this.target !== "undefined") {
            this.target.innerHTML = this.get().join('<br>');
        }
    }
}
