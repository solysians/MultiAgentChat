import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle different webhook events
    switch (event.event) {
      case "subscription.authenticated":
        console.log("Subscription authenticated:", event.payload.subscription);
        break;
      case "subscription.activated":
        console.log("Subscription activated:", event.payload.subscription);
        break;
      case "subscription.charged":
        console.log("Subscription charged:", event.payload.payment);
        break;
      case "subscription.cancelled":
        console.log("Subscription cancelled:", event.payload.subscription);
        break;
      case "subscription.paused":
        console.log("Subscription paused:", event.payload.subscription);
        break;
      default:
        console.log("Unhandled webhook event:", event.event);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
