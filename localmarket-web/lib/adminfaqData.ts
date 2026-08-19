export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const adminFaqs: FAQItem[] = [
  {
    category: 'Providers',
    question: 'How do I approve a provider application?',
    answer: 'Go to Users → Pending tab, review the applicant\'s category and experience, then click Accept or Reject. The applicant is notified automatically.',
  },
  {
    category: 'Providers',
    question: 'How do I verify or unverify a provider?',
    answer: 'Go to Providers, find the provider, and toggle Verify/Revoke. Verified providers get a badge shown to customers.',
  },
  {
    category: 'Bookings & Payments',
    question: 'How do I view all platform bookings?',
    answer: 'The Overview page shows recent bookings and stats. Use the month filter to view historical data, and Export to download a CSV.',
  },
  {
    category: 'Bookings & Payments',
    question: 'How is revenue calculated?',
    answer: 'Revenue reflects the sum of all payments with status "succeeded". Pending and failed payments are excluded from totals.',
  },
  {
    category: 'Content Management',
    question: 'How do I add or edit a service category?',
    answer: 'Go to Categories → Add Category, or click Edit next to an existing one. Deleting a category may affect linked providers.',
  },
  {
    category: 'Content Management',
    question: 'Can I remove a review?',
    answer: 'Yes. Go to Reviews and click Delete next to any review that violates guidelines or is reported by users.',
  },
  {
    category: 'System',
    question: 'How do I update platform settings?',
    answer: 'Go to Settings → General to update the platform name, support email, contact number, timezone, and currency.',
  },
];