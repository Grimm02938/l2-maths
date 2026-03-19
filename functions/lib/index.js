"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyoncontact = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const axios_1 = require("axios");
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL ||
    "https://discord.com/api/webhooks/1482584184940662855/by8hpJTCiYs0HPtuBtSX34ic1Gg8cnf9uCjcWRFRZED-JOXG-LJ1vK-vy4XhDcJOh_UN";
exports.notifyoncontact = (0, firestore_1.onDocumentCreated)({ document: "contact-messages/{contactId}", region: "europe-west1" }, async (event) => {
    const snap = event.data;
    if (!snap) {
        logger.info("No data associated with the event");
        return;
    }
    const newMessage = snap.data();
    if (!discordWebhookUrl) {
        logger.error("Missing Discord webhook URL.");
        return;
    }
    const email = newMessage.email || "inconnu";
    const message = newMessage.message || "(vide)";
    const imageUrls = (newMessage.imageUrls || []).filter((url) => typeof url === "string");
    const imageLinksSection = imageUrls.length > 0
        ? `\n\nImages:\n${imageUrls.map((url) => `- ${url}`).join("\n")}`
        : "";
    // Discord allows up to 10 embeds per message.
    const embeds = imageUrls.slice(0, 10).map((url, index) => ({
        title: `Image ${index + 1}`,
        image: { url },
    }));
    try {
        await axios_1.default.post(discordWebhookUrl, {
            content: `Nouveau message de ${email}:\n${message}${imageLinksSection}`,
            embeds,
        });
        logger.log(`Successfully sent contact message to Discord (${imageUrls.length} image(s)).`);
    }
    catch (error) {
        logger.error("Error sending message to Discord:", error);
    }
});
//# sourceMappingURL=index.js.map