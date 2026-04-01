/** Configuration options for the RelayKit client. */
export interface RelayKitConfig {
  /** API key. Defaults to process.env.RELAYKIT_API_KEY. */
  apiKey?: string;
  /** Throw RelayKitError instead of returning null. Default: false. */
  strict?: boolean;
}

/** Result returned from a message send operation. */
export interface SendResult {
  id: string | null;
  status: 'sent' | 'queued' | 'blocked' | 'failed';
  reason?: string;
}

/** Result returned from a consent operation. */
export interface ConsentRecord {
  phone: string;
  consentType: string;
  status: 'active' | 'revoked' | 'not_found';
  recordedAt?: string;
  reason?: string;
}

/** Parameters for recording consent. */
export interface RecordConsentParams {
  phone: string;
  consentType: string;
  source: string;
}

/** Parameters for the generic send() escape hatch. */
export interface SendParams {
  to: string;
  messageType: string;
  data: Record<string, unknown>;
}

// ── Namespace data types ─────────────────────────────────────────────

export interface AppointmentConfirmationData {
  date: string;
  time: string;
}

export interface AppointmentCancellationData {
  date: string;
}

export interface OrderData {
  orderId: string;
}

export interface OrderShippingData {
  orderId: string;
  trackingUrl?: string;
}

export interface VerificationCodeData {
  code: string;
}

export interface VerificationNewDeviceData {
  device: string;
}

export interface SupportTicketData {
  ticketId: string;
}

export interface SupportStatusUpdateData {
  ticketId: string;
  status: string;
}

export interface MarketingContentData {
  content: string;
}

export interface InternalMeetingData {
  date: string;
  time: string;
  title: string;
}

export interface InternalScheduleChangeData {
  date: string;
  details: string;
}

export interface InternalShiftData {
  date: string;
  time: string;
}

export interface CommunityEventData {
  eventName: string;
  date: string;
  time: string;
}

export interface CommunityGroupUpdateData {
  content: string;
}

export interface CommunityRenewalData {
  renewalDate: string;
}

export interface WaitlistSpotData {
  position: number;
}

export interface WaitlistReservationData {
  date: string;
  time: string;
}

export interface WaitlistWaitTimeData {
  estimatedWait: string;
}

// ── Namespace interfaces ─────────────────────────────────────────────

export interface AppointmentsNamespace {
  sendConfirmation(phone: string, data: AppointmentConfirmationData): Promise<SendResult | null>;
  sendReminder(phone: string, data: AppointmentConfirmationData): Promise<SendResult | null>;
  sendReschedule(phone: string, data: AppointmentConfirmationData): Promise<SendResult | null>;
  sendCancellation(phone: string, data: AppointmentCancellationData): Promise<SendResult | null>;
  sendNoShow(phone: string, data: AppointmentCancellationData): Promise<SendResult | null>;
}

export interface OrdersNamespace {
  sendConfirmation(phone: string, data: OrderData): Promise<SendResult | null>;
  sendShipping(phone: string, data: OrderShippingData): Promise<SendResult | null>;
  sendDelivered(phone: string, data: OrderData): Promise<SendResult | null>;
  sendReturn(phone: string, data: OrderData): Promise<SendResult | null>;
  sendRefund(phone: string, data: OrderData): Promise<SendResult | null>;
}

export interface VerificationNamespace {
  sendCode(phone: string, data: VerificationCodeData): Promise<SendResult | null>;
  sendPasswordReset(phone: string, data: VerificationCodeData): Promise<SendResult | null>;
  sendNewDevice(phone: string, data: VerificationNewDeviceData): Promise<SendResult | null>;
}

export interface SupportNamespace {
  sendTicketCreated(phone: string, data: SupportTicketData): Promise<SendResult | null>;
  sendStatusUpdate(phone: string, data: SupportStatusUpdateData): Promise<SendResult | null>;
  sendResolution(phone: string, data: SupportTicketData): Promise<SendResult | null>;
}

export interface MarketingNamespace {
  sendPromotion(phone: string, data: MarketingContentData): Promise<SendResult | null>;
  sendNewArrivals(phone: string, data: MarketingContentData): Promise<SendResult | null>;
}

export interface InternalNamespace {
  sendMeetingReminder(phone: string, data: InternalMeetingData): Promise<SendResult | null>;
  sendScheduleChange(phone: string, data: InternalScheduleChangeData): Promise<SendResult | null>;
  sendShiftConfirmation(phone: string, data: InternalShiftData): Promise<SendResult | null>;
}

export interface CommunityNamespace {
  sendEventReminder(phone: string, data: CommunityEventData): Promise<SendResult | null>;
  sendGroupUpdate(phone: string, data: CommunityGroupUpdateData): Promise<SendResult | null>;
  sendRenewalNotice(phone: string, data: CommunityRenewalData): Promise<SendResult | null>;
}

export interface WaitlistNamespace {
  sendSpotAvailable(phone: string, data: WaitlistSpotData): Promise<SendResult | null>;
  sendReservationConfirmed(phone: string, data: WaitlistReservationData): Promise<SendResult | null>;
  sendWaitTimeUpdate(phone: string, data: WaitlistWaitTimeData): Promise<SendResult | null>;
}
