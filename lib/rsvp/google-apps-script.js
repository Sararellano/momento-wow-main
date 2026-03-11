/**
 * Google Apps Script - RSVP Receiver for Momento Wow
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste this entire code into Code.gs
 * 4. Click Deploy > New deployment
 * 5. Select type: "Web app"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone"
 * 8. Click Deploy and copy the URL
 * 9. Paste the URL in the RSVPConfig adapter.googleScriptUrl
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Get or create sheet for this event
    var sheetName = data.eventId || 'RSVPs';
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      // Add headers on first row
      var headers = ['Timestamp', 'Nombre', 'Asistencia', 'Invitados', 'Mensaje', 'Email'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Append the RSVP data
    var row = [
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.attendance || '',
      data.guests || '',
      data.message || '',
      data.email || ''
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'RSVP registrado' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (health check)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'RSVP endpoint active' }))
    .setMimeType(ContentService.MimeType.JSON);
}
