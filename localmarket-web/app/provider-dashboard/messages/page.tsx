'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ProviderSidebar } from '@/components/dashboard/ProviderSidebar';
import { ThreadList } from '@/components/messaging/ThreadList';
import { ChatPanel } from '@/components/messaging/ChatPanel';
import { useThreads } from '@/hooks/useMessages';
import { useAuthStore } from '@/store/authStore';

function MessagesContent() {
  const { user } = useAuthStore();
  const { data: threads, isLoading } = useThreads();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const selectedThread = threads?.find((t: any) => t.id === selectedThreadId);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <ProviderSidebar />
      <main className="flex-1 h-full flex bg-white">
        {isLoading ? (
          <p className="text-sm text-neutral-400 p-6">Loading conversations...</p>
        ) : (
          <>
            <ThreadList
              threads={threads || []}
              selectedId={selectedThreadId}
              onSelect={setSelectedThreadId}
              currentUserRole="provider"
            />
            {selectedThread ? (
              <ChatPanel
                threadId={selectedThread.id}
                receiverId={selectedThread.customerId}
                receiverName={selectedThread.customer.name}
                onBack={() => setSelectedThreadId(null)}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-neutral-400">
                Select a conversation to start chatting
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function ProviderMessagesPage() {
  return (
    <ProtectedRoute allowedRoles={['provider']}>
      <MessagesContent />
    </ProtectedRoute>
  );
}