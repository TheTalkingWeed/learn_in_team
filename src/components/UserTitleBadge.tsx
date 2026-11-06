// Small pill showing whether a user is a student or a teacher.
export default function UserTitleBadge({ title }: { title?: string }) {
  if (!title) return null;
  const isTeacher = title === "Teacher";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
        isTeacher ? "bg-fuchsia-100 text-fuchsia-700" : "bg-purple-100 text-purple-700"
      }`}
    >
      <i className={isTeacher ? "pi pi-briefcase" : "pi pi-book"} style={{ fontSize: "0.7rem" }} />
      {title}
    </span>
  );
}
