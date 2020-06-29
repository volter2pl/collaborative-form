module.exports = io => {

    const debug = require('debug')('cf:io');

    io.on('connection', socket => {

        const ACTION = 'form';
        let Form = require('../models/form/form');

        /* new user, sending current server state */
        debug((new Date()) + ' New IO user, sending current state', socket.id);
        socket.emit(ACTION.concat('-init'), {
            form: Form.get()
        });

        socket.on('disconnect', () => {
            debug((new Date()) + " IO client disconnected", socket.id);
        });

        socket.on(ACTION, payload => {
            let newElementState = Form.updateElement(payload);

            socket.broadcast.emit(ACTION.concat("-change"), {
                message: 'someone send request',
                payload: newElementState
            });

            socket.emit(ACTION.concat("-change-confirm"), {
                message: 'request received',
                payload: newElementState
            });
        });

    });

    return io;
};
