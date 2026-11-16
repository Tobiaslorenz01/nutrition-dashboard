/**
 * Nutrition Dashboard – Schreib-Endpunkt (Google Apps Script)
 * Trägt Zeilen in die Tabs "Health", "Gewicht" und "Mahlzeiten" ein.
 *
 * Einrichtung:
 *   1. Im Google Sheet: Erweiterungen ▸ Apps Script.
 *   2. Diesen Code komplett einfügen (vorhandenen Beispielcode ersetzen).
 *   3. TOKEN unten bei Bedarf durch ein eigenes Geheimwort ersetzen
 *      (muss später in den Kurzbefehlen identisch sein).
 *   4. Bereitstellen ▸ Neue Bereitstellung ▸ Typ "Web-App":
 *        - Ausführen als:  Ich
 *        - Zugriff:        Jeder (Anyone)
 *      → Web-App-URL (endet auf /exec) kopieren.
 */

const TOKEN = 'coach-tobi-7h3k';   // frei wählbar, aber in den Kurzbefehlen gleich verwenden

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.token !== TOKEN) {
      return out({ ok: false, error: 'Falsches Token' });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const tz = ss.getSpreadsheetTimeZone();
    const heute = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');

    if (data.type === 'health') {
      ss.getSheetByName('Health')
        .appendRow([heute, num(data.schritte), num(data.kcal), '', '', '']);
      return out({ ok: true, type: 'health', datum: heute });
    }

    if (data.type === 'weight') {
      ss.getSheetByName('Gewicht')
        .appendRow([heute, num(data.gewicht), data.notiz || '']);
      return out({ ok: true, type: 'weight', datum: heute });
    }

    if (data.type === 'meal') {
      // Erwartet eine TRACKING-Zeile:
      // Datum | Uhrzeit | Mahlzeit | Beschreibung | kcal | Protein | Carbs | Fett
      let line = String(data.line || '').trim();
      line = line.replace(/^.*?TRACKING:\s*/i, '');   // führendes "📋 TRACKING:" entfernen
      const p = line.split('|').map(s => s.trim());
      ss.getSheetByName('Mahlzeiten').appendRow([
        p[0] || heute, p[1] || '', p[2] || '', p[3] || '',
        num(p[4]), num(p[5]), num(p[6]), num(p[7])
      ]);
      return out({ ok: true, type: 'meal' });
    }

    return out({ ok: false, error: 'Unbekannter type: ' + data.type });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function doGet() {
  return out({ ok: true, msg: 'Nutrition-Endpunkt laeuft. Schreiben erfolgt per POST.' });
}

function num(v) {
  if (v === undefined || v === null || v === '') return '';
  const n = parseFloat(String(v).replace(',', '.').replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? '' : n;
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
