"use client";

export default function TeachingWorksheet({ params }: { params: { templateId: string } }) {
  return (
    <div className="p-[32px] font-sans">
      <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Worksheet</h1>
      <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">
        Template: {params.templateId}
      </p>
      <p className="text-[13px] text-[rgba(245,237,214,0.3)] mt-[24px]">
        Worksheet not yet built for this class.
      </p>
    </div>
  );
}
