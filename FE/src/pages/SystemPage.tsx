import React, { useMemo, useState } from "react";
import { useGetSystems } from "@/hooks/system/useGetSystems";
import { useCreateSystem } from "@/hooks/system/useCreateSystem";
import { useUpdateSystem } from "@/hooks/system/useUpdateSystem";
import { useDeleteSystem } from "@/hooks/system/useDeleteSystem";
import type { System } from "@/types/System.types";
import { toast } from "sonner";

type RequirementType = "MINIMUM" | "RECOMMENDED";

const emptyForm: System = {
  gameId: "",
  requirementType: "MINIMUM",
  os: "",
  processor: "",
  memory: "",
  graphics: "",
  storage: "",
  additionalNotes: "",
};

const SystemPage: React.FC = () => {
  const { data: systems, isLoading, isError } = useGetSystems();
  const createMutation = useCreateSystem();
  const updateMutation = useUpdateSystem();
  const deleteMutation = useDeleteSystem();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<System>(emptyForm);

  const isEditing = useMemo(() => !!selectedId, [selectedId]);

  const handleChange = <K extends keyof System>(key: K, value: System[K]) => {
    setForm((curr) => ({ ...curr, [key]: value }));
  };

  const handleSelect = (sys: System & { id?: string }) => {
    if (!("id" in sys) || !sys.id) {
      toast.error("System id not found");
      return;
    }
    setSelectedId(sys.id);
    setForm({
      gameId: sys.gameId,
      requirementType: sys.requirementType,
      os: sys.os,
      processor: sys.processor,
      memory: sys.memory,
      graphics: sys.graphics,
      storage: sys.storage,
      additionalNotes: sys.additionalNotes,
    });
  };

  const resetForm = () => {
    setSelectedId(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.gameId.trim()) {
      toast.error("Game ID is required");
      return;
    }

    if (isEditing && selectedId) {
      updateMutation.mutate(
        { id: selectedId, data: form },
        {
          onSuccess: () => {
            resetForm();
          },
        }
      );
    } else {
      createMutation.mutate(form, {
        onSuccess: () => {
          resetForm();
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this system requirement?")) {
      return;
    }
    deleteMutation.mutate(id);
    if (selectedId === id) {
      resetForm();
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading system requirements...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Failed to load system requirements.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">System Requirements</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Existing requirements</h3>
          <div className="border rounded-lg divide-y max-h-[480px] overflow-auto">
            {systems && systems.length > 0 ? (
              systems.map((sys: any) => (
                <div
                  key={sys.id}
                  className="flex flex-col gap-1 p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelect(sys)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      Game: <span className="font-semibold">{sys.gameId}</span>
                    </div>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                      {sys.requirementType}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    OS: {sys.os} • CPU: {sys.processor} • RAM: {sys.memory}
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(sys.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-gray-500">No system requirements found.</div>
            )}
          </div>
        </div>

        {/* Form */}
        <div>
          <h3 className="text-lg font-semibold">
            {isEditing ? "Edit system requirement" : "Create new system requirement"}
          </h3>
          <form onSubmit={handleSubmit} className="mt-3 space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Game ID</label>
              <input
                type="text"
                value={form.gameId}
                onChange={(e) => handleChange("gameId", e.target.value)}
                className="w-full rounded border px-2 py-1 text-sm"
                placeholder="Enter game id"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Requirement type</label>
              <select
                value={form.requirementType}
                onChange={(e) => handleChange("requirementType", e.target.value as RequirementType)}
                className="w-full rounded border px-2 py-1 text-sm"
              >
                <option value="MINIMUM">MINIMUM</option>
                <option value="RECOMMENDED">RECOMMENDED</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">OS</label>
                <input
                  type="text"
                  value={form.os}
                  onChange={(e) => handleChange("os", e.target.value)}
                  className="w-full rounded border px-2 py-1 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Processor</label>
                <input
                  type="text"
                  value={form.processor}
                  onChange={(e) => handleChange("processor", e.target.value)}
                  className="w-full rounded border px-2 py-1 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Memory</label>
                <input
                  type="text"
                  value={form.memory}
                  onChange={(e) => handleChange("memory", e.target.value)}
                  className="w-full rounded border px-2 py-1 text-sm"
                  placeholder="e.g. 8 GB RAM"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Graphics</label>
                <input
                  type="text"
                  value={form.graphics}
                  onChange={(e) => handleChange("graphics", e.target.value)}
                  className="w-full rounded border px-2 py-1 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Storage</label>
                <input
                  type="text"
                  value={form.storage}
                  onChange={(e) => handleChange("storage", e.target.value)}
                  className="w-full rounded border px-2 py-1 text-sm"
                  placeholder="e.g. 20 GB available space"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Additional notes</label>
              <textarea
                value={form.additionalNotes}
                onChange={(e) => handleChange("additionalNotes", e.target.value)}
                className="w-full rounded border px-2 py-1 text-sm min-h-[72px]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded border px-3 py-1 text-sm"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white disabled:opacity-60"
              >
                {isEditing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SystemPage;

