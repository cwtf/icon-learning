const SHEET_NAME = "Registrations";
const SCRIPT_VERSION = "participant-rows-v6";

function doGet() {
  return ContentService.createTextOutput(`Icon Learning registration endpoint: ${SCRIPT_VERSION}`);
}

function doPost(event) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error(`Sheet tab not found: ${SHEET_NAME}`);
  }

  const values = event.parameter;
  const lists = event.parameters || {};
  const payload = parseRegistrationPayload(values.registrationPayload);
  const list = (name) => {
    const value = lists[name];
    if (Array.isArray(value)) return value;
    return value ? [value] : [];
  };

  const participantNames = list("participantName");
  const participantNrics = list("participantNric");
  const participantEmails = list("participantEmail");
  const participantPhones = list("participantPhone");
  console.log(JSON.stringify({
    version: SCRIPT_VERSION,
    seats: values.seats || "",
    company: values.company || "",
    registrationPayload: values.registrationPayload || "",
    participantNames,
    participantNrics,
    participantEmails,
    participantPhones,
  }));
  const participants = payload.participants.length > 0
    ? payload.participants
    : participantNames.map((name, index) => ({
        name,
        nric: participantNrics[index] || "",
        email: participantEmails[index] || "",
        phone: participantPhones[index] || "",
      }));
  const submittedAt = values.submittedAt || new Date().toISOString();
  const seatCount = Number(values.seats || payload.seats || participants.length || 1);
  const rowCount = Math.max(
    Number.isFinite(seatCount) ? seatCount : 1,
    participants.length
  );

  const rows = Array.from({ length: rowCount }, (_, index) => [
    submittedAt,
    values.courseTitle || "",
    values.courseCategory || "",
    values.courseDate || "",
    values.courseTime || "",
    values.courseFormat || "",
    values.company || "",
    seatCount,
    index + 1,
    participants[index]?.name || "",
    participants[index]?.nric || "",
    participants[index]?.email || "",
    participants[index]?.phone || "",
    values.notes || "",
    values.consent || "",
    values.sourcePage || "",
  ]);

  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
  }

  return ContentService.createTextOutput("OK");
}

function parseRegistrationPayload(rawPayload) {
  if (!rawPayload) {
    return { seats: "", participants: [] };
  }

  try {
    const payload = JSON.parse(rawPayload);
    const participants = Array.isArray(payload.participants)
      ? payload.participants.map((participant) => ({
          name: participant.name || "",
          nric: participant.nric || "",
          email: participant.email || "",
          phone: participant.phone || "",
        }))
      : [];

    return {
      seats: payload.seats || "",
      participants,
    };
  } catch (error) {
    return { seats: "", participants: [] };
  }
}
