const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
const trainingInput = form?.querySelector<HTMLInputElement>("[data-training-interest]");
const status = document.querySelector<HTMLElement>("[data-contact-status]");

function setStatus(message: string) {
  if (!status) return;
  status.textContent = message;
  status.removeAttribute("hidden");
}

if (form && trainingInput) {
  const params = new URLSearchParams(window.location.search);
  const training = params.get("training");

  if (training && !trainingInput.value) {
    trainingInput.value = training;
    setStatus(`Training interest prefilled: ${training}`);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const subjectTraining = String(data.get("training") || "training inquiry").trim();
    const subject = `Training inquiry: ${subjectTraining || "Icon Learning"}`;
    const lines = [
      `Name: ${data.get("name") || ""}`,
      `Company: ${data.get("company") || ""}`,
      `Email: ${data.get("email") || ""}`,
      `Phone/WhatsApp: ${data.get("phone") || ""}`,
      `Training interest: ${data.get("training") || ""}`,
      `Team size: ${data.get("teamSize") || ""}`,
      `Preferred format: ${data.get("format") || ""}`,
      "",
      "Message:",
      `${data.get("message") || ""}`,
    ];

    const mailto = new URL(`mailto:${form.dataset.email ?? "jane@iconlearning.com.my"}`);
    mailto.searchParams.set("subject", subject);
    mailto.searchParams.set("body", lines.join("\n"));

    setStatus("Opening your email client with the inquiry details.");
    window.location.href = mailto.toString();
  });
}

export {};
