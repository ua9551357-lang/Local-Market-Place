'use client';

import { Thread } from '@/types/message';

export function ThreadList({
  threads,
  selectedId,
  onSelect,
  currentUserRole,
}: {
  threads: Thread[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  currentUserRole: string;
}) {
  return (
    <div
      className={`w-full md:w-72 border-r border-neutral-200 overflow-y-auto flex-shrink-0 ${
        selectedId ? 'hidden md:block' : 'block'
      }`}
    >
      {threads.length === 0 && (
        <p className="text-sm text-neutral-400 p-4">No conversations yet.</p>
      )}
      {threads.map((thread) => {
        const displayName =
          currentUserRole === 'provider' ? thread.customer.name : thread.provider.user.name;
        const lastMessage = thread.messages[0];

        return (
          <button
            key={thread.id}
            onClick={() => onSelect(thread.id)}
            className={`w-full flex items-center gap-3 p-3 border-b border-neutral-100 text-left hover:bg-neutral-50 transition-colors ${
              selectedId === thread.id ? 'bg-brand-50' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm flex-shrink-0">
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-neutral-900 truncate">{displayName}</p>
              <p className="text-xs text-neutral-400 truncate">
                {lastMessage?.body || 'No messages yet'}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}