// Red message under a form field, shown only when `show` is true.
export default function FieldError({
  show,
  message = "This field is required.",
}: {
  show: boolean;
  message?: string;
}) {
  if (!show) return null;
  return (
    <small className="flex items-center gap-1 text-red-600 text-sm animate-fade-in [animation-duration:0.2s]">
      <i className="pi pi-exclamation-circle" style={{ fontSize: "0.8rem" }} />
      {message}
    </small>
  );
}
