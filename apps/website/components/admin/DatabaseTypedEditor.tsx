export type DatabaseTypedFieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "datetime-local";

export interface DatabaseTypedFieldOption {
  label: string;
  value: string;
}

export interface DatabaseTypedField {
  key: string;
  label: string;
  type: DatabaseTypedFieldType;
  placeholder?: string;
  helperText?: string;
  options?: DatabaseTypedFieldOption[];
  fullWidth?: boolean;
  step?: string;
  min?: string;
  disabled?: boolean;
}

interface DatabaseTypedEditorProps {
  fields: DatabaseTypedField[];
  values: Record<string, string | boolean>;
  onChange: (key: string, value: string | boolean) => void;
  readOnly?: boolean;
}

export default function DatabaseTypedEditor({
  fields,
  values,
  onChange,
  readOnly = false,
}: DatabaseTypedEditorProps) {
  return (
    <div className="grid gap-[14px] md:grid-cols-2">
      {fields.map((field) => {
        const value = values[field.key] ?? (field.type === "checkbox" ? false : "");
        const wrapperClassName = field.fullWidth ? "md:col-span-2" : "";

        return (
          <div key={field.key} className={wrapperClassName}>
            {field.type === "checkbox" ? (
              <label className="flex items-start gap-[10px] rounded-[10px] border border-[rgba(245,237,214,0.08)] bg-[rgba(245,237,214,0.02)] px-[12px] py-[11px]">
                <input
                  type="checkbox"
                  checked={Boolean(value)}
                  disabled={readOnly || field.disabled}
                  onChange={(event) => onChange(field.key, event.target.checked)}
                  className="mt-[2px] h-[14px] w-[14px] rounded border-[rgba(245,237,214,0.2)] bg-[var(--color-dark-bg)] text-[var(--color-gold)]"
                />
                <span>
                  <span className="block text-[12px] font-semibold text-[var(--color-cream)]">{field.label}</span>
                  {field.helperText ? (
                    <span className="mt-[4px] block text-[11px] leading-relaxed text-[rgba(245,237,214,0.38)]">{field.helperText}</span>
                  ) : null}
                </span>
              </label>
            ) : (
              <>
                <label className="mb-[6px] block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.35)]">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    value={String(value)}
                    readOnly={readOnly || field.disabled}
                    onChange={(event) => onChange(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    rows={field.fullWidth ? 5 : 4}
                    className="w-full rounded-[8px] border border-[rgba(245,237,214,0.1)] bg-[var(--color-dark-bg)] px-[12px] py-[10px] text-[13px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.28)] focus:outline-none focus:border-[var(--color-gold)] resize-none"
                  />
                ) : field.type === "select" ? (
                  <select
                    value={String(value)}
                    disabled={readOnly || field.disabled}
                    onChange={(event) => onChange(field.key, event.target.value)}
                    className="w-full rounded-[8px] border border-[rgba(245,237,214,0.1)] bg-[var(--color-dark-bg)] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                  >
                    {(field.options ?? []).map((option) => (
                      <option key={`${field.key}:${option.value}`} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={String(value)}
                    readOnly={readOnly || field.disabled}
                    min={field.min}
                    step={field.step}
                    onChange={(event) => onChange(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-[8px] border border-[rgba(245,237,214,0.1)] bg-[var(--color-dark-bg)] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.28)] focus:outline-none focus:border-[var(--color-gold)]"
                  />
                )}
                {field.helperText ? (
                  <p className="mt-[5px] text-[11px] leading-relaxed text-[rgba(245,237,214,0.38)]">{field.helperText}</p>
                ) : null}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
