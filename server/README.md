# Nutzung des lokalen Websocket-Servers

## Installation Node.js und Server-packages

- installiere Node.js (Download: https://nodejs.org/)
- öffne in /IronArm ein Terminal bzw. eine Eingabeaufforderung
- navigiere in ./server
- führe folgendes Kommando aus, um die nötigen Packages für den lokalen
  server zu installieren:

      npm run install

## Starten des Websocket-Servers

Bei Nutzung des lokalen Servers ist wichtig, dass der Server bereits läuft, wenn
der Web-Client gestartet bzw. die Webapplikation geöffnet wird, damit der Roboterarm über den Python-Client angesprochen werden kann. Es reicht dabei,
das Browserfenster nach Starten des Servers zu aktualisieren. Um den Server zu
starten, führe folgende Schritte aus:

- öffne in /IronArm ein Terminal bzw. eine Eingabeaufforderung
- navigiere in ./server
- starte den Server mit folgendem Kommando:

      npm run start

- halte das Terminalfenster geöffnet. Ein Schließen würde den Server stoppen.
