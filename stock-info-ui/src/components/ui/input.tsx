import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  suggestions?: { symbol: string; name: string; exchange: string }[];
  onSuggestionClick?: (s: { symbol: string; name: string; exchange: string }) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, suggestions = [], onSuggestionClick, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className
          )}
          ref={ref}
          {...props}
        />

        {suggestions.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg max-h-60 overflow-y-auto text-sm">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => onSuggestionClick && onSuggestionClick(s)}
              >
                <span className="font-medium">{s.symbol}</span> — {s.name}{" "}
                <span className="text-xs text-gray-500">
                  ({s.exchange})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
