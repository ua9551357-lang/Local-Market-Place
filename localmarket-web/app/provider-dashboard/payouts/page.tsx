'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ProviderSidebar } from '@/components/dashboard/ProviderSidebar';
import { usePayoutsOverview, useAddPayoutMethod, useRequestPayout } from '@/hooks/usePayouts';

const METHOD_ICONS: Record<string, string> = { bank: '🏦', jazzcash: '📱', easypaisa: '📱' };

function AddMethodModal({ onClose, onSave, isSaving }: { onClose: () => void; onSave: (d: any) => void; isSaving: boolean }) {
  const [type, setType] = useState('jazzcash');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-card p-5 w-full max-w-sm">
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">Add Payout Method</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-neutral-900">Method Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm">
              <option value="jazzcash">JazzCash</option>
              <option value="easypaisa">Easypaisa</option>
              <option value="bank">Bank Account</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-900">Account Name</label>
            <input value={accountName} onChange={(e) => setAccountName(e.target.value)} className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-900">Account Number</label>
            <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 border border-neutral-200 text-neutral-600 text-sm font-medium py-2 rounded-lg">Cancel</button>
          <button
            onClick={() => accountName && accountNumber && onSave({ type, accountName, accountNumber })}
            disabled={isSaving}
            className="flex-1 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PayoutsContent() {
  const { data, isLoading } = usePayoutsOverview();
  const addMethod = useAddPayoutMethod();
  const requestPayout = useRequestPayout();

  const [modalOpen, setModalOpen] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState('');

  const handleAddMethod = (payload: any) => {
    addMethod.mutate(payload, {
      onSuccess: () => { toast.success('Payout method added'); setModalOpen(false); },
      onError: () => toast.error('Failed to add method'),
    });
  };

  const handleRequest = () => {
    if (!requestAmount || !selectedMethodId) {
      toast.error('Enter amount and select a payout method');
      return;
    }
    requestPayout.mutate(
      { amount: Number(requestAmount), payoutMethodId: selectedMethodId },
      {
        onSuccess: () => { toast.success('Payout requested'); setRequestAmount(''); },
        onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to request payout'),
      },
    );
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <ProviderSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Payouts</h1>
            <p className="text-sm text-neutral-400 mt-0.5">Manage your payout methods and history</p>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-neutral-400">Loading...</p>
        ) : (
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Balance + Request */}
            <div className="bg-white border border-neutral-200 rounded-card p-5">
              <p className="text-xs text-neutral-400">Current Balance</p>
              <p className="text-3xl font-bold text-brand-700 mt-1">PKR {data.currentBalance}</p>

              <div className="mt-4 space-y-3">
                <input
                  type="number"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  placeholder="Amount to withdraw"
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <select
                  value={selectedMethodId}
                  onChange={(e) => setSelectedMethodId(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Select payout method</option>
                  {data.methods.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.type} — {m.accountNumber}</option>
                  ))}
                </select>
                <button
                  onClick={handleRequest}
                  disabled={requestPayout.isPending || data.methods.length === 0}
                  className="w-full bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-60"
                >
                  {requestPayout.isPending ? 'Requesting...' : 'Request Payout'}
                </button>
                {data.methods.length === 0 && (
                  <p className="text-xs text-neutral-400">Add a payout method first.</p>
                )}
              </div>
            </div>

            {/* Payout methods */}
            <div className="bg-white border border-neutral-200 rounded-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-900">Payout Methods</h3>
                <button onClick={() => setModalOpen(true)} className="flex items-center gap-1 text-xs text-brand-700 font-medium">
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {data.methods.length === 0 && <p className="text-xs text-neutral-400">No methods added yet.</p>}
                {data.methods.map((m: any) => (
                  <div key={m.id} className="flex items-center gap-3 border border-neutral-100 rounded-lg p-3">
                    <span className="text-lg">{METHOD_ICONS[m.type]}</span>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 capitalize">{m.type}</p>
                      <p className="text-xs text-neutral-400">{m.accountName} · {m.accountNumber}</p>
                    </div>
                    {m.isDefault && (
                      <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-pill bg-brand-100 text-brand-700">Default</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="bg-white border border-neutral-200 rounded-card p-5">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Payout History</h3>
              <div className="space-y-2">
                {data.history.length === 0 && <p className="text-xs text-neutral-400">No payouts yet.</p>}
                {data.history.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between text-sm border-b border-neutral-50 pb-2 last:border-0">
                    <div>
                      <p className="text-neutral-900 font-medium">PKR {p.amount}</p>
                      <p className="text-xs text-neutral-400">{new Date(p.requestedAt).toLocaleDateString()}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-pill ${
                        p.status === 'completed' ? 'bg-brand-100 text-brand-700' :
                        p.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {modalOpen && (
          <AddMethodModal onClose={() => setModalOpen(false)} onSave={handleAddMethod} isSaving={addMethod.isPending} />
        )}
      </main>
    </div>
  );
}

export default function ProviderPayoutsPage() {
  return (
    <ProtectedRoute allowedRoles={['provider']}>
      <PayoutsContent />
    </ProtectedRoute>
  );
}