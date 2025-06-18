
import { NextRequest } from 'next/server';
import crypto from 'crypto';

describe('Razorpay Payment Verification', () => {
  const mockEnv = {
    RAZORPAY_KEY_SECRET: 'test_secret_key',
  };

  beforeEach(() => {
    process.env = { ...process.env, ...mockEnv };
  });

  describe('/api/razorpay/verify-payment', () => {
    it('should verify payment signature successfully', async () => {
      const { POST } = await import('../app/api/razorpay/verify-payment/route');
      
      const paymentId = 'pay_test123';
      const subscriptionId = 'sub_test123';
      
      // Create valid signature
      const body = paymentId + "|" + subscriptionId;
      const signature = crypto
        .createHmac('sha256', mockEnv.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      const req = new NextRequest('http://localhost:3000/api/razorpay/verify-payment', {
        method: 'POST',
        body: JSON.stringify({
          razorpay_payment_id: paymentId,
          razorpay_subscription_id: subscriptionId,
          razorpay_signature: signature,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.payment_id).toBe(paymentId);
      expect(data.subscription_id).toBe(subscriptionId);
    });

    it('should reject invalid payment signature', async () => {
      const { POST } = await import('../app/api/razorpay/verify-payment/route');
      
      const req = new NextRequest('http://localhost:3000/api/razorpay/verify-payment', {
        method: 'POST',
        body: JSON.stringify({
          razorpay_payment_id: 'pay_test123',
          razorpay_subscription_id: 'sub_test123',
          razorpay_signature: 'invalid_signature',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Payment verification failed');
    });
  });
});
