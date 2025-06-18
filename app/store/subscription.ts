import { StoreKey } from "../constant";
import { createPersistStore } from "../utils/store";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "monthly" | "yearly";
  features: string[];
}

export interface SubscriptionState {
  isActive: boolean;
  currentPlan?: SubscriptionPlan;
  subscriptionId?: string;
  customerId?: string;
  nextBillingDate?: string;
  status: "active" | "inactive" | "cancelled" | "past_due" | "paused";
  paymentMethod?: {
    type: string;
    last4?: string;
  };
}

const DEFAULT_SUBSCRIPTION_STATE: SubscriptionState = {
  isActive: false,
  status: "inactive",
};

export const useSubscriptionStore = createPersistStore(
  { ...DEFAULT_SUBSCRIPTION_STATE },
  (set, get) => ({
    updateSubscription(subscription: Partial<SubscriptionState>) {
      set((state) => ({ ...state, ...subscription }));
    },

    activateSubscription(plan: SubscriptionPlan, subscriptionId: string) {
      set((state) => ({
        ...state,
        isActive: true,
        currentPlan: plan,
        subscriptionId,
        status: "active",
      }));
    },

    cancelSubscription() {
      set((state) => ({
        ...state,
        isActive: false,
        status: "cancelled",
      }));
    },

    pauseSubscription() {
      set((state) => ({
        ...state,
        status: "paused",
      }));
    },

    isSubscriptionActive() {
      const state = get();
      return state.isActive && state.status === "active";
    },

    hasValidSubscription() {
      const state = get();
      return state.status === "active" || state.status === "paused";
    },
  }),
  {
    name: StoreKey.Subscription,
    version: 1,
  },
);
