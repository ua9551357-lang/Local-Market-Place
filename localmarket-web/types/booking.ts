export interface CreateBookingPayload {
  providerId: string;
  serviceId: string;
  date: string;
  time: string;
  address?: string;
  issueDesc?: string;
  amount: number;
  paymentMethod: 'cash' | 'online';
}

export interface Booking {
  id: string;
  status: string;
  amount: string;
  date: string;
  time: string;
  provider: { user: { name: string } };
  service: { title: string };
}