interface LoaderProps {
  label?: string;
}

export default function Loader({ label = 'Loading...' }: LoaderProps) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__spinner"></div>
      <p className="loader__label">{label}</p>
    </div>
  );
}
