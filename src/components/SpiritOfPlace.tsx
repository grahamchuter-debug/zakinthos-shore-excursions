import { subjectImages } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { spiritOfPlace } from "@/data/homepage";

export function SpiritOfPlace() {
  const image = subjectImages["ionian"] ?? subjectImages.coastal;

  return (
    <section className="section-padding bg-gradient-to-b from-coastal-50 via-white to-white border-b border-coastal-100">
      <div className="container-wide">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="section-eyebrow">The Ionian Islands</p>
            <h2 className="section-title mt-2 max-w-xl">{spiritOfPlace.title}</h2>
            {spiritOfPlace.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="mt-4 text-base leading-relaxed text-gray-600 first:mt-6 first:text-gray-700"
              >
                {paragraph}
              </p>
            ))}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { emoji: "🌊", label: "Ionian Sea" },
                { emoji: "🚤", label: "Blue Caves" },
                { emoji: "📸", label: "Navagio" },
              ].map((item) => (
                <div key={item.label} className="card-feature text-center">
                  <span className="text-2xl" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
            <ResponsiveImage
              image={image}
              role="card"
              imgClassName="h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-coastal-900/30 to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
