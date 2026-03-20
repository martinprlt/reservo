export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-secondary',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
  };

  return (
    <button
      className={`px-4 py-2 rounded font-medium transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
