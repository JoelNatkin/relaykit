import type { ClientOptions } from '../client.js';
import { sendMessage } from '../client.js';
import type { OrderData, OrderShippingData, OrdersNamespace, SendResult } from '../types.js';

export function createOrders(options: ClientOptions): OrdersNamespace {
  return {
    sendConfirmation(phone: string, data: OrderData): Promise<SendResult | null> {
      return sendMessage(options, 'orders_order_confirmation', phone, data as unknown as Record<string, unknown>);
    },
    sendShipping(phone: string, data: OrderShippingData): Promise<SendResult | null> {
      return sendMessage(options, 'orders_shipping_notification', phone, data as unknown as Record<string, unknown>);
    },
    sendDelivered(phone: string, data: OrderData): Promise<SendResult | null> {
      return sendMessage(options, 'orders_delivery_confirmation', phone, data as unknown as Record<string, unknown>);
    },
    sendReturn(phone: string, data: OrderData): Promise<SendResult | null> {
      return sendMessage(options, 'orders_return_initiated', phone, data as unknown as Record<string, unknown>);
    },
    sendRefund(phone: string, data: OrderData): Promise<SendResult | null> {
      return sendMessage(options, 'orders_refund_processed', phone, data as unknown as Record<string, unknown>);
    },
  };
}
