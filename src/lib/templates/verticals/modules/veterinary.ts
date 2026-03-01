export const veterinary = {
  id: "veterinary",
  title: "Best Practices — Veterinary Practice Messaging",
  content: `## Best Practices — Veterinary Practice Messaging

### Unique considerations:
- Include the pet's name when available — it personalizes the message and helps multi-pet owners identify which appointment
- "{business_name}: Reminder — Max's appointment is tomorrow at 10:00 AM."
- Vaccination and preventive care reminders are highly effective via SMS
- Unlike human healthcare, mentioning the type of visit is generally acceptable ("Max's annual checkup", "Bella's dental cleaning")

### Recommended message patterns:
- Appointment reminder: "{business_name}: {pet_name}'s appointment is tomorrow at {time}. Reply C to confirm."
- Vaccination due: "{business_name}: {pet_name} is due for vaccinations. Call {phone} to schedule."
- Prescription ready: "{business_name}: {pet_name}'s medication is ready for pickup."
- Post-visit follow-up: "{business_name}: How is {pet_name} doing after the visit? Call us at {phone} if you have concerns."

### Note on terminology:
- Pet health information is NOT subject to HIPAA
- You CAN reference specific treatments, medications, and conditions for animals
- The sensitivity rules from the healthcare module do NOT apply to veterinary practices`,
} as const;
