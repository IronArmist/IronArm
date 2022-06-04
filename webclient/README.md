# Nutzung des Web-Clients

Für die Nutzung des Web-Clients bzw. der Webapplikation ist keine Installation
notwendig. Es muss lediglich ein Webbrowser installiert sein.

Die Webapplikation wird geöffnet durch Laden der Datei /IronArm/webclient/dist/index.html in einem Webbrowser.

Der Web-Client kann nicht nur genutzt werden, um zu beobachten, wie die
in Python geschriebenen Instruktionen ausgeführt werden, sondern auch um
den Roboterarm selbst manuell zu steuern und damit sowohl ein Gefühl für die
Steuerung zu entwickeln oder auch um gezielt Rotationsstellungen auszupro-
bieren und die entsprechenden Werte abzulesen und für Instruktionen verwen-
den zu können. Dabei stehen zwei Werkzeuge zur Verfügung. Zum einen eine
Schieberegler-Sektion, die jedes einzelne Armsegment in einer Spanne von -180°
bis 180° rotieren kann. Der Arm wird sich in 0.25°-Schritten dann zu der einge-
stellten Zielstellung bewegen. Zum anderen eine Inputfeld-Sektion, in die Werte
von -180 bis 180 eingetragen werden können. Durch Klick auf "Start!“, wird sich
der Arm in 0.25°-Schritten dann zu der eingestellten Zielstellung bewegen.

Die Webapplikation stellt eine Spielwiese bereit, auf der man den Roboter-
arm verschiedene Aufgaben ausführen lassen kann. Es existiert ein Aufbau zum
Spielen der Türme von Hanoy mit fünf Turmsegmenten und eine durchsichtige
Rutsche mit unterschiedlich großen Bällen, die in einem Auffangbehälter um-
herrollen und somit lokalisiert werden müssen, bevor man sie greifen und erneut
in die Öffnung auf der Oberseite der Rutsche fallen lassen kann.

# Weiterentwicklung des Web-Clients

Für Modifikation und Weiterentwicklung des Web-Clients sind folgende Schritte
durchzuführen:

- installiere Node.js (Download: https://nodejs.org/)
- öffne in /IronArm ein Terminal bzw. eine Eingabeaufforderung
- navigiere in ./webclient
- führe folgendes Kommando aus, um die nötigen Packages für den lokalen
  Server zu installieren:

      npm run install

- zur Nutzung des Live-Servers, der den Browser automatisch bei Codeän-
  derungen aktualisiert, führe folgendes Kommando aus:

      npm run start

- die Webapplikation wird sich automatisch unter localhost:8080 öffnen
- zur Erzeugung eines neuen Builds, der nach ./webclient/dist exportiert
  wird, führe folgendes Kommando aus:

      npm run build
