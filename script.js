/* ===================================================== */
/* TIDY'S WEBSITE SCRIPT                                 */
/* Small notes are included so this is easy to edit later */
/* ===================================================== */

/* ===================================================== */
/* DISCORD WEBHOOK SETTINGS                              */
/* IMPORTANT: If this website is public, anyone can view  */
/* this webhook from the browser. For a private RP site it */
/* may be okay, but the safest setup is using a backend.   */
/* ===================================================== */

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1522766849991774278/zU4DZqGu3mJc2VHYhD6sn1aX3k-g8nrCFqkIFeGzorZNClmfudizZUAj7vukjG-qPpPo";

/* ===================================================== */
/* APPOINTMENT FORM                                      */
/* This sends new appointments to your Discord channel.   */
/* ===================================================== */

const appointmentForm = document.getElementById("appointmentForm");
const formMessage = document.getElementById("formMessage");

appointmentForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Grab form values
  const name = document.getElementById("customerName").value.trim();
  const vehicle = document.getElementById("vehicleName").value.trim();
  const service = document.getElementById("serviceType").value;
  const time = document.getElementById("timeSlot").value.trim();
  const notes = document.getElementById("notes").value.trim();

  // Basic safety check
  if (!name || !vehicle || !service) {
    formMessage.textContent = "Please fill out name, vehicle, and service.";
    formMessage.className = "form-message error";
    return;
  }

  // Button loading state
  const submitButton = appointmentForm.querySelector("button[type='submit']");
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "SENDING...";

  // Discord message layout
  const discordMessage = {
    username: "Tidy's Appointment Bot",
    avatar_url: "https://i.imgur.com/4M34hi2.png",
    allowed_mentions: { parse: [] },
    embeds: [
      {
        title: "New Appointment Request",
        color: 16711935,
        fields: [
          {
            name: "Customer Name",
            value: name || "Not provided",
            inline: true
          },
          {
            name: "Vehicle",
            value: vehicle || "Not provided",
            inline: true
          },
          {
            name: "Service Needed",
            value: service || "Not provided",
            inline: false
          },
          {
            name: "Preferred Time",
            value: time || "Not provided",
            inline: false
          },
          {
            name: "Notes",
            value: notes || "No notes added",
            inline: false
          }
        ],
        footer: {
          text: "Tidy's Tuner Shop Website"
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    // Send appointment to Discord
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(discordMessage)
    });

    if (!response.ok) {
      throw new Error("Discord webhook failed");
    }

    // Success message on website
    formMessage.textContent = `Appointment request sent for ${name} - ${vehicle}.`;
    formMessage.className = "form-message success";

    // Clear form after successful submit
    appointmentForm.reset();
  } catch (error) {
    console.error("Appointment submit error:", error);
    formMessage.textContent = "Something went wrong. Please try again or contact Tidy's directly.";
    formMessage.className = "form-message error";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

/* ===================================================== */
/* PAGE LOAD ANIMATION                                   */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});
