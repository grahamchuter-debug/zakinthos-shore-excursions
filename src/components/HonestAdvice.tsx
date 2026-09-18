import Link from "next/link";
import { honestAdviceContent } from "@/data/homepage";

export function HonestAdvice() {
  const content = honestAdviceContent;

  return (
    <section className="section-padding bg-white">
      <div className="container-wide max-w-4xl">
        <p className="section-eyebrow">{content.eyebrow}</p>
        <h2 className="section-title mt-2">{content.title}</h2>
        <p className="section-subtitle">{content.subtitle}</p>

        <div className="mt-10 space-y-8">
          <div className="card-feature">
            <h3 className="font-display text-xl font-bold text-gray-900">
              {content.independent.title}
            </h3>
            <p className="mt-3 text-gray-700 leading-relaxed">{content.independent.body}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-gray-700">
              {content.independent.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-coastal-600">✓</span> {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-600">{content.independent.note}</p>
          </div>

          <div className="card-accent">
            <h3 className="font-display text-xl font-bold text-gray-900">
              {content.organised.title}
            </h3>
            <p className="mt-3 text-gray-700 leading-relaxed">{content.organised.body}</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {content.organised.items.map((item) => (
                <li key={item.label} className="flex items-start gap-2">
                  <span className="text-maple-600 mt-0.5">→</span>
                  <span>
                    <strong>{item.label}</strong> — {item.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {content.links.map((link) => (
            <Link key={link.href} href={link.href} className="btn-secondary text-sm">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
