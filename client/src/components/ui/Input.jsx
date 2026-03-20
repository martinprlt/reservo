import clsx from 'clsx';

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        className={clsx(
          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
