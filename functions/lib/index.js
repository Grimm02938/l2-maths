"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDonationIntent = exports.notifyoncontact = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const v2_1 = require("firebase-functions/v2");
const logger = require("firebase-functions/logger");
const axios_1 = require("axios");
const stripe_1 = require("stripe");
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
// Stripe Payment Intent Handler
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2026-02-25.clover",
});
exports.createDonationIntent = v2_1.https.onRequest({ region: "europe-west1", cors: true }, async (request, response) => {
    // Vérifier que c'est une requête POST
    if (request.method !== "POST") {
        response.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const { amount, email, name } = request.body;
        // Validation
        if (!amount || amount < 100) {
            response.status(400).json({ error: "Montant invalide (minimum 1€)" });
            return;
        }
        if (!email || !name) {
            response.status(400).json({ error: "Email et nom requis" });
            return;
        }
        if (!process.env.STRIPE_SECRET_KEY) {
            logger.error("Clé Stripe secrète manquante");
            response.status(500).json({ error: "Erreur serveur" });
            return;
        }
        // Créer l'intention de paiement
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "eur",
            receipt_email: email,
            metadata: {
                donor_name: name,
                donor_email: email,
                donation_purpose: "L2 Maths Archive Support",
            },
            description: `Donation to L2 Maths Archive - ${name}`,
        });
        logger.log(`Payment intent created: ${paymentIntent.id}`);
        response.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    }
    catch (error) {
        logger.error("Error creating payment intent:", error);
        response.status(500).json({
            error: error instanceof Error ? error.message : "Erreur serveur",
        });
    }
});
//# sourceMappingURL=index.js.map