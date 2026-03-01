export interface VerticalDetection {
  vertical: string;
  confidence: "high" | "medium";
  modules: string[];
}

interface VerticalConfig {
  keywords: RegExp[];
  modules: string[];
}

const VERTICAL_MAP: Record<string, VerticalConfig> = {
  dental: {
    keywords: [
      /\bdent(al|ist|istry)\b/i,
      /\borthodont/i,
      /\bendodont/i,
      /\boral surgery/i,
    ],
    modules: ["healthcare", "appointments_medical"],
  },
  medical_general: {
    keywords: [
      /\b(doctor|physician|medical|clinic|primary care|family medicine|internal medicine|urgent care)\b/i,
    ],
    modules: ["healthcare", "appointments_medical"],
  },
  mental_health: {
    keywords: [
      /\b(therap(y|ist)|counsel(or|ing)|psychiatr|psycholog|mental health|behavioral health|social work)\b/i,
    ],
    modules: ["healthcare", "mental_health", "appointments_medical"],
  },
  physical_therapy: {
    keywords: [
      /\b(physical therapy|physiotherapy|pt clinic|rehab|rehabilitation|chiropractic|chiropractor)\b/i,
    ],
    modules: ["healthcare", "appointments_medical"],
  },
  veterinary: {
    keywords: [
      /\b(veterinar|vet clinic|animal hospital|pet hospital)\b/i,
    ],
    modules: ["veterinary", "appointments_general"],
  },
  salon_spa: {
    keywords: [
      /\b(salon|barber|hair|spa|massage|esthetician|nail|beauty|med.?spa|medspa|wax)\b/i,
    ],
    modules: ["appointments_general", "beauty_wellness"],
  },
  fitness: {
    keywords: [
      /\b(gym|fitness|personal train|yoga|pilates|crossfit|martial art|boxing|studio|boot.?camp)\b/i,
    ],
    modules: ["appointments_general", "fitness"],
  },
  legal: {
    keywords: [
      /\b(law firm|attorney|lawyer|legal|paralegal|law office|counsel|litigation)\b/i,
    ],
    modules: ["legal"],
  },
  financial: {
    keywords: [
      /\b(financial advis|investment|wealth management|accounting|tax prep|mortgage|lending|insurance agent|cpa|bookkeep)\b/i,
    ],
    modules: ["financial"],
  },
  restaurant: {
    keywords: [
      /\b(restaurant|cafe|bistro|diner|eatery|bar |pub |grill|pizzeria|bakery|catering|food truck)\b/i,
    ],
    modules: ["restaurant"],
  },
  real_estate: {
    keywords: [
      /\b(real estate|realtor|property management|broker|leasing|apartment|rental|landlord)\b/i,
    ],
    modules: ["real_estate"],
  },
  home_services: {
    keywords: [
      /\b(plumb|electric(al|ian)|hvac|roofing|landscap|cleaning service|maid|handyman|pest control|locksmith|painting|contractor|remodel)\b/i,
    ],
    modules: ["home_services", "appointments_general"],
  },
  automotive: {
    keywords: [
      /\b(auto repair|mechanic|auto shop|car wash|detailing|tire |body shop|oil change|dealership)\b/i,
    ],
    modules: ["automotive", "appointments_general"],
  },
  ecommerce: {
    keywords: [
      /\b(ecommerce|e.?commerce|online store|shopify|woocommerce|online shop|drop.?ship|subscription box)\b/i,
    ],
    modules: ["ecommerce"],
  },
  saas: {
    keywords: [
      /\b(saas|software|app|platform|tool|api|dashboard|web app|mobile app)\b/i,
    ],
    modules: ["saas"],
  },
  education: {
    keywords: [
      /\b(tutor|school|academy|learning center|education|teaching|instructor|training center|driving school|music school|dance school)\b/i,
    ],
    modules: ["education", "appointments_general"],
  },
  nonprofit: {
    keywords: [
      /\b(nonprofit|non.?profit|charity|foundation|501.?c|ministry|church|temple|mosque|synagogue|congregation)\b/i,
    ],
    modules: ["nonprofit"],
  },
};

export function detectVerticals(
  serviceType: string | null,
  businessDescription: string,
): VerticalDetection[] {
  const detections: VerticalDetection[] = [];

  for (const [vertical, config] of Object.entries(VERTICAL_MAP)) {
    let matched = false;
    let confidence: "high" | "medium" = "medium";

    for (const keyword of config.keywords) {
      if (serviceType && keyword.test(serviceType)) {
        matched = true;
        confidence = "high";
        break;
      }
      if (keyword.test(businessDescription)) {
        matched = true;
        // service_type is an exact field, business_description is fuzzy
        confidence = "medium";
      }
    }

    if (matched) {
      detections.push({ vertical, confidence, modules: config.modules });
    }
  }

  return detections;
}
