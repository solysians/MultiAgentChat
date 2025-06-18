import { sendGAEvent } from "@next/third-parties/google";

export function trackConversationGuideToCPaymentClick() {
  sendGAEvent("event", "ConversationGuideToCPaymentClick", { value: 1 });
}

export function trackAuthorizationPageButtonToCPaymentClick() {
  sendGAEvent("event", "AuthorizationPageButtonToCPaymentClick", { value: 1 });
}

export function trackAuthorizationPageBannerToCPaymentClick() {
  sendGAEvent("event", "AuthorizationPageBannerToCPaymentClick", {
    value: 1,
  });
}

export function trackSettingsPageGuideToCPaymentClick() {
  sendGAEvent("event", "SettingsPageGuideToCPaymentClick", { value: 1 });
}

export function trackSubscriptionPlanSelected(planId: string) {
  sendGAEvent("event", "SubscriptionPlanSelected", {
    value: 1,
    custom_parameters: { plan_id: planId },
  });
}

export function trackSubscriptionPaymentSuccess(subscriptionId: string) {
  sendGAEvent("event", "SubscriptionPaymentSuccess", {
    value: 1,
    custom_parameters: { subscription_id: subscriptionId },
  });
}

export function trackSubscriptionCancellation() {
  sendGAEvent("event", "SubscriptionCancellation", { value: 1 });
}
