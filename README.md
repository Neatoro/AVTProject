# Step Sequencer
## 1. Installation & Ausführung
Zur Installation des Programmes muss das Repository von GitHub gecloned werden. Des Weiteren muss einen NodeJS Version auf dem Rechner installiert sein. Mit Projekt-Root-Verzeichnis muss dann der Befehl „npm install“ ausgeführt werden. Danach kann das Programm mit „npm start“ gestartet werden. Im Terminal wird dann eine URL angezeigt, über die Lokal oder im Netzwerk die Applikation erreichbar ist.

Zur Installation des Programmes muss das Repository von GitHub gecloned werden. Des Weiteren muss einen NodeJS Version auf dem Rechner installiert sein. Im Projekt-Root-Verzeichnis muss dann der Befehl „npm install“ ausgeführt werden. Danach kann das Programm mit „npm start“ gestartet werden. Im Terminal wird dann eine URL angezeigt, über die Lokal oder im Netzwerk die Applikation erreichbar ist.
## 2. Anleitung & MIDI-Belegung
### 2.1 Grundprinzip
Zunächst müssen ein oder mehrere Samples über den `Load Sample` Button geladen werden. Nun können die Samples für verschiedene Tracks ausgewählt werden. Durch Klicken auf einen Step wird dieser aktiviert. Drückt man nun auf `Play` so werden die Samples der Tracks an den Stellen, wo aktivierte Steps sind, abgespielt. Desweiteren kann der Nutzer nun globale Veränderungen mit dem Master-Controller oder spezifische Änderungen an einem Track mit dem Track-Controller vornehmen. 
### 2.2 Master  
|Element         |Funktion                       |MIDI                         |
|----------------|-------------------------------|-----------------------------|
|Play |Startet das Abspielen der Tracks | `Restart` |
|Volume |Verändert die Master Volume |`Volume` + `Master-Knob` |
|BPM |Verändert das Tempo |`Tempo` + `Master-Knob` |
|Lowpass |Verändert die Frequenz des Master Lowpass-Filters |`<-` + `Master-Knob` |
|Highpass |Verändert die Frequenz des Master Highpass-Filters |`->` + `Master-Knob` |
|Load Sample |Erlaubt das Laden eines oder mehrerer Samples |kein Mapping |
|Presets |Erlaubt die Auswahl eines Presets |kein Mapping |


### 2.3 Track Effects 
|Element         |Funktion         |MIDI-Belegung für selektierten Track    |
|----------------|-------------------------------|-----------------------------|
|Volume |Verändert die Volume des selektierten Tracks |`Master-Knob` |
|Lowpass |Verändert die Frequenz des Lowpass-Filters des selektierten Tracks |`First Knob` |
|Highpass |Verändert die Frequenz des Highpass-Filters des selektierten Tracks |`Second Knob`|
|Delay |Verändert die Delay-Zeit des selektierten Tracks |`Third Knob`|
|Panning |Verändert die Richtung aus der der Sound des selektierten Tracks kommt |`Fourth Knob`|
|lBand |Verändert die dB des unteren EQ-Bands des selektierten Tracks |`Fifth Knob`|
|mBand |Verändert die dB des mittleren EQ-Bands des selektierten Tracks |`Sixth Knob`|
|hBand |Verändert die dB des oberen EQ-Bands des selektierten Tracks |`Seventh Knob`|

### 2.4 Track Settings
|Element         |Funktion         |MIDI    |
|----------------|-------------------------------|-----------------------------|
|Select |Verändert die Volume des selektierten Tracks |`A` bis `H` |
|Sample-Auswahl |Wählt das Sample für diesen Track aus |kein Mapping |
|Mute |Muted den Track |`Mute`|
|Solo |Lässt den Track alleine abspielen |`Solo`|
|Steps |Aktivierte Steps werden an der Stelle im Takt abgespielt |`Pads`|

## 3. Visualisierung
Jeder Cube im Canvas visualisiert einen Track. Alle Cubes gemeinsam visualisieren den gesamten Sound. 
Jeder einzelne Cube verändert seine Form entsprechend des Samples, welches bei diesem Track gespielt wird. Die Form der linken, unteren und rechten Fläche spiegeln den Klang ähnlich zu einem Spektogramm wieder. 
Alle Cubes verändern ihre Größe entsprechend des gesamten hörbaren Frequenzbereiches. Sind viele Tiefen zu hören, so werden die linken Cubes besonders groß. Ebenso mit den Höhen die rechten Cubes.
