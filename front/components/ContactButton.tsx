"use client";

import { useState } from "react";
import { ContactModal } from "./ContactModal";

interface ContactButtonProps {
  children: React.ReactNode;
  className?: string;
  imageSrc?: string;
  /** If true, use random image from folder. Default: true. Set false for designers page. */
  useRandomImage?: boolean;
}

export function ContactButton({ children, className, imageSrc, useRandomImage = true }: ContactButtonProps) {
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
          useRandomImage={useRandomImage}
        />
      )}
    </>
  );
}
