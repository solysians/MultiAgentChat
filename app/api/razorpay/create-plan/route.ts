import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { planType } = await req.json();

    const planDetails = {
      basic: {
        period: "monthly",
        interval: 1,
        item: {
          name: "Basic Plan",
          amount: 99900, // ₹999 in paise
          currency: "INR",
          description: "100 AI queries/month, Basic support",
        },
      },
      pro: {
        period: "monthly",
        interval: 1,
        item: {
          name: "Pro Plan",
          amount: 199900, // ₹1999 in paise
          currency: "INR",
          description:
            "Unlimited AI queries, Priority support, Advanced models",
        },
      },
    };

    const plan = await razorpay.plans.create(
      planDetails[planType as keyof typeof planDetails],
    );

    return NextResponse.json({
      success: true,
      plan_id: plan.id,
      plan,
    });
  } catch (error: any) {
    console.error("Plan creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
