import React, { useEffect, useMemo, useState } from "react";
import { STUDENT_NAME, STUDENT_NUMBER, PROFILE_IMAGES } from "../constants";

export default function AboutTab(): JSX.Element {
  const candidateImages = useMemo(() => {
    const explicit: string[] = [];
    (PROFILE_IMAGES || [])
      .filter(Boolean)
      .forEach((name) => {
        const normalized = name.trim();
        if (!normalized) return;
        if (normalized.startsWith("/")) {
          explicit.push(normalized);
        } else {
          explicit.push(`/images/${normalized}`);
          explicit.push(`/${normalized}`); // also try at public root
        }
      });

    const image = [
      "/images/profile.png",
    ];

    const list = explicit.length > 0 ? explicit : image;
    // De-duplicate while preserving order
    return Array.from(new Set(list));
  }, [STUDENT_NUMBER]);

  const [available, setAvailable] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    setAvailable([]);
    candidateImages.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        if (!cancelled) setAvailable((prev) => (prev.includes(src) ? prev : [...prev, src]));
      };
      img.onerror = () => {};
      img.src = src;
    });
    return () => {
      cancelled = true;
    };
  }, [candidateImages]);

  return (
    <div id="about" className="text-[--foreground] p-6">
      <div className="mx-auto w-full max-w-5xl flex flex-col sm:flex-row gap-6 items-start">
        <div className="w-full sm:w-1/3 flex flex-col gap-3">
          {available.map((src) => (
            <img
              key={src}
              src={src}
              alt={STUDENT_NAME}
              className="w-full rounded-lg shadow-sm border border-[--foreground]/10 object-cover"
              loading="lazy"
            />
          ))}
          {available.length === 0 && (
            <div className="text-sm opacity-70">
              No images were resolved. Ensure your file exists under <code>/public/images</code> (e.g., <code>/public/images/profile.png</code>)
              and that <code>PROFILE_IMAGES</code> in <code>app/constants.ts</code> matches the path (e.g., <code>["profile.png"]</code> or <code>["/profile.png"]</code> if the file is directly under <code>/public</code>).
            </div>
          )}
        </div>

        <div className="w-full sm:w-2/3">
          <h2 className="text-2xl font-bold mb-2">{STUDENT_NAME}</h2>
          <p className="mb-4 text-sm opacity-80">Student Number: {STUDENT_NUMBER}</p>

          <div className="space-y-3 leading-relaxed">
            <p>
              Hello! My name is Minh Duc Dang. You can call me Max.
            </p>
            <p>
            
            </p>
          </div>
        </div>
      </div>

      {/* Demo video section */}
      <div className="mx-auto w-full max-w-5xl mt-10 text-center">
        <h3 className="text-xl font-semibold mb-3">Demo video</h3>
        <video className="w-full max-w-3xl mx-auto block rounded-lg border border-[--foreground]/10 shadow-sm" controls preload="metadata" playsInline>
          <source src="/videos/demo.mp4" type="video/mp4" />
        </video>
        <p className="mt-3 text-sm opacity-80">
          Watch the demo video to see how to use the website.
        </p>
      </div>
    </div>
  );
}


