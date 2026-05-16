"use client";

import { useEffect, useState } from "react";

// Random images for contact modal (except designers page)
const RANDOM_MODAL_IMAGES = [
  "/ikonki dlya svysi/-5413449657339738695_121.jpg",
  "/ikonki dlya svysi/1886f1bc69f845da9025a9a291080432 (2).jpg",
  "/ikonki dlya svysi/339f3802-8a1c-46da-b454-b27337dea6f5.JPG",
  "/ikonki dlya svysi/7T2A4295.jpg",
  "/ikonki dlya svysi/DSC08102 копия.jpg",
  "/ikonki dlya svysi/IMG_1537-HDR.jpg",
  "/ikonki dlya svysi/RED_1232.JPG",
];

function encodePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

function getRandomImage() {
  const raw = RANDOM_MODAL_IMAGES[Math.floor(Math.random() * RANDOM_MODAL_IMAGES.length)];
  // Encode each path segment for proper URL handling
  return encodePath(raw);
}

export function ContactModal({
  onClose,
  imageSrc,
  useRandomImage = true,
}: {
  onClose: () => void;
  imageSrc?: string;
  useRandomImage?: boolean;
}) {
  const [randomSrc] = useState(() => useRandomImage ? getRandomImage() : (imageSrc || "/hero.webp"));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Lock scroll completely
  useEffect(() => {
    const original = document.body.style.overflow;
    const originalPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = original;
      document.body.style.paddingRight = originalPadding;
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

  async function onSubmit() {
    if (status === "sending") return;

    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (cleanName.length < 2) {
      setStatus("error");
      setErrorText("Проверьте имя.");
      return;
    }
    if (cleanPhone.length < 7) {
      setStatus("error");
      setErrorText("Проверьте телефон.");
      return;
    }

    setStatus("sending");
    setErrorText("");
    try {
      const res = await fetch("/api/contact-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, phone: cleanPhone, comment: comment.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorText(data?.error || `Ошибка отправки (${res.status})`);
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setErrorText("Не удалось отправить. Проверьте соединение.");
      setStatus("error");
    }
  }

  return (
    <div 
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/60 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-auto max-w-3xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid lg:grid-cols-[320px,400px]">
          <div className="p-5 order-2 lg:order-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">Связаться с нами</h3>
              <button type="button" onClick={onClose} className="h-8 w-8 border hover:bg-gray-50 flex items-center justify-center">✕</button>
            </div>

            {status === "sent" ? (
              <div className="space-y-3">
                <div className="bg-green-50 p-4 text-sm">Заявка отправлена. Мы свяжемся с вами.</div>
                <button onClick={onClose} className="w-full h-11 bg-gray-900 text-white">Закрыть</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500">ИМЯ</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 border px-3 mt-1" placeholder="Ваше имя" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">ТЕЛЕФОН</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-10 border px-3 mt-1" placeholder="+7..." />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">КОММЕНТАРИЙ</label>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="w-full border px-3 py-2 resize-none mt-1" placeholder="Опишите запрос..." />
                </div>
                {status === "error" && <div className="text-red-600 text-sm bg-red-50 p-3">{errorText}</div>}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={onSubmit} disabled={status === "sending"} className="h-11 bg-gray-900 text-white disabled:bg-gray-400">{status === "sending" ? "Отправка..." : "Отправить"}</button>
                  <button onClick={onClose} className="h-11 border">Закрыть</button>
                </div>
              </div>
            )}
          </div>
          <div className="relative hidden lg:block order-1 lg:order-2 h-[500px] lg:h-auto">
            <img src={randomSrc} alt="" className="h-full w-full object-cover object-center" loading="eager" />
          </div>
        </div>
      </div>
    </div>
  );
}
