import type { UseMutationResult } from "@tanstack/react-query";

interface Props {
  id: string;
  name: string;
  setDelete: (value: boolean) => void;
  mutation: UseMutationResult<any, any, string>;
}

const AlertBox: React.FC<Props> = ({ id, name, setDelete, mutation }) => {
  const { mutate: fn, isPending } = mutation;

  const handleDelete = () => {
    fn(id, {
      onSuccess: () => {
        setDelete(false);
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40  backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md backdrop-blur-sm rounded-xl border border-gray-200 bg-white shadow-xl">

        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Delete Product</h2>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-sm">
            Are you sure you want to delete{" "}
            <span className="font-semibold">“{name}”</span>?
          </p>
          <p className="text-xs text-red-400">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 p-5">
          <button
            onClick={() => setDelete(false)}
            className="w-1/2 px-4 py-2 rounded-lg border border-gray-200 cursor-pointer duration-200 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            disabled={isPending}
            onClick={handleDelete}
            className="w-1/2 px-4 py-2 rounded-lg bg-red-600  border border-gray-200 cursor-pointer duration-200 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertBox;