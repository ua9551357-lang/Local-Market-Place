export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  receiverId: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

export interface Thread {
  id: string;
  customerId: string;
  providerId: string;
  lastMessageAt: string;
  customer: { id: string; name: string; avatarUrl?: string };
  provider: { user: { name: string; avatarUrl?: string } };
  messages: Message[];
}