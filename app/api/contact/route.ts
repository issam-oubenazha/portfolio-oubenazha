
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { name, email, message, website } = await request.json();

        // Anti-spam honeypot
        if (website) {
            return NextResponse.json({ success: true });
        }

        // Validate fields
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof message !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !message.trim()
        ) {
            return NextResponse.json(
                { error: "Please fill in all fields." },
                { status: 400 }
            );
        }

        if (
            name.length > 100 ||
            email.length > 254 ||
            message.length > 2000 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            return NextResponse.json(
                { error: "Please check your information." },
                { status: 400 }
            );
        }

        const webhook = process.env.SLACK_WEBHOOK_URL;

        if (!webhook) {
            console.error("SLACK_WEBHOOK_URL is missing");

            return NextResponse.json(
                { error: "Slack configuration is missing." },
                { status: 500 }
            );
        }

        // Send message to Slack
        const slackResponse = await fetch(webhook, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                blocks: [
                    {
                        type: "header",
                        text: {
                            type: "plain_text",
                            text: "📩 New Portfolio Contact Message",
                        },
                    },
                    {
                        type: "section",
                        fields: [
                            {
                                type: "plain_text",
                                text: `Name:\n${name.trim()}`,
                            },
                            {
                                type: "plain_text",
                                text: `Email:\n${email.trim()}`,
                            },
                        ],
                    },
                    {
                        type: "section",
                        text: {
                            type: "plain_text",
                            text: `Project / Message:\n${message.trim()}`,
                        },
                    },
                    {
                        type: "context",
                        elements: [
                            {
                                type: "plain_text",
                                text: "Sent from Issam's Portfolio",
                            },
                        ],
                    },
                ],
            }),
        });

        if (!slackResponse.ok) {
            const errorDetails = await slackResponse.text();
            console.error("Slack API error:", errorDetails);

            return NextResponse.json(
                { error: "Failed to send message. Please try again." },
                { status: 502 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Message sent successfully!",
        });

    } catch (error) {
        console.error("Contact API error:", error);

        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
