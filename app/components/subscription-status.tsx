"use client";

import React, { useState, useEffect } from "react";
import { IconButton } from "./button";
import { ListItem } from "./ui-lib";
import styles from "./subscription-status.module.scss";
import { useSubscriptionStore } from "../store/subscription";
import { trackSubscriptionCancellation } from "../utils/auth-settings-events";
import ConfigIcon from "../icons/config.svg";
import ResetIcon from "../icons/reload.svg";
import CancelIcon from "../icons/close.svg";

export function SubscriptionStatus() {
  const subscriptionStore = useSubscriptionStore();
  const [loading, setLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  const fetchSubscriptionStatus = async () => {
    if (!subscriptionStore.subscriptionId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/razorpay/subscription-status?subscription_id=${subscriptionStore.subscriptionId}`,
      );
      const data = await response.json();

      if (data.success) {
        setSubscriptionData(data.subscription);

        // Update store with latest status
        subscriptionStore.updateSubscription({
          status: data.subscription.status,
          isActive: data.subscription.status === "active",
        });
      }
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [subscriptionStore.subscriptionId]);

  const handleCancelSubscription = async () => {
    if (!subscriptionStore.subscriptionId) return;

    // Note: Actual cancellation would need API implementation
    const confirmed = window.confirm(
      "Are you sure you want to cancel your subscription? This action cannot be undone.",
    );

    if (confirmed) {
      trackSubscriptionCancellation();
      subscriptionStore.cancelSubscription();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10b981";
      case "paused":
        return "#f59e0b";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (!subscriptionStore.hasValidSubscription()) {
    return null;
  }

  return (
    <div className={styles["subscription-status"]}>
      <ListItem
        title="Subscription Status"
        subTitle={
          subscriptionData
            ? `${subscriptionStore.currentPlan?.name} - Next billing: ${
                subscriptionData.current_end
                  ? formatDate(subscriptionData.current_end)
                  : "N/A"
              }`
            : "Loading subscription details..."
        }
      >
        <div className={styles["subscription-controls"]}>
          <div className={styles["status-badge"]}>
            <span
              className={styles["status-indicator"]}
              style={{
                backgroundColor: getStatusColor(subscriptionStore.status),
              }}
            />
            {subscriptionStore.status.toUpperCase()}
          </div>

          <div className={styles["action-buttons"]}>
            <IconButton
              icon={<ResetIcon />}
              text="Refresh"
              onClick={fetchSubscriptionStatus}
              disabled={loading}
              bordered
            />

            <IconButton
              icon={<ConfigIcon />}
              text="Manage"
              onClick={() => {
                // Open subscription management modal or redirect
                window.open("https://dashboard.razorpay.com", "_blank");
              }}
              bordered
            />

            {subscriptionStore.status === "active" && (
              <IconButton
                icon={<CancelIcon />}
                text="Cancel"
                onClick={handleCancelSubscription}
                type="danger"
                bordered
              />
            )}
          </div>
        </div>
      </ListItem>

      {subscriptionData && (
        <div className={styles["subscription-details"]}>
          <div className={styles["detail-row"]}>
            <span>Plan:</span>
            <span>{subscriptionStore.currentPlan?.name}</span>
          </div>
          <div className={styles["detail-row"]}>
            <span>Amount:</span>
            <span>₹{subscriptionData.plan?.item?.amount / 100}</span>
          </div>
          <div className={styles["detail-row"]}>
            <span>Started:</span>
            <span>{formatDate(subscriptionData.created_at)}</span>
          </div>
          {subscriptionData.current_start && (
            <div className={styles["detail-row"]}>
              <span>Current period:</span>
              <span>
                {formatDate(subscriptionData.current_start)} -{" "}
                {formatDate(subscriptionData.current_end)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
