'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  addButtonLabel?: string;
}

export function DataTable<T extends { id: string }>({
  title,
  description,
  columns,
  data,
  searchPlaceholder = 'Search records...',
  searchKey,
  onAdd,
  onEdit,
  onDelete,
  onView,
  addButtonLabel = 'Add New',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');

  const filteredData = data.filter((row) => {
    if (!query || !searchKey) return true;
    const value = row[searchKey];
    if (typeof value === 'string') {
      return value.toLowerCase().includes(query.toLowerCase());
    }
    return true;
  });

  return (
    <div className="bg-white rounded-[10px] border border-[#E2E8F0] brand-shadow space-y-4 font-sans overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1E293B]">{title}</h2>
          {description && <p className="text-xs text-[#64748B] mt-0.5">{description}</p>}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          {searchKey && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
              <Input
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-[#F7FAF8] border-[#E2E8F0] rounded-[6px] w-full"
              />
            </div>
          )}

          {onAdd && (
            <Button
              onClick={onAdd}
              size="sm"
              className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold text-xs gap-1.5 shrink-0 h-9"
            >
              <Plus className="w-4 h-4" />
              {addButtonLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs text-[#1E293B]">
          <thead className="bg-[#F3F7F5] border-b border-[#E2E8F0] font-bold text-[#0092DF] uppercase tracking-wider text-[11px]">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete || onView) && (
                <th className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-[#F7FAF8] transition-colors">
                  {columns.map((col, idx) => (
                    <td key={idx} className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? '') : ''}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right space-x-1.5">
                      {onView && (
                        <button
                          onClick={() => onView(row)}
                          className="p-1.5 rounded-[4px] text-[#0092DF] hover:bg-[#E6F4FC] transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-1.5 rounded-[4px] text-[#86C127] hover:bg-[#F3F9E9] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-1.5 rounded-[4px] text-[#EF4444] hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)}
                  className="px-6 py-8 text-center text-[#64748B]"
                >
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

