export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const faqs: FAQItem[] = [
  {
    category: 'Booking',
    question: 'How do I book a service?',
    answer: 'Browse services, select a provider, choose a service and time slot on their profile, then confirm your booking with your preferred payment method.',
  },
  {
    category: 'Booking',
    question: 'Can I cancel a booking?',
    answer: 'Yes. Go to Dashboard → Bookings, open the booking, and if it\'s still pending or confirmed you can message the provider to cancel. Once completed, bookings cannot be cancelled.',
  },
  {
    category: 'Booking',
    question: 'How do I reschedule a booking?',
    answer: 'Message your provider directly from the booking details page to arrange a new time — provider approval is required for changes.',
  },
  {
    category: 'Payments',
    question: 'What payment methods are supported?',
    answer: 'You can pay with Cash on Service, or online via card/wallet at checkout. Online payments are processed securely through Stripe.',
  },
  {
    category: 'Payments',
    question: 'When am I charged for online payments?',
    answer: 'For online payments, the charge is authorized when you confirm your booking. For Cash on Service, you pay the provider directly after the job is done.',
  },
  {
    category: 'Payments',
    question: 'Can I get a refund?',
    answer: 'Refunds are handled case-by-case. Contact support with your booking ID and reason, and our team will review it within 24-48 hours.',
  },
  {
    category: 'Providers',
    question: 'How do I become a service provider?',
    answer: 'Click "For Providers" in the navbar, then "Apply as a Provider". Fill in your details and submit — our admin team reviews applications within 24-48 hours.',
  },
  {
    category: 'Providers',
    question: 'Why is my provider application still pending?',
    answer: 'Applications are manually reviewed for quality and trust. You\'ll receive a notification the moment your application is approved or rejected.',
  },
  {
    category: 'Providers',
    question: 'How are providers verified?',
    answer: 'Verified providers have been reviewed by our admin team for identity, experience, and service quality before being marked with a "Verified" badge.',
  },
  {
    category: 'Account',
    question: 'How do I change my password?',
    answer: 'Go to Dashboard → Settings → Change Password. Enter your current password and your new password to update it.',
  },
  {
    category: 'Account',
    question: 'How do I update my profile information?',
    answer: 'Go to Dashboard → Settings and edit your name, phone, or city, then click Save Changes.',
  },
  {
    category: 'Messaging',
    question: 'How do I message a provider?',
    answer: 'Open any provider\'s profile page and click the "Message" button, or go to Dashboard → Messages to view your existing conversations.',
  },
];