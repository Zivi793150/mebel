"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, ExternalLink, Image as ImageIcon } from "lucide-react";

interface SortableItemProps {
  id: string;
  label: string;
  sublabel?: string;
  isActive: boolean;
  image?: string;
  onClick: () => void;
  onDelete: () => void;
}

export function SortableItem({
  id,
  label,
  sublabel,
  isActive,
  image,
  onClick,
  onDelete,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 rounded-xl border p-2 transition-all ${
        isActive
          ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white shadow-md"
          : "border-black/5 bg-white/40 hover:bg-white/80 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className={`cursor-grab p-1 opacity-40 hover:opacity-100 ${
          isActive ? "text-white" : "text-[color:var(--fg)]"
        }`}
      >
        <GripVertical size={16} />
      </button>

      <div
        onClick={onClick}
        className="flex flex-1 cursor-pointer items-center gap-3 overflow-hidden"
      >
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
          {image ? (
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center opacity-20">
              <ImageIcon size={16} />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col overflow-hidden text-left">
          <span className={`truncate text-sm font-bold ${isActive ? "text-white" : "text-[color:var(--fg)]"}`}>
            {label}
          </span>
          {sublabel && (
            <span className={`truncate text-[10px] opacity-70 ${isActive ? "text-white" : "text-[color:var(--muted)]"}`}>
              {sublabel}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
          isActive
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20"
        }`}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
