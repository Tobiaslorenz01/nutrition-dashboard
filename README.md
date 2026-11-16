# Nutrition Dashboard — Setup & Deployment Guide

Ein leichtgewichtiges, statisches Ernährungs- und Performance-Dashboard, das deine
Daten aus einem veröffentlichten Google Sheet liest und als iPhone-taugliche
Web-App darstellt. Kein Backend, kein Server, keine laufenden Kosten.

---

## 1. Projekt-Übersicht

Das System verbindet drei Welten: KI-gestützte Nährwertschätzung (Gemini),
eine Tabelle als Datenbank (Google Sheets) und ein statisches Dashboard, das
du auf dem iPhone wie eine App nutzen kannst.

### Was das System kann

- Mahlzeiten per Foto über Gemini schätzen lassen (kcal, Protein, Carbs, Fett)
  und als Zeile ins Google Sheet eintragen.
- Gewichtsverlauf, Kalorienbilanz und Makro-Zielerreichung visualisieren.
- Apple-Health-Daten (Schritte, aktive kcal, Workouts) manuell oder per
  iOS-Shortcut einpflegen.
- Tägliche Netto-Bilanz und Fortschritt gegenüber Zielwerten anzeigen.

### Komponenten

| Komponente                   | Rolle                                                        |
|------------------------------|-------------------------------------------------------------|
| Gemini (Gem / Systemprompt)  | Schätzt Nährwerte aus Fotos, liefert eine TRACKING-Zeile    |
| Google Sheets                | Datenspeicher mit vier Tabs, Formeln für Tageszusammenfassung |
| Veröffentlichte CSV          | Vier öffentliche CSV-Exporte der vier Tabs                  |
| `index.html` (Dashboard)     | Statisches Frontend, liest die CSVs und rendert Charts      |
| Apple Health / iOS-Shortcut  | Liefert Schritte, aktive kcal und Workout-Daten             |

### Datenfluss

```
   ┌──────────┐   Foto + Prompt   ┌───────────────┐
   │  Gemini  │ ────────────────▶ │ TRACKING-Zeile │
   └──────────┘                   └───────┬────────┘
                                          │ manuell einfügen
                                          ▼
   ┌──────────────┐   Health (Shortcut)   ┌───────────────┐
   │ Apple Health │ ────────────────────▶ │ Google Sheets │
   └──────────────┘                       │  (4 Tabs)     │
                                          └───────┬────────┘
                                                  │ Datei ▸ Veröffentlichen (CSV)
                                                  ▼
                                          ┌───────────────┐
                                          │ 4× CSV-URL    │
                                          └───────┬────────┘
                                                  │ fetch (CORS ok)
                                                  ▼
                                          ┌───────────────┐
                                          │  Dashboard    │
                                          │  index.html   │
                                          └───────────────┘
```

### Projektstruktur

```
nutrition-dashboard/
├── README.md                    # Diese Anleitung
├── index.html                   # Das Dashboard (CONFIG-Objekt + Charts)
├── manifest.json                # PWA-Manifest (Home-Screen-App)
├── icon.svg                     # App-Icon
├── google-sheets-template.csv   # Vorlage zum Import in Google Sheets
├── sheets-setup.md              # Tab-Aufbau + alle Formeln
├── gemini-prompt.md             # Systemprompt / Gem für Gemini
├── ios-shortcut-anleitung.md    # Apple-Health → Sheet per Shortcut
└── assets/
    └── screenshot-placeholder.md
```

### Datenschema (kanonisch — identisch in allen Dateien)

Tab **Mahlzeiten**

| Datum | Uhrzeit | Mahlzeit | Beschreibung | kcal | Protein (g) | Carbs (g) | Fett (g) |
|-------|---------|----------|--------------|------|-------------|-----------|----------|

- `Mahlzeit` = Dropdown: Fruehstueck, Mittagessen, Abendessen, Snack
- `Datum` im ISO-Format `YYYY-MM-DD`, `Uhrzeit` als `HH:MM`

Tab **Health**

| Datum | Schritte | Aktive kcal | Workout-Typ | Workout-Dauer (min) | Workout-kcal |
|-------|----------|-------------|-------------|---------------------|--------------|

- `Workout-Typ` = Dropdown: Krafttraining, Laufen, Radfahren, Schwimmen, Gehen, Sonstige, –

Tab **Gewicht**

| Datum | Gewicht (kg) | Notiz |
|-------|--------------|-------|

Tab **Tageszusammenfassung** (formel-basiert)

| Datum | kcal gegessen | kcal aktiv | Netto-Bilanz | Protein ges. | Carbs ges. | Fett ges. | Protein-Ziel % | Carbs-Ziel % | Fett-Ziel % |
|-------|---------------|------------|--------------|--------------|------------|-----------|----------------|--------------|-------------|

- `Netto-Bilanz = kcal gegessen - kcal aktiv`

### Zielwerte

| Ziel            | Wert   |
|-----------------|--------|
| Zielgewicht     | 76 kg  |
| Aktuelles Gewicht | ~78 kg |
| Kalorien/Tag    | 1700 kcal |
| Protein/Tag     | 140 g  |
| Carbs/Tag       | 75 g   |
| Fett/Tag        | 65 g   |

---

## 2. Google Sheets Setup

1. **Neues Sheet anlegen** auf [sheets.google.com](https://sheets.google.com).
2. **CSV importieren:** `Datei ▸ Importieren ▸ Hochladen` und
   `google-sheets-template.csv` wählen. Beim Importdialog *„Daten am aktuellen
   Ort einfügen“* oder *„Neue Tabelle ersetzen“* auswählen.
3. **Vier Tabs anlegen** (unten über das `+` bzw. Umbenennen per Doppelklick) —
   die Namen müssen exakt stimmen, da das Dashboard und die Formeln sie referenzieren:
   - `Mahlzeiten`
   - `Health`
   - `Gewicht`
   - `Tageszusammenfassung`
4. **Spalten & Dropdowns** pro Tab exakt nach dem Datenschema oben anlegen.
   Die Formeln für den Tab `Tageszusammenfassung` findest du vollständig in
   **`sheets-setup.md`** — dort stehen auch die Dropdown-Definitionen
   (Datenüberprüfung) für `Mahlzeit` und `Workout-Typ`.
5. **Veröffentlichen:** `Datei ▸ Freigeben ▸ Im Web veröffentlichen`.
   Für **jeden der vier Tabs** separat auswählen und als **CSV** veröffentlichen.
6. **Die vier CSV-URLs kopieren** — je eine pro Tab. Sie sehen etwa so aus:

   ```
   https://docs.google.com/spreadsheets/d/e/<ID>/pub?gid=<GID>&single=true&output=csv
   ```

> Tipp: Jeder Tab hat eine eigene `gid`. Achte darauf, für jeden der vier
> Tabs die korrekte, als CSV veröffentlichte URL zu kopieren.

Die konkreten Formeln (SUMMEWENN / SUMIFS über `Datum`) sind bewusst in
**`sheets-setup.md`** ausgelagert, damit dieses README übersichtlich bleibt.

---

## 3. Dashboard konfigurieren

Öffne `index.html` in einem Editor und trage die vier CSV-URLs in das
`CONFIG`-Objekt ein. Passe bei Bedarf die Zielwerte an:

```js
const CONFIG = {
  SHEETS_URL_MEALS:   "https://docs.google.com/.../pub?gid=...&output=csv", // Tab Mahlzeiten
  SHEETS_URL_HEALTH:  "https://docs.google.com/.../pub?gid=...&output=csv", // Tab Health
  SHEETS_URL_WEIGHT:  "https://docs.google.com/.../pub?gid=...&output=csv", // Tab Gewicht
  SHEETS_URL_SUMMARY: "https://docs.google.com/.../pub?gid=...&output=csv", // Tab Tageszusammenfassung
  TARGET_WEIGHT:  76,    // kg
  TARGET_KCAL:    1700,  // kcal/Tag
  TARGET_PROTEIN: 140,   // g/Tag
  TARGET_CARBS:   75,    // g/Tag
  TARGET_FAT:     65,    // g/Tag
  REFRESH_INTERVAL: 300, // Sekunden
};
```

Nach dem Speichern kannst du `index.html` lokal im Browser öffnen, um den
Datenabruf zu testen, bevor du hostest.

---

## 4. Hosting auf GitHub Pages

Schritt für Schritt:

1. **Repo anlegen:** Auf [github.com](https://github.com) ein neues Repository
   erstellen, z. B. `nutrition-dashboard` (public ist am einfachsten).
2. **Dateien pushen:**

   ```bash
   cd /Users/D057210/nutrition-dashboard
   git init
   git add .
   git commit -m "Initial nutrition dashboard"
   git branch -M main
   git remote add origin https://github.com/<user>/nutrition-dashboard.git
   git push -u origin main
   ```

3. **Pages aktivieren:** Im Repo `Settings ▸ Pages`:
   - *Source:* `Deploy from a branch`
   - *Branch:* `main` / `/ (root)`
   - Speichern.
4. **URL abrufen:** Nach ein bis zwei Minuten erscheint oben auf der
   Pages-Seite die URL, z. B.
   `https://<user>.github.io/nutrition-dashboard/`.

> **CORS-Hinweis:** Das Dashboard ruft die CSVs direkt per `fetch` aus dem
> Browser ab. Als CSV **veröffentlichte** Google-Sheets-URLs
> (`.../pub?...&output=csv`) senden die passenden CORS-Header und sind daher
> ohne Proxy abrufbar. Wichtig: Es muss die **veröffentlichte** URL sein —
> die normale `.../edit`-Adresse funktioniert nicht.

---

## 5. Auf dem iPhone als Home-Screen-App

1. Die GitHub-Pages-URL in **Safari** öffnen (nicht Chrome — nur Safari legt
   auf iOS echte Home-Screen-Apps an).
2. Auf das **Teilen**-Symbol tippen.
3. **„Zum Home-Bildschirm“** wählen, Namen bestätigen.

Dank `manifest.json` und `icon.svg` verhält sich das Dashboard dann wie eine
PWA: eigenes App-Icon, Vollbild ohne Safari-Leiste (`display: standalone`),
Start direkt in der Dashboard-Ansicht.

---

## 6. Gemini-Prompt einrichten

Den vollständigen Prompt aus **`gemini-prompt.md`** in Gemini als **Gem**
(bzw. als Systemanweisung / „Custom Instructions“) hinterlegen. Der Prompt
weist Gemini an, aus einem Mahlzeiten-Foto eine fertige **TRACKING-Zeile** im
kanonischen Format auszugeben:

```
Datum | Uhrzeit | Mahlzeit | Beschreibung | kcal | Protein (g) | Carbs (g) | Fett (g)
```

Diese Zeile kopierst du direkt in den Tab `Mahlzeiten`.

---

## 7. iOS-Shortcut einrichten

Für Apple-Health-Daten (Schritte, aktive kcal) gibt es einen iOS-Kurzbefehl,
der die heutigen Werte abliest und als Mitteilung/in die Zwischenablage legt —
du überträgst sie dann in den Tab `Health`. Schritt für Schritt:
siehe **`ios-shortcut-anleitung.md`**.

> Hinweis: Der Shortcut **liest** die Werte nur und zeigt sie an (Format
> `Schritte: 8.432 | Aktive kcal: 287`). Das Eintragen ins Sheet erfolgt manuell
> (abtippen oder aus der Zwischenablage einfügen).

---

## 8. Täglicher Workflow (Kurzanleitung)

| Zeitpunkt   | Aktion                                                                 |
|-------------|------------------------------------------------------------------------|
| Morgens     | Wiegen → Zeile im Tab `Gewicht` eintragen (`Datum`, `Gewicht (kg)`).   |
| Zu Mahlzeiten | Foto in Gemini → gelieferte TRACKING-Zeile in den Tab `Mahlzeiten`.  |
| Nach Sport  | iOS-Shortcut ausführen → abgelesene Schritte/aktive kcal in den Tab `Health` eintragen. |
| Abends      | In Gemini „Tagesbilanz“ abfragen (Zusammenfassung des Tages).          |
| Jederzeit   | Dashboard auf dem iPhone öffnen und Fortschritt checken.               |

So bleibt der Aufwand klein: Das Sheet ist die Wahrheit, Gemini der Schätzer,
das Dashboard die Ansicht.
