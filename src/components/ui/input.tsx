"use client";

import { Eye, EyeOff } from "lucide-react";
import { type ElementType, type InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ElementType;
  error?: string;
}

export function Input({
  label,
  icon: Icon,
  error,
  type = "text",
  className = "",
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <label className="flex flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-text-primary font-body">
          {label}
        </span>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon size={18} />
          </div>
        )}
        <input
          type={inputType}
          className={`
            w-full bg-surface rounded-[22px] h-11 text-sm font-body
            placeholder:text-text-muted text-text-primary
            border-0 outline-none
            focus:ring-2 focus:ring-primary/30
            ${Icon ? "pl-11 pr-4" : "px-4"}
            ${isPassword ? "pr-11" : ""}
            ${error ? "ring-2 ring-error/30" : ""}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-error font-body">{error}</span>}
    </label>
  );
}
