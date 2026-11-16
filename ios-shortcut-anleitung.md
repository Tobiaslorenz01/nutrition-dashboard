# iOS-Kurzbefehl: Heutige Schritte & aktive Kalorien aus Apple Health

Diese Anleitung beschreibt Schritt fuer Schritt, wie du in der Apple **Kurzbefehle**-App (engl. *Shortcuts*) einen Kurzbefehl baust, der die heutigen Schritte und die heutigen aktiven Kalorien aus Apple Health liest, sie formatiert und das Ergebnis als Mitteilung sowie in die Zwischenablage ausgibt.

**Ziel-Ausgabeformat (exakt):**

```
Schritte: 8.432 | Aktive kcal: 287
```

---

## Voraussetzungen

- iPhone mit iOS 15 oder neuer (die App **Kurzbefehle** ist vorinstalliert).
- Apple Health (App **Gesundheit**) enthaelt Schritt- und Kaloriendaten. Diese kommen automatisch vom iPhone (Bewegungssensor) bzw. von einer Apple Watch oder kompatiblen App.
- Beim ersten Ausfuehren musst du dem Kurzbefehl den Zugriff auf Gesundheitsdaten erlauben (HealthKit-Berechtigung, siehe unten).

---

## Uebersicht der Blockreihenfolge

Der fertige Kurzbefehl besteht aus **7 Bloecken** in dieser Reihenfolge:

1. **Gesundheitsdaten abrufen** – Schritte (Summe, heute)
2. **Zahl formatieren** – Schritte mit Tausenderpunkt
3. **Gesundheitsdaten abrufen** – Aktive Energie (Summe, heute)
4. **Zahl formatieren** – Kalorien ohne Nachkommastellen (optional)
5. **Text** – Werte zu einem String zusammensetzen
6. **In die Zwischenablage kopieren**
7. **Mitteilung anzeigen**

Die Variablen werden verkettet, indem das Ergebnis jedes Blocks automatisch als "Ergebnis des vorherigen Blocks" bereitsteht. Damit es keine Verwechslung gibt, benennen wir die wichtigen Ergebnisse ueber **Variable festlegen** bzw. nutzen die blauen Magic-Variablen direkt im Text-Block.

---

## Neuen Kurzbefehl anlegen

1. Oeffne die App **Kurzbefehle**.
2. Tippe oben rechts auf das **+** (Plus) um einen neuen Kurzbefehl zu erstellen.
3. Tippe oben auf den Namen (standardmaessig "Neuer Kurzbefehl") und benenne ihn z. B. **"Health heute"**.

**Screenshot-Beschreibung:** Du siehst eine leere Bearbeitungsflaeche. In der Mitte steht "Aktion hinzufuegen", unten ist eine Suchleiste bzw. ein Aktionen-Katalog. Alle Bloecke fuegst du nacheinander untereinander ein.

---

## Block 1 – Schritte abrufen

**Aktion:** "Gesundheitsdaten abrufen" (engl. *Find Health Samples*)
**Kategorie:** Gesundheit (Health)

1. Tippe auf **Aktion hinzufuegen** (bzw. das **+** unter dem letzten Block).
2. Suche nach **"Gesundheitsdaten abrufen"** und tippe darauf.
3. Stelle die Parameter ein:
   - **Art / Typ:** `Schritte` (engl. *Steps*)
   - **Sortieren nach / Statistik:** auf **Summe** stellen. Dazu tippst du im Block auf das kleine Chevron/den Text, um weitere Optionen aufzuklappen. Waehle bei der Zusammenfassung **Summe** (nicht Durchschnitt/Minimum/Maximum).
   - **Zeitraum / Datum:** **Heute** (engl. *Today*). Falls als Filter angeboten: Start = Beginn des heutigen Tages, Ende = jetzt.
   - **Gruppieren nach:** **Nein / keine Gruppierung** (engl. *Group by: None*), damit nur ein einzelner Summenwert herauskommt.
   - **Limit:** falls vorhanden, kein Limit noetig, da wir die Summe bilden.

**Ergebnis:** Dieser Block liefert eine einzelne Zahl, naemlich die Gesamtschritte von heute (z. B. `8432`).

**Screenshot-Beschreibung:** Ein hellroter/gesundheitsfarbener Block mit der Ueberschrift "Gesundheitsdaten abrufen". Darin stehen aufklappbare Zeilen fuer Art ("Schritte"), eine Statistik-Auswahl ("Summe") und ein Datumsfilter ("Heute"). Der Block sitzt ganz oben.

---

## Block 2 – Schritte mit Tausenderpunkt formatieren

**Aktion:** "Zahl formatieren" (engl. *Format Number*)
**Kategorie:** Skripting / Mathematik (Scripting)

1. Tippe auf **+** / Aktion hinzufuegen und suche **"Zahl formatieren"**.
2. Im Block steht standardmaessig "Zahl formatieren [Zahl]". Tippe auf das Feld **[Zahl]** und waehle als Eingabe die blaue Variable **"Gesundheitsdaten abrufen"** (das Ergebnis von Block 1).
3. Parameter einstellen:
   - **Dezimalstellen:** `0` (keine Nachkommastellen bei Schritten).
   - **Tausendertrennzeichen / Gruppierung:** aktivieren. In der deutschen iOS-Lokalisierung wird dann automatisch der **Punkt** als Tausendertrennzeichen verwendet, also `8.432`.

   Hinweis zum Format: Die Aktion "Zahl formatieren" richtet sich nach den **Regionseinstellungen** des iPhones. Steht die Region auf **Deutschland**, erscheint der Tausenderpunkt automatisch (`8.432`). Falls dein iPhone auf eine englische Region eingestellt ist, kaeme ein Komma (`8,432`) heraus – dann ggf. die Region in den iOS-Einstellungen anpassen oder in Block 5 ersetzen (siehe Troubleshooting).
4. Optional sauber: Fuege danach **"Variable festlegen"** ein und nenne sie **SchritteText**, damit der Wert eindeutig weiterverwendbar ist.

**Ergebnis:** Text `8.432`.

**Screenshot-Beschreibung:** Ein violetter/grauer Skripting-Block "Zahl formatieren". In der Zeile ist die blaue Variable des vorherigen Blocks eingesetzt. Darunter die Optionen "Dezimalstellen" und "Tausendertrennzeichen".

---

## Block 3 – Aktive Kalorien abrufen

**Aktion:** "Gesundheitsdaten abrufen" (engl. *Find Health Samples*)
**Kategorie:** Gesundheit (Health)

1. Aktion hinzufuegen, erneut **"Gesundheitsdaten abrufen"** waehlen.
2. Parameter:
   - **Art / Typ:** **Aktive Energie** (engl. *Active Energy*). Achtung: nicht "Ruheenergie"/"Resting Energy" waehlen.
   - **Statistik:** **Summe**.
   - **Zeitraum:** **Heute**.
   - **Gruppieren nach:** **Nein / None**.

**Ergebnis:** Einzelne Zahl der heutigen aktiven Kilokalorien (z. B. `287` – je nach Einheit auch mit Nachkommastellen wie `287,3`).

**Screenshot-Beschreibung:** Wieder ein gesundheitsfarbener Block "Gesundheitsdaten abrufen", diesmal mit Art "Aktive Energie", Statistik "Summe", Datum "Heute". Er sitzt unter dem Schritte-Format-Block.

---

## Block 4 – Kalorien auf ganze Zahl bringen (optional, empfohlen)

**Aktion:** "Zahl formatieren" (engl. *Format Number*)
**Kategorie:** Skripting

1. Aktion **"Zahl formatieren"** hinzufuegen.
2. Als **[Zahl]** die Variable **"Gesundheitsdaten abrufen"** aus Block 3 waehlen (es ist das zuletzt erzeugte Gesundheits-Ergebnis).
3. Parameter:
   - **Dezimalstellen:** `0` (damit `287,3` zu `287` wird).
   - **Tausendertrennzeichen:** bei Kalorien in der Regel nicht noetig; kann aus bleiben.
4. Optional: **"Variable festlegen"** mit Namen **KcalText**.

**Ergebnis:** Text `287`.

**Screenshot-Beschreibung:** Zweiter "Zahl formatieren"-Block, Eingabe = aktive Energie, Dezimalstellen 0.

---

## Block 5 – Text zusammensetzen

**Aktion:** "Text" (engl. *Text*)
**Kategorie:** Dokumente / Skripting

1. Aktion **"Text"** hinzufuegen.
2. Tippe in das Textfeld und tippe exakt folgenden Satz, wobei du an den markierten Stellen die **Variablen** einsetzt (ueber die Variablen-Leiste oberhalb der Tastatur oder durch Tippen und "Variable auswaehlen"):

   ```
   Schritte: [SchritteText] | Aktive kcal: [KcalText]
   ```

   Konkret:
   - Tippe `Schritte: ` (mit Leerzeichen nach dem Doppelpunkt).
   - Fuege die Variable **SchritteText** (bzw. das Ergebnis von Block 2) ein.
   - Tippe ` | Aktive kcal: ` (Leerzeichen, senkrechter Strich, Leerzeichen, Text, Doppelpunkt, Leerzeichen).
   - Fuege die Variable **KcalText** (bzw. das Ergebnis von Block 4) ein.

   Der senkrechte Strich `|` liegt auf der iOS-Tastatur unter der Zahlen-/Symbolebene (Taste `123`, dann ggf. `#+=`).

**Ergebnis:** Ein einzelner Text, z. B. `Schritte: 8.432 | Aktive kcal: 287`.

**Screenshot-Beschreibung:** Ein grau/blauer "Text"-Block mit freiem Textfeld. Darin stehen zwei feste Textteile und dazwischen zwei blaue Variablen-Pillen. Ueber der Tastatur ist eine Leiste mit den verfuegbaren Variablen sichtbar.

---

## Block 6 – In die Zwischenablage kopieren

**Aktion:** "In die Zwischenablage kopieren" (engl. *Copy to Clipboard*)
**Kategorie:** Skripting

1. Aktion **"In die Zwischenablage kopieren"** hinzufuegen.
2. Als Eingabe automatisch das **Ergebnis des Text-Blocks** (Block 5). Falls nicht automatisch gesetzt, tippe auf das Eingabefeld und waehle die Variable "Text".
3. Optional: "Lokal ablaufen lassen" aus lassen, damit der Wert dauerhaft in der Zwischenablage bleibt.

**Ergebnis:** Der formatierte String liegt in der Zwischenablage und kann ueberall eingefuegt werden.

**Screenshot-Beschreibung:** Schmaler Skripting-Block "In die Zwischenablage kopieren" mit der eingesetzten Text-Variable.

---

## Block 7 – Mitteilung anzeigen

**Aktion:** "Mitteilung anzeigen" (engl. *Show Notification*)
**Kategorie:** Skripting / Mitteilungen

1. Aktion **"Mitteilung anzeigen"** hinzufuegen.
2. Als Inhalt die Variable **Text** (Ergebnis von Block 5) einsetzen.
3. Optional einen Titel vergeben, z. B. "Health heute".

**Ergebnis:** Beim Ausfuehren erscheint oben am Bildschirm ein Banner mit `Schritte: 8.432 | Aktive kcal: 287`.

**Screenshot-Beschreibung:** Ein Block "Mitteilung anzeigen" mit einem Textfeld, in dem die Text-Variable steht. Ganz unten endet damit die Blockliste.

---

## Variablen-Verkettung – Kurz erklaert

- Jeder Block liefert ein **Ergebnis**, das der naechste Block automatisch als Eingabe ("vorheriges Ergebnis") sehen kann.
- Damit die beiden Gesundheitswerte nicht verwechselt werden, benennst du sie ueber **"Variable festlegen"** (SchritteText, KcalText). Danach kannst du sie im **Text**-Block (Block 5) gezielt einsetzen.
- Alternativ ohne eigene Variablen: Setze direkt im Text-Block die blauen "Zahl formatieren"-Ergebnisse ein – achte dann nur darauf, das richtige der beiden auszuwaehlen (die Variablenleiste zeigt beide an, ggf. per Reihenfolge erkennbar).

---

## Erster Lauf & HealthKit-Berechtigung

1. Tippe unten bzw. oben auf **Abspielen/Play (Dreieck)**, um den Kurzbefehl zu testen.
2. Beim ersten Mal fragt iOS: *"'Health heute' moechte auf deine Gesundheitsdaten zugreifen"*. Tippe auf **Erlauben** und aktiviere dort **Schritte** und **Aktive Energie** (bzw. "Alle aktivieren").
3. Danach laeuft der Kurzbefehl durch und zeigt die Mitteilung; der Text liegt zugleich in der Zwischenablage.

**Screenshot-Beschreibung:** Ein System-Dialog mit Schaltern fuer einzelne Datentypen (Schritte, Aktive Energie) und einem "Erlauben"-Knopf oben rechts.

---

## Auf den Home-Screen legen

1. Oeffne den Kurzbefehl zur Bearbeitung und tippe oben auf das **Teilen**- bzw. **Details-Symbol** (Info/`(i)` oder das Teilen-Icon).
2. Waehle **"Zum Home-Bildschirm"**.
3. Vergib Name und optional ein Symbol und tippe auf **Hinzufuegen**.
4. Jetzt startest du den Kurzbefehl mit einem Tipp vom Home-Screen.

**Screenshot-Beschreibung:** Ein Teilen-Menue mit Eintrag "Zum Home-Bildschirm", danach eine Vorschau des App-Icons mit editierbarem Namen.

---

## Optional: Taeglicher Automatismus

1. Gehe im unteren Reiter der Kurzbefehle-App auf **Automation** (engl. *Automation*).
2. Tippe auf **+** und waehle **"Persoenliche Automation erstellen"**.
3. Waehle als Ausloeser **"Uhrzeit"**, stelle z. B. **21:00 Uhr**, **Taeglich** ein.
4. Als Aktion **"Kurzbefehl ausfuehren"** waehlen und deinen Kurzbefehl "Health heute" auswaehlen.
5. Optional **"Vor dem Ausfuehren fragen"** deaktivieren, damit er ohne Rueckfrage laeuft (bei neueren iOS-Versionen moeglich).

**Screenshot-Beschreibung:** Automations-Assistent mit Ausloeser-Auswahl (Uhrzeit), Zeitpicker und anschliessender Aktionsauswahl "Kurzbefehl ausfuehren".

---

## Troubleshooting

- **Keine Daten / Wert ist 0 oder leer:**
  - Pruefe in der **Gesundheit**-App, ob fuer heute ueberhaupt Schritte/aktive Energie vorhanden sind (Durchsuchen > Aktivitaet > Schritte bzw. Aktive Energie).
  - Aktive Energie entsteht vor allem durch eine **Apple Watch** oder Trainings-Apps. Ohne Watch kann der Wert niedrig oder 0 sein – das ist normal.
  - Pruefe die **Datenquellen/Reihenfolge** in Gesundheit (Profil > Geraete bzw. bei dem Datentyp "Datenquellen & Zugriff"). Stelle sicher, dass iPhone/Watch als Quelle aktiv sind.
- **Berechtigung fehlt:** Einstellungen > Datenschutz & Sicherheit > Health > Kurzbefehle und dort Lese-Rechte fuer Schritte und Aktive Energie aktivieren.
- **Falsches Zahlenformat (Komma statt Punkt):** Die Aktion "Zahl formatieren" folgt der iOS-Region. Fuer deutschen Tausenderpunkt die Region auf Deutschland stellen (Einstellungen > Allgemein > Sprache & Region) oder im Text-Block das Trennzeichen manuell per Aktion "Text ersetzen" anpassen.
- **Mehrere Werte statt einer Summe:** Stelle sicher, dass bei "Gesundheitsdaten abrufen" **Statistik = Summe** und **Gruppieren = Nein** gesetzt sind. Andernfalls liefert der Block eine Liste statt einer einzelnen Zahl.
- **Falscher Kalorientyp:** "Aktive Energie" statt "Ruheenergie"/"Resting Energy" verwenden.
