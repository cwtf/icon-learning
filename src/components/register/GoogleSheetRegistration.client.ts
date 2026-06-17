const form = document.querySelector<HTMLFormElement>("[data-registration-form]");
const status = document.querySelector<HTMLElement>("[data-registration-status]");
const submitButton = form?.querySelector<HTMLButtonElement>("[data-registration-submit]");
const submittedAtInput = form?.querySelector<HTMLInputElement>("[data-submitted-at]");
const registrationPayloadInput = form?.querySelector<HTMLInputElement>("[data-registration-payload]");
const seatCountInput = form?.querySelector<HTMLInputElement>("[data-seat-count]");
const participantList = form?.querySelector<HTMLElement>("[data-participant-list]");

function setStatus(message: string, tone: "neutral" | "success" | "error" = "neutral") {
  if (!status) return;
  status.textContent = message;
  status.dataset.tone = tone;
  status.removeAttribute("hidden");
}

if (form) {
  const clampSeatCount = (value: string) => {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) return 1;
    return Math.min(Math.max(parsed, 1), 50);
  };

  const participantValues = () =>
    Array.from(participantList?.querySelectorAll<HTMLFieldSetElement>("[data-participant-index]") ?? []).map((card) => ({
      name: card.querySelector<HTMLInputElement>('[name="participantName"]')?.value ?? "",
      nric: card.querySelector<HTMLInputElement>('[name="participantNric"]')?.value ?? "",
      email: card.querySelector<HTMLInputElement>('[name="participantEmail"]')?.value ?? "",
      phone: card.querySelector<HTMLInputElement>('[name="participantPhone"]')?.value ?? "",
    }));

  const createField = ({
    label,
    name,
    type = "text",
    value = "",
    autocomplete = "off",
    inputmode,
    placeholder,
  }: {
    label: string;
    name: string;
    type?: string;
    value?: string;
    autocomplete?: string;
    inputmode?: string;
    placeholder?: string;
  }) => {
    const wrapper = document.createElement("label");
    const labelText = document.createElement("span");
    const input = document.createElement("input");

    labelText.textContent = label;
    input.name = name;
    input.type = type;
    input.value = value;
    input.required = true;
    input.setAttribute("autocomplete", autocomplete);

    if (inputmode) {
      input.setAttribute("inputmode", inputmode);
    }

    if (placeholder) {
      input.placeholder = placeholder;
    }

    wrapper.append(labelText, input);
    return wrapper;
  };

  const createParticipantCard = (participantNumber: number, values = { name: "", nric: "", email: "", phone: "" }) => {
    const card = document.createElement("fieldset");
    const legend = document.createElement("legend");
    const grid = document.createElement("div");

    card.className = "participant-card";
    card.dataset.participantIndex = String(participantNumber);
    legend.textContent = `Participant ${participantNumber}`;
    grid.className = "registration-field-grid";

    grid.append(
      createField({
        label: "Full name",
        name: "participantName",
        value: values.name,
        autocomplete: participantNumber === 1 ? "name" : "off",
      }),
      createField({
        label: "NRIC",
        name: "participantNric",
        value: values.nric,
        inputmode: "numeric",
        placeholder: "e.g. 900101-10-1234",
      }),
      createField({
        label: "Email",
        name: "participantEmail",
        type: "email",
        value: values.email,
        autocomplete: participantNumber === 1 ? "email" : "off",
      }),
      createField({
        label: "Phone/WhatsApp",
        name: "participantPhone",
        type: "tel",
        value: values.phone,
        autocomplete: participantNumber === 1 ? "tel" : "off",
      })
    );

    card.append(legend, grid);
    return card;
  };

  const syncParticipantCards = () => {
    if (!participantList) return;

    const visibleCount = clampSeatCount(seatCountInput?.value || "1");
    const existingValues = participantValues();
    const cards = Array.from({ length: visibleCount }, (_, index) => createParticipantCard(index + 1, existingValues[index]));

    participantList.replaceChildren(...cards);

    if (seatCountInput && seatCountInput.value !== String(visibleCount)) {
      seatCountInput.value = String(visibleCount);
    }
  };

  seatCountInput?.addEventListener("input", () => {
    if (!seatCountInput.value) return;
    syncParticipantCards();
  });
  seatCountInput?.addEventListener("blur", () => {
    if (!seatCountInput.value) {
      seatCountInput.value = "1";
    }
    syncParticipantCards();
  });
  form.addEventListener("reset", () => {
    window.setTimeout(syncParticipantCards, 0);
  });
  syncParticipantCards();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const endpoint = form.dataset.sheetEndpoint?.trim();
    const seatCount = clampSeatCount(seatCountInput?.value || "1");

    if (seatCountInput) {
      seatCountInput.value = String(seatCount);
    }

    if (submittedAtInput) {
      submittedAtInput.value = new Date().toISOString();
    }

    if (registrationPayloadInput) {
      registrationPayloadInput.value = JSON.stringify({
        seats: seatCount,
        participants: participantValues().slice(0, seatCount),
      });
    }

    const data = new FormData(form);

    if (String(data.get("website") || "").trim()) {
      setStatus("Registration received. Thank you.", "success");
      form.reset();
      return;
    }

    if (!endpoint) {
      setStatus("Registration is not connected yet. Please WhatsApp Icon Learning to reserve your seat.", "error");
      return;
    }

    submitButton?.setAttribute("disabled", "true");
    setStatus("Sending your registration...", "neutral");

    try {
      const payload = new URLSearchParams();
      data.forEach((value, key) => {
        if (typeof value === "string") {
          payload.append(key, value);
        }
      });

      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        body: payload,
      });

      form.reset();
      setStatus("Registration sent. Icon Learning will follow up with confirmation details.", "success");
    } catch {
      setStatus("We could not send the registration. Please try again or WhatsApp Icon Learning.", "error");
    } finally {
      submitButton?.removeAttribute("disabled");
    }
  });
}

export {};
