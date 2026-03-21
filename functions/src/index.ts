
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { https } from "firebase-functions/v2";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import Stripe from "stripe";

type ContactPayload = {
    email?: string;
    message?: string;
    imageUrls?: string[];
};

const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL ||
    "https://discord.com/api/webhooks/1482584184940662855/by8hpJTCiYs0HPtuBtSX34ic1Gg8cnf9uCjcWRFRZED-JOXG-LJ1vK-vy4XhDcJOh_UN";

export const notifyoncontact = onDocumentCreated(
    { document: "contact-messages/{contactId}", region: "europe-west1" },
    async (event) => {
        const snap = event.data;
        if (!snap) {
            logger.info("No data associated with the event");
            return;
        }

        const newMessage = snap.data() as ContactPayload;
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
            await axios.post(discordWebhookUrl, {
                content: `Nouveau message de ${email}:\n${message}${imageLinksSection}`,
                embeds,
            });
            logger.log(`Successfully sent contact message to Discord (${imageUrls.length} image(s)).`);
        } catch (error) {
            logger.error("Error sending message to Discord:", error);
        }
    }
);

// Stripe Secret Key
const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");

type DonationPayload = {
    amount: number;
    email: string;
    name: string;
};

export const createDonationIntent = https.onRequest(
    { region: "europe-west1", cors: true, secrets: [stripeSecretKey] },
    async (request, response) => {
        logger.log("Received request:", {
            method: request.method,
            headers: request.headers,
            body: request.body,
        });

        // Vérifier que c'est une requête POST
        if (request.method !== "POST") {
            logger.error("Invalid method:", request.method);
            response.status(405).json({ error: "Method not allowed" });
            return;
        }

        try {
            const { amount, email, name } = request.body as DonationPayload;
            logger.log("Processing donation:", { amount, email, name });

            // Validation
            if (!amount || amount < 100) {
                logger.error("Invalid amount:", amount);
                response.status(400).json({ error: "Montant invalide (minimum 1€)" });
                return;
            }

            if (!email || !name) {
                logger.error("Missing donor info");
                response.status(400).json({ error: "Email et nom requis" });
                return;
            }

            const secretKey = stripeSecretKey.value()?.trim();
            if (!secretKey) {
                logger.error("Clé Stripe secrète manquante");
                response.status(500).json({ error: "Stripe key not configured" });
                return;
            }

            if (!secretKey.startsWith("sk_")) {
                logger.error("Format de clé Stripe invalide", { prefix: secretKey.slice(0, 4), length: secretKey.length });
                response.status(500).json({ error: "Stripe key format invalid" });
                return;
            }

            logger.log("Initializing Stripe with secret key");

            // Initialiser Stripe avec le secret injecté
            const stripe = new Stripe(secretKey, {
                apiVersion: "2026-02-25.clover",
            });

            logger.log("Creating payment intent for amount:", amount);

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

            response.status(200).json({
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            });
        } catch (error) {
            logger.error("Error creating payment intent:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            response.status(500).json({
                error: errorMessage,
            });
        }
    }
);
