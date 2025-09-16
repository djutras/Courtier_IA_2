export interface WebhookPayload {
  message: string;
  response: string;
  timestamp: string;
  conversationId?: string;
  fullHistory?: any[];
  email?: string;
  emailDealerSubject?: string;
  emailDealerBody?: string;
  formType?: string;
  contactData?: any;
  propertyData?: any;
}

export async function sendToMakeWebhook(payload: WebhookPayload): Promise<void> {
  const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
  
  if (!webhookUrl) {
    throw new Error('Make.com webhook URL not found. Please add VITE_MAKE_WEBHOOK_URL to your .env file.');
  }

  try {
    console.log('Sending webhook to:', webhookUrl);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Webhook response status:', response.status);
    console.log('Webhook response headers:', response.headers);
    
    const responseText = await response.text();
    console.log('Webhook response body:', responseText);

    if (!response.ok) {
      throw new Error(`Webhook call failed: ${response.status} ${response.statusText}`);
    }

    console.log('Webhook sent successfully to Make.com');
  } catch (error) {
    console.error('Error sending webhook to Make.com:', error);
    throw error;
  }
}