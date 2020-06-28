class Collab {

    /**
     * @param url {string}
     * @param form {HTMLFormElement}
     * @param led {Led}
     * @param logger {Logger}
     */
    constructor(url, form, led, logger) {
        this.url = url;
        this.form = form;
        this.formData = null;
        this.tasks = {};

        this.led = led;
        this.log = logger;
        this.__socketRegisterEvents(this);
    }

    /**
     * Register socket.io events
      * @param self {Collab}
     */
    __socketRegisterEvents(self) {
        this.socket = io.connect(this.url);
        this.socket.on('form-init'           , (data)    => { self.__socketInit(data) });
        this.socket.on('form-change'         , (data)    => { self.__socketFormChange(data.payload) });
        this.socket.on('form-change-confirm' , (data)    => { self.__socketFormChangeConfirm(data.payload) });

        this.socket.on('connect'         , ()        => { self.__socketConnect('Connected')   });
        this.socket.on('reconnect'       , (attempt) => { self.__socketConnect('Reconnected') });

        this.socket.on('connect_error'   , (error)   => { self.__socketError('connect_error'   , error) });
        this.socket.on('reconnect_error' , (error)   => { self.__socketError('reconnect_error' , error) });
        this.socket.on('reconnect_failed', ()        => { self.__socketError('reconnect_failed', null)  });
        this.socket.on('connect_timeout' , ()        => { self.__socketError('connect_timeout' , null)  });

        this.socket.on('reconnecting'     , (attempt) => { self.__socketNotice('Reconnecting'     , attempt) });
        this.socket.on('reconnect_attempt', (attempt) => { self.__socketNotice('Reconnect attempt', attempt) });
        this.socket.on('ping'             , ()        => { self.__socketNotice('Ping', 'ok') });
        this.socket.on('pong'             , ()        => { self.__socketNotice('Pong', 'ok') });
    }

    /**
     * Send task with socket.io
     * @param id {string} form element id
     * @private
     */
    __send(id) {
        this.led.black();
        this.log.add("__send");
        this.socket.emit(
            this.tasks[id].path,
            this.tasks[id].element
        );
    }

    /**
     * Removes task from list and maintained local server state
     * @param id {string} form element id
     * @private
     */
    __taskDone(id) {
        this.log.add("__taskDone");

        if (this.formData[id].kind === "radio") {
            for (let element in this.formData) {
                if (!this.formData.hasOwnProperty(element)) continue;
                if (this.formData[element].name !== this.formData[id].name) continue;
                this.formData[element].checked = false;
            }
        }

        delete this.tasks[id];
    }

    /**
     * Handle input change - create and send task
     * @param input {HTMLInputElement}
     * @private
     */
    __changeHandler(input) {
        this.log.add("__changeHandler");
        this.tasks[input.id] = {
            path: 'form',
            element: this.__serialize(input.id),
            oldElement: this.formData[input.id]
        };
        this.__send(input.id)
    }

    /**
     * Serialize DOM input to Object
     * @param id {string} form element id
     * @returns
     * {{kind: string, name: string, id: string, type: string, value: string}|
     *  {kind: string, name: string, id: string, type: string, checked: boolean}}
     * @private
     */
    __serialize(id) {
        let element = document.getElementById(id),
              type = element.getAttribute("type"),
              name = element.getAttribute("name"),
              value = element.value,
              checked = element.checked;

        if (element.type === "range") {
            value = parseInt(value);
        }

        if (element.kind === "value") {
            return {kind : element.kind, id, type, name, value}
        }

        if (["checked", "radio"].includes(element.kind)) {
            return {kind: element.kind, id, type, name, checked}
        }
    }

    /**
     * Create form input element
     * @param element {Object}
     * @returns {HTMLLabelElement}
     * @private
     */
    __createFormInput(element) {
        let labelName = document.createElement("span");
        labelName.appendChild(document.createTextNode(element.label));
        labelName.className = "label-name";
        let input = document.createElement("input");

        for (let attribute in element) {
            if (!element.hasOwnProperty(attribute)) continue;
            input[attribute] = element[attribute];
            if (attribute === "value" && element.type === "range") {
                setTimeout(() => {input[attribute] = element[attribute]}, 1);
            }
        }

        if (["checkbox", "radio", "range"].includes(element.type)) {
            input.onchange = () => this.__changeHandler(input);
        }

        if (element.type === "text") {
            input.onkeyup = () => this.__changeHandler(input);
        }

        let label = document.createElement("label");
        label.appendChild(labelName);
        label.appendChild(input);
        return label;
    }

    /**
     * Resolve conflicts after lost connection
     * @param newFormData {Object}
     * @private
     */
    __resolveConflicts(newFormData) {
        for (let task in this.tasks) {
            if (!this.tasks.hasOwnProperty(task)) continue;

            let old = this.tasks[task].oldElement;
            if (
                (old.type === "text" && old.value !== newFormData[old.id].value) ||
                (old.type === "checkbox" && old.checked !== newFormData[old.id].checked)
            ) {
                this.log.add(task + " -----> conflicted!");
            } else {
                this.log.add(task + " -----> resending!");
                this.__send(task);
            }
        }
    }

    /**
     * Create form
     * @param dataForm {Object}
     * @private
     */
    __createForm(dataForm) {
        this.formData = dataForm;
        this.form.innerHTML  = "";
        for (let element in this.formData) {
            if (!this.formData.hasOwnProperty(element)) continue;
            this.form.appendChild(
                this.__createFormInput(this.formData[element])
            );
        }
    }

    /**
     * Set form controls and local server state
     * @param data {Object}
     * @private
     */
    __consumeData(data) {
        if (["checked", "radio"].includes(data.kind)) {
            document.getElementById(data.id).checked = data.checked;
            this.formData[data.id].checked = data.checked;
        }

        if (data.kind === "value") {
            document.getElementById(data.id).value = data.value;
            this.formData[data.id].value = data.value;
        }
    }

    /**
     * Receiving "form-init" data from server
     * @param data {Object}
     * @private
     */
    __socketInit(data) {
        this.led.darkred();
        this.log.add("--- SOCKET INIT ---");
        this.__createForm(data.form);
        this.__resolveConflicts(data.form);
    }

    /**
     * Receiving "form-change-confirm" data from server
     * @param data {Object}
     * @private
     */
    __socketFormChangeConfirm(data) {
        this.log.add("__socketFormChangeConfirm");
        this.led.darkred();
        this.led.blink("#F00");
        this.__taskDone(data.id);
        this.__consumeData(data);
    }

    /**
     * Receiving "form-change" data from server
     * @param data {Object}
     * @private
     */
    __socketFormChange(data) {
        this.log.add("__socketFormChange");
        this.led.blink('#F00');
        this.__consumeData(data);
    }

    /**
     * connect, reconnect
     * @param type {string}
     * @private
     */
    __socketConnect(type) {
        this.led.darkred();
        this.log.add(type + ' to server');

        this.socket.sendBuffer = [];
    }

    /**
     * connect_error, reconnect_error, reconnect_failed, connect_timeout
     * @param type {string}
     * @param error {{type:*, description:*}|null}
     * @private
     */
    __socketError(type, error = null) {
        this.led.black();
        this.led.blink('#00F');
        if (typeof error !== "undefined") {
            this.log.add("Error connecting to server: " + type + " " + error.type + " " + error.description);
        } else {
            this.log.add("Error connecting to server");
        }
    }

    /**
     * reconnecting, reconnect_attempt, ping, pong
     * @param type {string}
     * @param value
     * @private
     */
    __socketNotice(type, value) {
        this.led.blink('#00F');
        this.log.add(type + ": " + value);
    }
}
