"use client";

import React, { useState } from "react";
import { IconButton } from "./button";
import { Modal, showToast } from "./ui-lib";
import styles from "./subscription-plans.module.scss";
import { useSubscriptionStore } from "../store/subscription";
import {
  trackSubscriptionPlanSelected,
  trackSubscriptionPaymentSuccess,
} from "../utils/auth-settings-events";

interface SubscriptionPlansProps {
  onClose?: () => void;
}

const SUBSCRIPTION_PLANS = {
  basic: {
    id: "basic_monthly",
    name: "Basic Plan",
    price: 999,
    currency: "INR",
    interval: "monthly" as const,
    features: [
      "100 AI queries/month",
      "Basic support",
      "Standard models",
      "Email support",
    ],
  },
  pro: {
    id: "pro_monthly",
    name: "Pro Plan",
    price: 1999,
    currency: "INR",
    interval: "monthly" as const,
    features: [
      "Unlimited AI queries",
      "Priority support",
      "Advanced models",
      "Custom integrations",
      "24/7 chat support",
    ],
  },
};

export function SubscriptionPlans({ onClose }: SubscriptionPlansProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const subscriptionStore = useSubscriptionStore();

  const handleSubscribe = async (planType: keyof typeof SUBSCRIPTION_PLANS) => {
    const plan = SUBSCRIPTION_PLANS[planType];
    setLoading(planType);

    try {
      trackSubscriptionPlanSelected(plan.id);

      // Create plan
      const planResponse = await fetch("/api/razorpay/create-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType }),
      });

      const planData = await planResponse.json();

      if (!planData.success) {
        throw new Error(planData.error);
      }

      // Create subscription
      const subscriptionResponse = await fetch(
        "/api/razorpay/create-subscription",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: planData.plan_id }),
        },
      );

      const subscriptionData = await subscriptionResponse.json();

      if (!subscriptionData.success) {
        throw new Error(subscriptionData.error);
      }

      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subscriptionData.subscription_id,
        name: "NextChat AI",
        description: `${plan.name} Subscription`,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              subscriptionStore.activateSubscription(
                plan,
                subscriptionData.subscription_id,
              );
              trackSubscriptionPaymentSuccess(subscriptionData.subscription_id);
              showToast("Subscription activated successfully!");
              onClose?.();
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            showToast("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Subscription error:", error);
      showToast(`Error: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="modal-mask">
      <Modal title="Choose Your Plan" onClose={onClose} actions={[]}>
        <div className={styles["subscription-plans"]}>
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
            <div key={key} className={styles["plan-card"]}>
              <div className={styles["plan-header"]}>
                <h3 className={styles["plan-name"]}>{plan.name}</h3>
                <div className={styles["plan-price"]}>
                  ₹{plan.price}
                  <span className={styles["plan-interval"]}>
                    /{plan.interval}
                  </span>
                </div>
              </div>

              <ul className={styles["plan-features"]}>
                {plan.features.map((feature, index) => (
                  <li key={index} className={styles["feature-item"]}>
                    ✓ {feature}
                  </li>
                ))}
              </ul>

              <IconButton
                text={loading === key ? "Processing..." : "Subscribe Now"}
                type="primary"
                onClick={() =>
                  handleSubscribe(key as keyof typeof SUBSCRIPTION_PLANS)
                }
                disabled={loading !== null}
                className={styles["subscribe-button"]}
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
