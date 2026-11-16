# Nutrition Dashboard – Google Sheets Setup

Diese Anleitung erklaert, wie du aus der Datei `google-sheets-template.csv` ein
vollstaendiges Google-Sheets-Dashboard mit vier Tabs aufbaust, Dropdowns und
Formeln einrichtest und die vier CSV-URLs fuer die App veroeffentlichst.

---

## 0. Zielwerte (CONFIG)

| Wert            | Ziel     |
|-----------------|----------|
| TARGET_WEIGHT   | 76 kg    |
| TARGET_KCAL     | 1700     |
| TARGET_PROTEIN  | 140 g    |
| TARGET_CARBS    | 75 g     |
| TARGET_FAT      | 65 g     |

Aktuelles Gewicht ca. 78 kg. **Netto-Bilanz = kcal gegessen − aktive kcal.**

> Tipp: Du kannst diese Zielwerte auch in einen eigenen kleinen Tab "Config"
> schreiben und in den Formeln statt der fest verdrahteten Zahlen (140, 75, 65)
> auf die Zellen verweisen. Unten sind die Zielwerte der Einfachheit halber
> direkt in die Formeln geschrieben.

---

## 1. CSV importieren

1. Neues Google Sheet anlegen (sheets.new).
2. **Datei → Importieren → Hochladen** und `google-sheets-template.csv` waehlen.
3. Importort: **Daten in aktuelles Blatt einfuegen** (oder neues Blatt).
   Trennzeichen: **Komma** (Automatisch erkennen funktioniert auch).

Nach dem Import steht alles in **einem** Blatt, weil Google Sheets beim
CSV-Import immer nur ein Tabellenblatt erzeugt. Die drei Datenbereiche sind
durch Kommentarzeilen `### TAB: ... ###` getrennt. Diese Zeilen loeschen wir
gleich wieder.

---

## 2. Die vier echten Tabs anlegen

Lege unten ueber das **+** vier Tabs (Blaetter) an und benenne sie **exakt** so
(gross/klein beachten – die App und die Formeln referenzieren diese Namen):

- `Mahlzeiten`
- `Health`
- `Gewicht`
- `Tageszusammenfassung`

Dann verteile die importierten Daten:

1. **Mahlzeiten**: Kopiere die Header-Zeile `Datum,Uhrzeit,...` plus die
   Mahlzeiten-Datenzeilen in den Tab `Mahlzeiten` ab Zelle **A1**.
2. **Health**: Kopiere die Health-Header-Zeile plus Datenzeilen nach `Health!A1`.
3. **Gewicht**: Kopiere die Gewicht-Header-Zeile plus Datenzeilen nach `Gewicht!A1`.
4. Loesche danach das urspruengliche Import-Blatt und alle `###`- und `#`-Zeilen.

Die Header-Zeile ist in jedem Tab **Zeile 1**, die erste Datenzeile ist **Zeile 2**.

### Kanonisches Spaltenschema (Buchstaben = Spalten)

**Tab `Mahlzeiten`**

| Spalte | A     | B       | C        | D            | E    | F           | G         | H        |
|--------|-------|---------|----------|--------------|------|-------------|-----------|----------|
| Feld   | Datum | Uhrzeit | Mahlzeit | Beschreibung | kcal | Protein (g) | Carbs (g) | Fett (g) |

- Datum-Format `YYYY-MM-DD` (ISO), Uhrzeit `HH:MM`.
- `Mahlzeit` (Spalte C) = Dropdown: Fruehstueck, Mittagessen, Abendessen, Snack.

**Tab `Health`**

| Spalte | A     | B        | C           | D           | E                    | F           |
|--------|-------|----------|-------------|-------------|----------------------|-------------|
| Feld   | Datum | Schritte | Aktive kcal | Workout-Typ | Workout-Dauer (min)  | Workout-kcal|

- `Workout-Typ` (Spalte D) = Dropdown: Krafttraining, Laufen, Radfahren,
  Schwimmen, Gehen, Sonstige, –

**Tab `Gewicht`**

| Spalte | A     | B            | C     |
|--------|-------|--------------|-------|
| Feld   | Datum | Gewicht (kg) | Notiz |

**Tab `Tageszusammenfassung`** (rein formel-basiert)

| Spalte | A     | B            | C         | D            | E            | F         | G         | H             | I           | J          |
|--------|-------|--------------|-----------|--------------|--------------|-----------|-----------|---------------|-------------|------------|
| Feld   | Datum | kcal gegessen| kcal aktiv| Netto-Bilanz | Protein ges. | Carbs ges.| Fett ges. | Protein-Ziel %| Carbs-Ziel %| Fett-Ziel %|

---

## 3. Dropdown-Datenvalidierung

### 3a. Mahlzeit (Tab `Mahlzeiten`, Spalte C)

1. Markiere `Mahlzeiten!C2:C1000`.
2. **Daten → Datenvalidierung → Regel hinzufuegen**.
3. Kriterien: **Dropdown** → Eintraege:
   `Fruehstueck`, `Mittagessen`, `Abendessen`, `Snack`.
4. "Eingabe ablehnen" aktivieren, Speichern.

### 3b. Workout-Typ (Tab `Health`, Spalte D)

1. Markiere `Health!D2:D1000`.
2. **Daten → Datenvalidierung → Regel hinzufuegen**.
3. Kriterien: **Dropdown** → Eintraege:
   `Krafttraining`, `Laufen`, `Radfahren`, `Schwimmen`, `Gehen`, `Sonstige`, `–`.
4. Speichern.

---

## 4. Formeln im Tab `Tageszusammenfassung`

In **A2, A3, …** stehen die Datumswerte, fuer die du eine Zusammenfassung willst
(z. B. je ein Datum pro Zeile, Format `YYYY-MM-DD`). Trage die Datumswerte ein
und fuege die folgenden Formeln in **Zeile 2** ein; danach nach unten ziehen.

> **Trennzeichen-Hinweis:** Google Sheets nutzt je nach Spracheinstellung
> unterschiedliche Argument-Trennzeichen. Bei **deutscher** Oberflaeche ist es das
> **Semikolon `;`**, bei **englischer** das **Komma `,`**. Unten stehen beide
> Varianten. Funktionsnamen werden ebenfalls uebersetzt – daher immer deutsche
> **und** englische Namen angegeben. Blattbezuege (`Mahlzeiten!A:A`) sind in
> beiden Sprachen identisch.

### 4a. B2 – kcal gegessen (Summe kcal aus Mahlzeiten je Datum)

Deutsch (SUMMEWENN):
```
=SUMMEWENN(Mahlzeiten!A:A; A2; Mahlzeiten!E:E)
```
Englisch (SUMIF):
```
=SUMIF(Mahlzeiten!A:A, A2, Mahlzeiten!E:E)
```
Bedeutung: In `Mahlzeiten` Spalte A (Datum) nach dem Wert aus `A2` suchen und die
zugehoerigen Werte aus Spalte E (kcal) summieren.

### 4b. C2 – kcal aktiv (aktive kcal aus Health je Datum)

Deutsch:
```
=SUMMEWENN(Health!A:A; A2; Health!C:C)
```
Englisch:
```
=SUMIF(Health!A:A, A2, Health!C:C)
```
Bedeutung: Summe der aktiven kcal (Health Spalte C) fuer das Datum aus `A2`.

### 4c. D2 – Netto-Bilanz (kcal gegessen − aktive kcal)

```
=B2-C2
```

### 4d. E2 / F2 / G2 – Protein / Carbs / Fett gesamt je Datum

Deutsch:
```
E2:  =SUMMEWENN(Mahlzeiten!A:A; A2; Mahlzeiten!F:F)
F2:  =SUMMEWENN(Mahlzeiten!A:A; A2; Mahlzeiten!G:G)
G2:  =SUMMEWENN(Mahlzeiten!A:A; A2; Mahlzeiten!H:H)
```
Englisch:
```
E2:  =SUMIF(Mahlzeiten!A:A, A2, Mahlzeiten!F:F)
F2:  =SUMIF(Mahlzeiten!A:A, A2, Mahlzeiten!G:G)
G2:  =SUMIF(Mahlzeiten!A:A, A2, Mahlzeiten!H:H)
```
Spaltenzuordnung Mahlzeiten: F = Protein (g), G = Carbs (g), H = Fett (g).

> **Alternative mit SUMMEWENNS / SUMIFS** (Summenbereich zuerst) – identisches
> Ergebnis, praktisch wenn spaeter mehrere Bedingungen dazukommen:
> ```
> =SUMMEWENNS(Mahlzeiten!E:E; Mahlzeiten!A:A; A2)      (deutsch)
> =SUMIFS(Mahlzeiten!E:E, Mahlzeiten!A:A, A2)          (englisch)
> ```

### 4e. H2 / I2 / J2 – Zielerreichung in Prozent je Makro

Prozent = erreichter Wert / Zielwert. Ziele: Protein 140 g, Carbs 75 g, Fett 65 g.

Deutsch (Ergebnis als Zahl, z. B. 104 = 104 %):
```
H2:  =E2/140*100
I2:  =F2/75*100
J2:  =G2/65*100
```
Englisch: identisch (keine Funktionsnamen, nur Rechenoperatoren):
```
H2:  =E2/140*100
I2:  =F2/75*100
J2:  =G2/65*100
```
> Alternativ ohne `*100` schreiben (`=E2/140`) und die Zellen H2:J2 ueber
> **Format → Zahl → Prozent** als Prozent formatieren. Nicht beides kombinieren,
> sonst steht da 10400 %.

### 4f. Gleitender 7-Tage-Gewichtsdurchschnitt (Tab `Gewicht`)

Fuege im Tab `Gewicht` eine neue Spalte **D** mit Ueberschrift `7-Tage-Schnitt`
hinzu. In **D2** (Gewichtswerte stehen in Spalte B, ab Zeile 2):

Deutsch (MITTELWERT + INDIREKT + MAX + ZEILE):
```
=MITTELWERT(INDIREKT("B"&MAX(2;ZEILE()-6)&":B"&ZEILE()))
```
Englisch (AVERAGE + INDIRECT + MAX + ROW):
```
=AVERAGE(INDIRECT("B"&MAX(2,ROW()-6)&":B"&ROW()))
```
Bedeutung: Mittelwert der Gewichtswerte (Spalte B) von der aktuellen Zeile und
den **bis zu 6 Zeilen darueber** = max. 7 Zeilen. `ZEILE()` liefert die aktuelle
Zeilennummer; `MAX(2; ZEILE()-6)` verhindert, dass vor Zeile 2 gelesen wird, damit
in den ersten 6 Datenzeilen ueber die bis dahin vorhandenen Werte gemittelt wird.
Formel in D2 eintragen und nach unten ziehen.

---

## 5. Jeden Tab einzeln als CSV im Web veroeffentlichen

Die App liest vier getrennte CSV-URLs. Veroeffentliche jeden Tab einzeln:

1. **Datei → Freigeben → Im Web veroeffentlichen**.
2. Im Dialog unter **"Link"**:
   - Statt "Gesamtes Dokument" das **jeweilige Blatt** auswaehlen
     (z. B. `Mahlzeiten`).
   - Als Format **Kommagetrennte Werte (.csv)** waehlen.
3. **Veroeffentlichen** klicken, Link kopieren.
4. Fuer alle vier Tabs wiederholen: `Mahlzeiten`, `Health`, `Gewicht`,
   `Tageszusammenfassung`.

Ordne die vier kopierten URLs den Config-Variablen der App zu:

| Tab                   | Variable           |
|-----------------------|--------------------|
| Mahlzeiten            | `SHEETS_URL_MEALS` |
| Health                | `SHEETS_URL_HEALTH`|
| Gewicht               | `SHEETS_URL_WEIGHT`|
| Tageszusammenfassung  | `SHEETS_URL_SUMMARY`|

> Hinweis: Veroeffentlichte CSV-Links aktualisieren sich automatisch, koennen
> aber einige Minuten Cache-Verzoegerung haben. Die URL endet typischerweise auf
> `...&output=csv` bzw. `...pub?gid=<ID>&single=true&output=csv`.

---

## 6. Schnelltest

- Trage in `Tageszusammenfassung!A2` ein vorhandenes Datum ein, z. B. `2026-11-06`.
- Erwartung mit den Beispieldaten: B2 (kcal gegessen) = 1700, C2 (kcal aktiv) = 520,
  D2 (Netto) = 1180, E2 (Protein) = 146, F2 (Carbs) = 80, G2 (Fett) = 65,
  H2 ≈ 104 %, I2 ≈ 107 %, J2 = 100 %.
