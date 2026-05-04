export default function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</p>
        ) : null}
        <h2 className="font-display text-[26px] leading-none">{title}</h2>
        {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
