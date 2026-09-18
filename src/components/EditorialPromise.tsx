import { editorialPromise } from "@/data/editorial";

/**
 * World 2.0 Editorial Promise — reusable trust statement.
 * Editorial tone, not promotional. Editor's Choice badge system stays separate.
 */
export function EditorialPromise({ className = "" }: { className?: string }) {
  const content = editorialPromise;

  return (
    <section className={`section-padding bg-[#f7f5f1] ${className}`.trim()}>
      <div className="container-wide max-w-3xl">
        <p className="section-eyebrow">{content.eyebrow}</p>
        <h2 className="section-title mt-2">{content.title}</h2>
        <div className="mt-8 rounded-2xl border border-sandstone-300/50 bg-white/85 px-6 py-7 sm:px-8 sm:py-8">
          <p className="font-display text-lg leading-relaxed text-gray-800 sm:text-xl">
            {content.lead}
          </p>
          <ul className="mt-6 space-y-3 text-base leading-relaxed text-gray-700">
            {content.points.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coastal-600" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-gray-600">{content.closing}</p>
        </div>
      </div>
    </section>
  );
}
