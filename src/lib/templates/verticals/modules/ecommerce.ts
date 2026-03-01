export const ecommerce = {
  id: "ecommerce",
  title: "Best Practices — E-Commerce Messaging",
  content: `## Best Practices — E-Commerce Messaging

### Order lifecycle:
- Confirmation: immediately after purchase
  "Order confirmed! #{order_number}. We'll text you when it ships."
- Shipped: when tracking is available
  "{business_name}: Your order has shipped! Track at [URL]"
- Delivered: on delivery confirmation
  "{business_name}: Your order was delivered! Questions? Reply to this text."
- Delivery issue: proactive notification
  "{business_name}: Delivery update — your package has been delayed. New estimated delivery: [date]. Track at [URL]."

### Cart abandonment (if registered for marketing):
- Send within 1-2 hours of abandonment
- One reminder only — never send multiple cart reminders
- "{business_name}: You left something in your cart! Complete your order: [URL]. Reply STOP to opt out."
- NEVER include the specific item names or prices — just drive them to the cart

### Promotional messaging:
- Keep offers simple: one CTA per message
- Include a direct link to the offer
- Flash sales create urgency: "24-hour flash sale! 30% off everything. Shop now: [URL]"
- Back-in-stock alerts (if subscribers opted in specifically):
  "The [product category] you wanted is back! Shop now: [URL]"

### Shipping delay communication:
- Be proactive — tell them before they ask
- Be honest about timelines
- Offer a solution or compensation when possible`,
} as const;
