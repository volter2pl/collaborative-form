# Collaborative Form

An application supporting cooperation on the same HTML form

## Installation

```bash
git clone https://github.com/volter2pl/collaborative-form.git
cd collaborative-form
npm install
```

### HTTPS
Go to "sslcert" directory and put your certificates (or use example one for test purpose only by changing extension)

## Run
Linux `DEBUG=cf:* npm start`\
Windows `SET DEBUG=cf:* & npm start`

## Tests
```bash
npm test
```

## Info
* This is demo application
* The form resets in every server restart
* You can change example form in file `models/form/form.js`
* Application keeps form state in memory
* Application supports client lost connection
* Frontend application is in file `public/javascripts/collab/collab.js`

## Author
Szymon Maciejewski
