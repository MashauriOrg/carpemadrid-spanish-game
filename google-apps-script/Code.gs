/**
 * CarpeMadrid assessment collector (Google Apps Script).
 * Deploy as a Web App under the Google account that owns the results Sheet.
 * IMPORTANT: Set SHEET_ID below and configure deployment access deliberately.
 * This endpoint is not deployed by committing this file.
 */
const SHEET_ID = '1iw0iIDSsbS22cfnzKh18e-yZgCCrT9h5NInZpBQOVas';
const TAB = 'Submissions';

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error('Missing payload');
    const p = JSON.parse(e.postData.contents);
    if (p.consent !== true) throw new Error('Consent required');
    if (!['B1/B2', 'B2/C1'].includes(p.assessment)) throw new Error('Unknown assessment');
    const name = String(p.name || '').trim().slice(0, 120);
    const email = String(p.email || '').trim().slice(0, 200);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Name and valid email required');
    const score = v => v === '' || v == null ? '' : Number.isFinite(Number(v)) ? Number(v) : '';
    const safe = v => {
      const s = String(v || '').slice(0, 2000);
      return /^[=+\-@]/.test(s) ? "'" + s : s;
    };
    const id = String(p.submissionId || '').slice(0, 100);
    if (!id) throw new Error('Submission ID required');
    lock.waitLock(10000);
    const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB);
    if (!sh) throw new Error('Missing submissions tab');
    const last = sh.getLastRow();
    if (last > 1) {
      const ids = sh.getRange(2, 19, last - 1, 1).getValues().flat();
      if (ids.includes(id)) return respond({ok:true, duplicate:true});
    }
    sh.appendRow([new Date(),safe(p.assessment),safe(name),safe(email),safe(p.level),
      score(p.b1Correct),score(p.b1Total),score(p.b1Percent),
      score(p.b2Correct),score(p.b2Total),score(p.b2Percent),
      score(p.c1Correct),score(p.c1Total),score(p.c1Percent),
      score(p.xp),score(p.nps),safe(p.liked),safe(p.improve),safe(id),'Yes']);
    return respond({ok:true});
  } catch (err) {
    return respond({ok:false,error:String(err.message)});
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}
function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
