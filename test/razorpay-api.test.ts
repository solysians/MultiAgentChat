
import { NextRequest } from 'next/server';

// Mock the Razorpay module
jest.mock('razorpay', () => {
  return jest.fn().mockImplementation(() => ({
    plans: {
      create: jest.fn().mockResolvedValue({
        id: 'plan_test123',
        period: 'monthly',
        interval: 1,
        item: {
          name: 'Basic Plan',
          amount: 99900,
          currency: 'INR',
        },
      }),
    },
    subscriptions: {
      create: jest.fn().mockResolvedValue({
        id: 'sub_test123',
        plan_id: 'plan_test123',
        status: 'created',
      }),
      fetch: jest.fn().mockResolvedValue({
        id: 'sub_test123',
        status: 'active',
        plan: {
          item: {
            amount: 99900,
          },
        },
        created_at: 1640995200,
        current_start: 1640995200,
        current_end: 1643673600,
      }),
    },
  }));
});

describe('Razorpay API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('/api/razorpay/create-plan', () => {
    it('should create a basic plan successfully', async () => {
      const { POST } = await import('../app/api/razorpay/create-plan/route');
      
      const req = new NextRequest('http://localhost:3000/api/razorpay/create-plan', {
        method: 'POST',
        body: JSON.stringify({ planType: 'basic' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.plan_id).toBe('plan_test123');
    });

    it('should create a pro plan successfully', async () => {
      const { POST } = await import('../app/api/razorpay/create-plan/route');
      
      const req = new NextRequest('http://localhost:3000/api/razorpay/create-plan', {
        method: 'POST',
        body: JSON.stringify({ planType: 'pro' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.plan_id).toBe('plan_test123');
    });
  });

  describe('/api/razorpay/create-subscription', () => {
    it('should create a subscription successfully', async () => {
      const { POST } = await import('../app/api/razorpay/create-subscription/route');
      
      const req = new NextRequest('http://localhost:3000/api/razorpay/create-subscription', {
        method: 'POST',
        body: JSON.stringify({ planId: 'plan_test123' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.subscription_id).toBe('sub_test123');
    });
  });

  describe('/api/razorpay/subscription-status', () => {
    it('should fetch subscription status successfully', async () => {
      const { GET } = await import('../app/api/razorpay/subscription-status/route');
      
      const req = new NextRequest('http://localhost:3000/api/razorpay/subscription-status?subscription_id=sub_test123');

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.subscription.id).toBe('sub_test123');
    });

    it('should return error for missing subscription ID', async () => {
      const { GET } = await import('../app/api/razorpay/subscription-status/route');
      
      const req = new NextRequest('http://localhost:3000/api/razorpay/subscription-status');

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Subscription ID is required');
    });
  });
});
