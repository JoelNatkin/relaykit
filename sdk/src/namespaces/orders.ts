import type { ClientOptions } from '../client.js';
import { sendMessage } from '../client.js';
import type { OrderData, OrderShippingData, OrdersNamespace, SendResult } from '../types.js';

export function createOrders(options: ClientOptions): OrdersNamespace {
  return {
    sendConfirmation(phone: string, data: OrderData): Promise<SendResult | null> {
      return sendMessage(options, 'orders', 'sendConfirmation', phone, data as unknown as Record<string, unknown>);
    },
    sendShipping(phone: string, data: OrderShippingData): Promise<SendResult | null> {
      return sendMessage(options, 'orders', 'sendShipping', phone, data as unknown as Record<string, unknown>);
    },
    sendDelivered(phone: string, data: OrderData): Promise<SendResult | null> {
      return sendMessage(options, 'orders', 'sendDelivered', phone, data as unknown as Record<string, unknown>);
    },
    sendReturn(phone: string, data: OrderData): Promise<SendResult | null> {
      return sendMessage(options, 'orders', 'sendReturn', phone, data as unknown as Record<string, unknown>);
    },
    sendRefund(phone: string, data: OrderData): Promise<SendResult | null> {
      return sendMessage(options, 'orders', 'sendRefund', phone, data as unknown as Record<string, unknown>);
    },
  };
}
