"use client";

import { useState } from "react";
import { ContactModal } from "./ContactModal";

interface ContactButtonProps {
  children: React.ReactNode;
  className?: string;
  imageSrc?: string;
}

export function ContactButton({ children, className, imageSrc }: ContactButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={className}
      >
        {children}
      </button>
      {isOpen && (
        <ContactModal
          onClose={() => setIsOpen(false)}
          imageSrc={imageSrc}
        />
      )}
    </>
  );
}
