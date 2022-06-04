# Nutzung des Python-Clients

Für die Kommunikation mit dem Roboterarm via Python-Script müssen folgen-
de Installationen durchgeführt werden.

## Installation von Python und Python-Packages

- installiere Python 3.7. oder höher
  (Download: https://www.python.org/downloads/)
- installiere das package websockets mit folgendem Kommando in einem
  Terminal bzw. einer Eingabeaufforderung:

      pip3 install websockets

Es ist zu beachten, dass bereits auf dem Rechner installierte ältere Versionen
von Python Fehler bei der Installation als auch bei der Ausführung verursachen
können. Für IronArm ist Version 3.7. oder höher auf Grund der Nutzung von
asyncio zwingende Voraussetzung. Entsprechend muss darauf achtgegeben wer-
den, bei der Ausführung der Skripte eine entsprechend neue Version von Python
zu verwenden.

## Installation Node.js und Server-packages

- installiere Node.js (Download: https://nodejs.org/)
- öffne in /IronArm ein Terminal bzw. eine Eingabeaufforderung
- navigiere in ./server
- führe folgendes Kommando aus, um die nötigen Packages für den lokalen
  server zu installieren:

      npm run install

## Schreiben und Ausführen von Instruktionen

Bei Nutzung des lokalen Servers ist wichtig, dass der Server bereits läuft, wenn
der Web-Client gestartet bzw. die Webapplikation geöffnet wird, damit der Roboterarm über den Python-Client angesprochen werden kann. Es reicht dabei,
das Browserfenster nach Starten des Servers zu aktualisieren. Um den Server zu
starten, führe folgende Schritte aus:

- öffne in /IronArm ein Terminal bzw. eine Eingabeaufforderung
- navigiere in ./server
- starte den Server mit folgendem Kommando:

      npm run start

- halte das Terminalfenster geöffnet. Ein Schließen würde den Server stop
  pen.
- Öffne nun die Webapplikation unter ./webclient/dist/index.html oder aktualisiere den Browsertab, falls sie bereits geöffnet ist.
- Um sicherzugehen, dass die Verbindung aufgebaut ist, kann man prüfen, ob
  in der Browserkonsole der Logeintrag "We are connected!"
  zu sehen ist oder in der Serverkonsole der folgende Logeintrag steht:

        Info: New client connected!
        Message recieved:
        {
          ”function”: ”robotIdent”,
          ”message” : ”robot connected”,
          ”arguments” : ””
        }
        Info: New client set as robotClient

In .python-client/README.md sind die in pythonClient.py bereitgestellten Funktionen dokumentiert.

In der Funktion robotInstructions(self) in ./python-client/instructions.py
stehen Beispielinstruktionen, die zeigen, wie der Roboter gesteuert werden kann.

Die Beispielinstruktionen können gelöscht und durch eigene ersetzt werden.
Um die Instruktionen auszuführen, gehe wie folgt vor:

- öffne in /IronArm ein Terminal bzw. eine Eingabeaufforderung
- navigiere in ./python-client
- zum Ausführen der Instruktionen führe folgendes Kommando aus:

      python3.7 pythonClient.py

- wenn (statt 3.7) eine höhere Version von Python installiert ist, modifiziere
  den Befehl entsprechend der installierten / genutzten Python-Version. Bei
  Python 3.9 also

      python3.9 pythonClient.py

  In der Webapplikation kann nun beobachtet werden, wie die Instruktionen
  vom Roboterarm ausgeführt werden. Weiterhin wird die Kommunikation sowohl
  im Terminal des Servers als auch des Python-Clients geloggt.

# Dokumentation der Python API

### type Vector3

Vector3 is used as type for coordinates of objects.

    Vector3 = NewType
    (’Vector3’, {’x’: float, ’y’: float, ’z’: float} )

### async def getAllObjectPositions()

Gets positions of all known objects by returning a list of coordinates.

    async def getAllObjectPositions()
    (self) −> List[Vector3]

### async def getGripperPosition

Returns coordinates of the center of the gripper. Center is the point in the center
of the closed gripper.

    async def getGripperPosition
    (self) −> Vector3

### async def isHoldingObject

Returns a boolean if the gripper is currently holding an object.

    async defisHoldingObject
    (self) −> bool

### async def rotateGripper

Rotate robot grippers clamps in 0.25 degree sized steps till given destinationVa-
lue is reached. 0 is completely open, 45 is completely closed. E.g.: rotateGrip-
per(45)

    async defrotateGripper
    ( self , destinationValue : float ) −> NoReturn

### async def rotateSegment

Rotate one specific segment in 0.25 degree sized steps till given destinationValue
is reached. 0 is central position. DestinationValue can be positive or negative.
segmentId has to be an int and destinationValue has to be a float. segmentIds
ranged from 0 to 5. E.g.: rotateSegment(3, 120))

    async defrotateSegment
    ( self, segmentId : int, destinationValue: float ) −> NoReturn

### async def rotateSegments

Rotate all segments in 0.25 degree sized steps till given destinationValue is
reached. 0 is central position. destinationValue can be positive or negative. des-
tinationValues have to be an array of the destinated degrees of every segment.
E.g rotateSegments([30, 20, -10, 40, 30, 120])).

    async defrotateSegments
    ( self, destinationValues: List[float] ) −> NoReturn
