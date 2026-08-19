'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusPill } from '@/components/admin/StatusPill';
import { Pagination } from '@/components/admin/Pagination';
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/useAdmin';

const PAGE_SIZE = 6;

function CategoryModal({
  initial,
  onClose,
  onSave,
  isSaving,
}: {
  initial?: { id: string; name: string; icon?: string };
  onClose: () => void;
  onSave: (data: { name: string; icon?: string }) => void;
  isSaving: boolean;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [icon, setIcon] = useState(initial?.icon || '🔧');

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-card p-5 w-full max-w-sm">
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">
          {initial ? 'Edit Category' : 'Add Category'}
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-neutral-900">Icon (emoji)</label>
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-900">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Painting"
              className="mt-1 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 border border-neutral-200 text-neutral-600 text-sm font-medium py-2 rounded-lg hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            onClick={() => name.trim() && onSave({ name: name.trim(), icon })}
            disabled={isSaving || !name.trim()}
            className="flex-1 bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoriesContent() {
  const { data: categories, isLoading } = useAdminCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const filtered = (categories || []).filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSave = (data: { name: string; icon?: string }) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, ...data }, {
        onSuccess: () => { toast.success('Category updated'); setModalOpen(false); setEditing(null); },
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => { toast.success('Category created'); setModalOpen(false); },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this category? Providers linked to it will be affected.')) {
      deleteMutation.mutate(id, { onSuccess: () => toast.success('Category deleted') });
    }
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-neutral-100">
      <AdminSidebar />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">Categories</h1>

        <div className="bg-white border border-neutral-200 rounded-card overflow-hidden">
          <AdminPageHeader
            title="Categories"
            subtitle="Manage service categories"
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search categories..."
            action={{ label: 'Add Category', onClick: () => { setEditing(null); setModalOpen(true); } }}
          />

          {isLoading ? (
            <p className="text-sm text-neutral-400 p-5">Loading...</p>
          ) : (
            <>
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-xs text-neutral-400 text-left border-b border-neutral-100">
                    <th className="p-4">Icon</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Providers</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((c: any) => (
                    <tr key={c.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                      <td className="p-4 text-lg">{c.icon || '🔧'}</td>
                      <td className="p-4 text-neutral-900 font-medium">{c.name}</td>
                      <td className="p-4 text-neutral-600">{c.providerCount}</td>
                      <td className="p-4"><StatusPill status="active" /></td>
                      <td className="p-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => { setEditing(c); setModalOpen(true); }}
                            className="text-xs text-brand-700 font-medium hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="text-xs text-danger-500 font-medium hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>

        {modalOpen && (
          <CategoryModal
            initial={editing}
            onClose={() => { setModalOpen(false); setEditing(null); }}
            onSave={handleSave}
            isSaving={createMutation.isPending || updateMutation.isPending}
          />
        )}
      </main>
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <CategoriesContent />
    </ProtectedRoute>
  );
}