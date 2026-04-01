import type { ClientOptions } from './client.js';
import { sendMessage } from './client.js';
import { checkConsent, recordConsent, revokeConsent } from './consent.js';
import { createAppointments } from './namespaces/appointments.js';
import { createCommunity } from './namespaces/community.js';
import { createInternal } from './namespaces/internal.js';
import { createMarketing } from './namespaces/marketing.js';
import { createOrders } from './namespaces/orders.js';
import { createSupport } from './namespaces/support.js';
import { createVerification } from './namespaces/verification.js';
import { createWaitlist } from './namespaces/waitlist.js';
import type {
  AppointmentsNamespace,
  CommunityNamespace,
  ConsentRecord,
  InternalNamespace,
  MarketingNamespace,
  OrdersNamespace,
  RecordConsentParams,
  RelayKitConfig,
  SendParams,
  SendResult,
  SupportNamespace,
  VerificationNamespace,
  WaitlistNamespace,
} from './types.js';

/**
 * RelayKit SDK — Compliant SMS messaging for developers.
 *
 * Quick start:
 *   const relaykit = new RelayKit();  // reads RELAYKIT_API_KEY from process.env
 *   await relaykit.appointments.sendConfirmation(phone, { date, time });
 *   await relaykit.recordConsent({ phone, consentType: 'transactional', source: 'signup_form' });
 */
export class RelayKit {
  private readonly options: ClientOptions;

  /** Appointment messaging. */
  public readonly appointments: AppointmentsNamespace;
  /** Order messaging. */
  public readonly orders: OrdersNamespace;
  /** Verification messaging. */
  public readonly verification: VerificationNamespace;
  /** Customer support messaging. */
  public readonly support: SupportNamespace;
  /** Marketing messaging (requires marketing consent). */
  public readonly marketing: MarketingNamespace;
  /** Internal/team messaging. */
  public readonly internal: InternalNamespace;
  /** Community messaging. */
  public readonly community: CommunityNamespace;
  /** Waitlist messaging. */
  public readonly waitlist: WaitlistNamespace;

  constructor(config: RelayKitConfig = {}) {
    this.options = {
      apiKey: config.apiKey ?? process.env.RELAYKIT_API_KEY ?? null,
      strict: config.strict ?? false,
    };

    this.appointments = createAppointments(this.options);
    this.orders = createOrders(this.options);
    this.verification = createVerification(this.options);
    this.support = createSupport(this.options);
    this.marketing = createMarketing(this.options);
    this.internal = createInternal(this.options);
    this.community = createCommunity(this.options);
    this.waitlist = createWaitlist(this.options);
  }

  /** Record SMS consent for a phone number. */
  recordConsent(params: RecordConsentParams): Promise<ConsentRecord | null> {
    return recordConsent(this.options, params);
  }

  /** Check if a phone number has active consent. */
  checkConsent(phone: string): Promise<ConsentRecord | null> {
    return checkConsent(this.options, phone);
  }

  /** Revoke consent for a phone number. */
  revokeConsent(phone: string): Promise<ConsentRecord | null> {
    return revokeConsent(this.options, phone);
  }

  /**
   * Send a message directly by message type.
   * Use for custom messages or the 'exploring' use case.
   */
  send(params: SendParams): Promise<SendResult | null> {
    return sendMessage(this.options, params.messageType, params.to, params.data);
  }
}

// Re-export types and errors for consumer use
export { RelayKitError } from './errors.js';
export type {
  AppointmentsNamespace,
  CommunityNamespace,
  ConsentRecord,
  InternalNamespace,
  MarketingNamespace,
  OrdersNamespace,
  RecordConsentParams,
  RelayKitConfig,
  SendParams,
  SendResult,
  SupportNamespace,
  VerificationNamespace,
  WaitlistNamespace,
} from './types.js';
