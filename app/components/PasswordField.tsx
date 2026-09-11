"use client";

import { useState } from "react";

const DOTS = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="6" cy="12" r="2.1" fill="#111" />
    <circle cx="12" cy="12" r="2.1" fill="#111" />
    <circle cx="18" cy="12" r="2.1" fill="#111" />
  </svg>
);

const EYE = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" fill="#111" />
  </svg>
);

type Props = {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  autoComplete?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PasswordField({
  id,
  name,
  value,
  defaultValue,
  autoComplete = "current-password",
  required,
  onChange
}: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className="pw-wrap">
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
      />
      <button
        className="pw-toggle"
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      >
        {show ? EYE : DOTS}
      </button>
    </div>
  );
}
