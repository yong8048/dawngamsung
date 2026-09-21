"use client";

export const OptionPills = ({
  value,
  options,
  onChange,
  allowEmpty = false,
}: {
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  allowEmpty?: boolean;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(option => (
        <button
          type="button"
          key={option}
          onClick={() => onChange(option)}
          className={`rounded-full px-3 py-1.5 text-sm ${
            value === option ? "bg-amber text-night" : "border border-white/10 text-mist"
          }`}
        >
          {option}
        </button>
      ))}
      {allowEmpty && (
        <button
          type="button"
          onClick={() => onChange("")}
          className={`rounded-full px-3 py-1.5 text-sm ${
            value === "" ? "bg-white/10 text-mist" : "border border-white/10 text-muted"
          }`}
        >
          정보 없음
        </button>
      )}
    </div>
  );
};
