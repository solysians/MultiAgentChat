
import { useSubscriptionStore } from '../app/store/subscription';

// Mock the store utilities
jest.mock('../app/utils/store', () => ({
  createPersistStore: (initialState: any, storeCreator: any) => {
    const state = { ...initialState };
    const actions = storeCreator(
      (updater: any) => {
        if (typeof updater === 'function') {
          Object.assign(state, updater(state));
        } else {
          Object.assign(state, updater);
        }
      },
      () => state
    );
    return () => ({ ...state, ...actions });
  },
}));

describe('Subscription Store', () => {
  let store: ReturnType<typeof useSubscriptionStore>;

  beforeEach(() => {
    store = useSubscriptionStore();
  });

  it('should have correct initial state', () => {
    expect(store.isActive).toBe(false);
    expect(store.status).toBe('inactive');
    expect(store.currentPlan).toBeUndefined();
    expect(store.subscriptionId).toBeUndefined();
  });

  it('should activate subscription correctly', () => {
    const mockPlan = {
      id: 'basic_monthly',
      name: 'Basic Plan',
      price: 999,
      currency: 'INR',
      interval: 'monthly' as const,
      features: ['100 AI queries/month'],
    };

    store.activateSubscription(mockPlan, 'sub_test123');

    expect(store.isActive).toBe(true);
    expect(store.status).toBe('active');
    expect(store.currentPlan).toEqual(mockPlan);
    expect(store.subscriptionId).toBe('sub_test123');
  });

  it('should cancel subscription correctly', () => {
    // First activate
    const mockPlan = {
      id: 'basic_monthly',
      name: 'Basic Plan',
      price: 999,
      currency: 'INR',
      interval: 'monthly' as const,
      features: ['100 AI queries/month'],
    };
    store.activateSubscription(mockPlan, 'sub_test123');

    // Then cancel
    store.cancelSubscription();

    expect(store.isActive).toBe(false);
    expect(store.status).toBe('cancelled');
  });

  it('should pause subscription correctly', () => {
    // First activate
    const mockPlan = {
      id: 'basic_monthly',
      name: 'Basic Plan',
      price: 999,
      currency: 'INR',
      interval: 'monthly' as const,
      features: ['100 AI queries/month'],
    };
    store.activateSubscription(mockPlan, 'sub_test123');

    // Then pause
    store.pauseSubscription();

    expect(store.status).toBe('paused');
  });

  it('should check subscription active status correctly', () => {
    expect(store.isSubscriptionActive()).toBe(false);

    const mockPlan = {
      id: 'basic_monthly',
      name: 'Basic Plan',
      price: 999,
      currency: 'INR',
      interval: 'monthly' as const,
      features: ['100 AI queries/month'],
    };
    store.activateSubscription(mockPlan, 'sub_test123');

    expect(store.isSubscriptionActive()).toBe(true);
  });

  it('should check valid subscription correctly', () => {
    expect(store.hasValidSubscription()).toBe(false);

    const mockPlan = {
      id: 'basic_monthly',
      name: 'Basic Plan',
      price: 999,
      currency: 'INR',
      interval: 'monthly' as const,
      features: ['100 AI queries/month'],
    };
    store.activateSubscription(mockPlan, 'sub_test123');

    expect(store.hasValidSubscription()).toBe(true);

    store.pauseSubscription();
    expect(store.hasValidSubscription()).toBe(true);

    store.cancelSubscription();
    expect(store.hasValidSubscription()).toBe(false);
  });
});
