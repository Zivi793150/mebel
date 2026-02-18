module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/front/lib/constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BRAND",
    ()=>BRAND,
    "CATALOG_CATEGORIES",
    ()=>CATALOG_CATEGORIES,
    "CONTACTS",
    ()=>CONTACTS,
    "NAV_LINKS",
    ()=>NAV_LINKS
]);
const BRAND = {
    name: "Koenig Room"
};
const CONTACTS = {
    phoneDisplay: "+7 (906) 230-20-22",
    phoneHref: "tel:+79062302022",
    email: "salon@koenigroom.ru",
    address: "г. Калининград, ул. М. Гвардии 34к2"
};
const CATALOG_CATEGORIES = [
    {
        title: "Шторы и ткани в интерьере",
        description: "Премиальные ткани, пошив, установка",
        imageSrc: "/catalog/decor.jpg",
        emphasis: true
    },
    {
        title: "Жалюзи",
        description: "Точный свет и приватность",
        imageSrc: "/catalog/blinds.jpg"
    },
    {
        title: "Римские шторы",
        description: "Чистая геометрия и мягкий объём",
        imageSrc: "/gray_hero.jpg"
    },
    {
        title: "Декоративные карнизы",
        description: "Акцент на деталях и архитектуре окна",
        imageSrc: "/catalog/rails.jpg"
    },
    {
        title: "Декор, фурнитура, аксессуары",
        description: "Кисти, подхваты, ленты, материалы",
        imageSrc: "/catalog/rugs.jpg"
    },
    {
        title: "Ковры",
        description: "Тактильность, тепло, завершённость",
        imageSrc: "/catalog/bed.jpg"
    },
    {
        title: "Постельное бельё",
        description: "Комфорт и благородные фактуры",
        imageSrc: "/2foto_dark.jpg"
    },
    {
        title: "Интерьерные покрывала и подушки",
        description: "Финальный штрих к интерьеру",
        imageSrc: "/catalog/pillows.jpg"
    }
];
const NAV_LINKS = [
    {
        label: "Каталог",
        href: "#catalog"
    },
    {
        label: "Шторы",
        href: "#curtains"
    },
    {
        label: "Отзывы",
        href: "#reviews"
    },
    {
        label: "FAQ",
        href: "#faq"
    },
    {
        label: "Контакты",
        href: "#contacts"
    }
];
}),
"[project]/front/components/Container.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Container",
    ()=>Container
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function Container({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",
        children: children
    }, void 0, false, {
        fileName: "[project]/front/components/Container.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
}),
"[project]/front/components/icons.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IconInstagram",
    ()=>IconInstagram,
    "IconWhatsapp",
    ()=>IconWhatsapp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function IconInstagram({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z",
                stroke: "currentColor",
                strokeWidth: "1.6"
            }, void 0, false, {
                fileName: "[project]/front/components/icons.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
                stroke: "currentColor",
                strokeWidth: "1.6"
            }, void 0, false, {
                fileName: "[project]/front/components/icons.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17.5 6.5h.01",
                stroke: "currentColor",
                strokeWidth: "2.2",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/front/components/icons.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/front/components/icons.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
function IconWhatsapp({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 21a9 9 0 1 0-7.8-4.5L3 21l4.7-1.2A9 9 0 0 0 12 21Z",
                stroke: "currentColor",
                strokeWidth: "1.6",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/front/components/icons.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9.1 9.3c.2-.6.5-.7.8-.7h.6c.2 0 .4.1.5.4l.7 1.7c.1.2.1.5 0 .7l-.4.6c-.1.2-.1.5 0 .7.5.9 1.5 1.9 2.4 2.4.2.1.5.1.7 0l.6-.4c.2-.1.5-.1.7 0l1.7.7c.3.1.4.3.4.5v.6c0 .3-.1.6-.7.8-.7.2-2.2.3-4.6-1.2-2.4-1.6-4-4.5-4.1-4.9-.1-.5-.2-1.9.1-2.6Z",
                fill: "currentColor",
                opacity: "0.9"
            }, void 0, false, {
                fileName: "[project]/front/components/icons.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/front/components/icons.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
}),
"[project]/front/components/ThemeToggle.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
}
function ThemeToggle() {
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("light");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const saved = window.localStorage.getItem("theme");
        const initial = saved === "dark" || saved === "light" ? saved : "light";
        setTheme(initial);
        applyTheme(initial);
    }, []);
    function toggle() {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        applyTheme(next);
        window.localStorage.setItem("theme", next);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: toggle,
        className: "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
        "aria-label": "Переключить тему",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-sm leading-none",
            children: theme === "dark" ? "☾" : "☀"
        }, void 0, false, {
            fileName: "[project]/front/components/ThemeToggle.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/front/components/ThemeToggle.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
}),
"[project]/front/components/Header.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$front$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/front/lib/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$front$2f$components$2f$Container$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/front/components/Container.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$front$2f$components$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/front/components/icons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$front$2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/front/components/ThemeToggle.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function Header() {
    const [compact, setCompact] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [catalogOpen, setCatalogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [catalogRender, setCatalogRender] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [catalogClosing, setCatalogClosing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [catalogTop, setCatalogTop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(64);
    const openTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const closeTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const unmountTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const barRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function onScroll() {
            setCompact(window.scrollY > 24);
        }
        onScroll();
        window.addEventListener("scroll", onScroll, {
            passive: true
        });
        return ()=>window.removeEventListener("scroll", onScroll);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!catalogOpen) return;
        function onKeyDown(e) {
            if (e.key === "Escape") setCatalogOpen(false);
        }
        window.addEventListener("keydown", onKeyDown);
        return ()=>window.removeEventListener("keydown", onKeyDown);
    }, [
        catalogOpen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function updateTop() {
            const el = barRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            setCatalogTop(Math.round(rect.bottom));
        }
        updateTop();
        window.addEventListener("scroll", updateTop, {
            passive: true
        });
        window.addEventListener("resize", updateTop);
        return ()=>{
            window.removeEventListener("scroll", updateTop);
            window.removeEventListener("resize", updateTop);
        };
    }, []);
    function clearTimers() {
        if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
        if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
        if (unmountTimerRef.current) window.clearTimeout(unmountTimerRef.current);
        openTimerRef.current = null;
        closeTimerRef.current = null;
        unmountTimerRef.current = null;
    }
    function scheduleOpen() {
        clearTimers();
        openTimerRef.current = window.setTimeout(()=>setCatalogOpen(true), 80);
    }
    function scheduleClose() {
        clearTimers();
        closeTimerRef.current = window.setTimeout(()=>setCatalogOpen(false), 140);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (catalogOpen) {
            setCatalogClosing(false);
            setCatalogRender(true);
            if (unmountTimerRef.current) {
                window.clearTimeout(unmountTimerRef.current);
                unmountTimerRef.current = null;
            }
            return;
        }
        if (!catalogRender) return;
        setCatalogClosing(true);
        unmountTimerRef.current = window.setTimeout(()=>{
            setCatalogRender(false);
            setCatalogClosing(false);
            unmountTimerRef.current = null;
        }, 920);
    }, [
        catalogOpen,
        catalogRender
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `relative ${compact ? "bg-[color:var(--bg)]/55 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--bg)]/55" : "bg-transparent"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: barRef,
                    className: `relative left-1/2 w-full -translate-x-1/2 transition-[max-width,margin,transform,border-radius,box-shadow,background-color,border-color] duration-500 ease-out will-change-transform ${compact && !catalogRender ? "mt-3 max-w-[1120px] scale-[0.985] rounded-2xl border border-black/10 bg-[color:var(--bg)]/55 supports-[backdrop-filter]:bg-[color:var(--bg)]/55 shadow-[0_18px_60px_rgba(0,0,0,0.10)] dark:border-white/10" : "max-w-[100%] border-b border-black/5 bg-transparent shadow-none dark:border-white/10"}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$front$2f$components$2f$Container$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Container"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex h-16 items-center justify-between gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex min-w-0 items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "#top",
                                            className: "shrink-0 text-sm font-semibold tracking-wide text-[color:var(--fg)] transition hover:opacity-80",
                                            "aria-label": "Наверх",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$front$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BRAND"].name
                                        }, void 0, false, {
                                            fileName: "[project]/front/components/Header.tsx",
                                            lineNumber: 118,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                            className: "hidden items-center gap-1 lg:flex",
                                            onMouseLeave: ()=>scheduleClose(),
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$front$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NAV_LINKS"].map((l)=>{
                                                const isCatalog = l.href === "#catalog";
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    onMouseEnter: ()=>{
                                                        if (isCatalog) scheduleOpen();
                                                        else setCatalogOpen(false);
                                                    },
                                                    onMouseLeave: ()=>{
                                                        if (isCatalog) scheduleClose();
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: l.href,
                                                        className: `group inline-flex items-center rounded-xl px-3 py-2 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] ${isCatalog ? "" : ""}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "relative",
                                                            children: [
                                                                l.label,
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[color:var(--accent)] transition-transform duration-300 group-hover:scale-x-100"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/front/components/Header.tsx",
                                                                    lineNumber: 152,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/front/components/Header.tsx",
                                                            lineNumber: 150,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/front/components/Header.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 25
                                                    }, this)
                                                }, l.href, false, {
                                                    fileName: "[project]/front/components/Header.tsx",
                                                    lineNumber: 133,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/front/components/Header.tsx",
                                            lineNumber: 126,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/front/components/Header.tsx",
                                    lineNumber: 117,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-nowrap items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: __TURBOPACK__imported__module__$5b$project$5d2f$front$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACTS"].phoneHref,
                                            className: "hidden shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium text-[color:var(--fg)] hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:hover:bg-white/10 sm:inline-flex",
                                            "aria-label": `Позвонить: ${__TURBOPACK__imported__module__$5b$project$5d2f$front$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACTS"].phoneDisplay}`,
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$front$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACTS"].phoneDisplay
                                        }, void 0, false, {
                                            fileName: "[project]/front/components/Header.tsx",
                                            lineNumber: 162,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: `mailto:${__TURBOPACK__imported__module__$5b$project$5d2f$front$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACTS"].email}`,
                                            className: "hidden shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-sm text-[color:var(--muted)] hover:bg-black/5 hover:text-[color:var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:hover:bg-white/10 lg:inline-flex",
                                            "aria-label": `Написать: ${__TURBOPACK__imported__module__$5b$project$5d2f$front$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACTS"].email}`,
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$front$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACTS"].email
                                        }, void 0, false, {
                                            fileName: "[project]/front/components/Header.tsx",
                                            lineNumber: 170,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "hidden items-center gap-1 sm:flex",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#",
                                                    className: "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
                                                    "aria-label": "Instagram",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$front$2f$components$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IconInstagram"], {
                                                        className: "h-5 w-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/front/components/Header.tsx",
                                                        lineNumber: 184,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/front/components/Header.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#",
                                                    className: "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
                                                    "aria-label": "WhatsApp",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$front$2f$components$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IconWhatsapp"], {
                                                        className: "h-5 w-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/front/components/Header.tsx",
                                                        lineNumber: 191,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/front/components/Header.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/front/components/Header.tsx",
                                            lineNumber: 178,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$front$2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                                            fileName: "[project]/front/components/Header.tsx",
                                            lineNumber: 195,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "#cta",
                                            className: `ml-2 hidden h-16 items-center justify-center px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] sm:inline-flex -mr-4 sm:-mr-6 lg:-mr-8 ${compact ? "rounded-r-2xl bg-[color:var(--accent)]" : "rounded-none bg-[color:var(--accent)]"}`,
                                            children: "Рассчитать"
                                        }, void 0, false, {
                                            fileName: "[project]/front/components/Header.tsx",
                                            lineNumber: 197,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/front/components/Header.tsx",
                                    lineNumber: 161,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/front/components/Header.tsx",
                            lineNumber: 116,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/front/components/Header.tsx",
                        lineNumber: 115,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/front/components/Header.tsx",
                    lineNumber: 107,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/front/components/Header.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            catalogRender ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `pointer-events-none fixed left-0 right-0 hidden lg:block`,
                style: {
                    top: catalogTop
                },
                onMouseEnter: ()=>{
                    clearTimers();
                    setCatalogOpen(true);
                },
                onMouseLeave: ()=>scheduleClose(),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `pointer-events-auto w-full border-t border-black/5 bg-[color:var(--bg)]/55 supports-[backdrop-filter]:bg-[color:var(--bg)]/55 shadow-[0_18px_60px_rgba(0,0,0,0.12)] backdrop-blur transition-[opacity,transform] duration-[520ms] ease-out dark:border-white/10 transform-gpu ${catalogOpen && !catalogClosing ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto w-full px-4 py-3 sm:px-6 lg:px-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-6 overflow-x-auto whitespace-nowrap pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$front$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATALOG_CATEGORIES"].map((c, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "#catalog",
                                    className: `group flex-none rounded-xl px-2 py-2 text-sm font-semibold text-[color:var(--fg)] transition hover:text-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]`,
                                    style: {
                                        animationName: catalogOpen && !catalogClosing ? "kr-snap-in" : "kr-snap-out",
                                        animationDuration: "520ms",
                                        animationTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                        animationFillMode: "both",
                                        animationDelay: `${Math.min(idx * 55, 330)}ms`
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "relative",
                                        children: [
                                            c.title,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[color:var(--accent)] transition-transform duration-300 group-hover:scale-x-100"
                                            }, void 0, false, {
                                                fileName: "[project]/front/components/Header.tsx",
                                                lineNumber: 251,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/front/components/Header.tsx",
                                        lineNumber: 249,
                                        columnNumber: 21
                                    }, this)
                                }, c.title, false, {
                                    fileName: "[project]/front/components/Header.tsx",
                                    lineNumber: 234,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/front/components/Header.tsx",
                            lineNumber: 232,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/front/components/Header.tsx",
                        lineNumber: 231,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/front/components/Header.tsx",
                    lineNumber: 224,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/front/components/Header.tsx",
                lineNumber: 215,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/front/components/Header.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
}),
"[project]/front/components/MobileCtaBar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MobileCtaBar",
    ()=>MobileCtaBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$front$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/front/lib/constants.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function MobileCtaBar() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-[color:var(--bg)]/78 p-3 backdrop-blur dark:border-white/10 sm:hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto grid max-w-md grid-cols-2 gap-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: __TURBOPACK__imported__module__$5b$project$5d2f$front$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACTS"].phoneHref,
                    className: "inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
                    children: "Позвонить"
                }, void 0, false, {
                    fileName: "[project]/front/components/MobileCtaBar.tsx",
                    lineNumber: 11,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: "#cta",
                    className: "inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
                    children: "Рассчитать"
                }, void 0, false, {
                    fileName: "[project]/front/components/MobileCtaBar.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/front/components/MobileCtaBar.tsx",
            lineNumber: 10,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/front/components/MobileCtaBar.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
}),
"[project]/front/sections/PreCatalogTeaser.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PreCatalogTeaser",
    ()=>PreCatalogTeaser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function PreCatalogTeaser() {
    const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            "Точность",
            "Фактура",
            "Свет",
            "Посадка",
            "Чистый монтаж",
            "Под ключ",
            "Премиальные материалы",
            "Спокойный сервис",
            "Детали решают"
        ], []);
    const proofs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                title: "Материалы выглядят дороже",
                description: "Ткани и фактуры, которые читаются в свете. Не “просто шторы”, а атмосфера комнаты."
            },
            {
                title: "Точность в сантиметрах",
                description: "Посадка, длина и складка — то, что отличает премиум. Согласуем и доводим до чистого вида."
            },
            {
                title: "Спокойный сервис",
                description: "Делаем под ключ: подбор, пошив, монтаж. Без шума и лишних вопросов — с понятным результатом."
            }
        ], []);
    const rootRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const visualRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [inView, setInView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const el = rootRef.current;
        if (!el) return;
        const io = new IntersectionObserver((entries)=>{
            if (entries[0]) setInView(entries[0].isIntersecting);
        }, {
            threshold: 0.2,
            rootMargin: "-10% 0px -35% 0px"
        });
        io.observe(el);
        return ()=>io.disconnect();
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let raf = 0;
        function tick() {
            const root = rootRef.current;
            const v = visualRef.current;
            if (!root || !v) {
                raf = requestAnimationFrame(tick);
                return;
            }
            const rect = root.getBoundingClientRect();
            const vh = window.innerHeight || 1;
            const t = (vh - rect.top) / (vh + rect.height);
            const p = Math.min(1, Math.max(0, t));
            const dy = (p - 0.5) * 18;
            v.style.transform = `translate3d(0, ${dy.toFixed(2)}px, 0)`;
            raf = requestAnimationFrame(tick);
        }
        raf = requestAnimationFrame(tick);
        return ()=>{
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        ref: rootRef,
        "aria-label": "Почему Koenig Room",
        className: "pt-0",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[color:var(--bg)]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "kr-ticker bg-black/[0.015] py-4 dark:bg-white/[0.02]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "kr-ticker-track gap-12 px-4 text-sm font-semibold tracking-[0.22em] text-[color:var(--fg)]/65 sm:px-6 sm:text-base lg:px-8",
                            children: [
                                ...values,
                                ...values
                            ].map((v, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-12",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "whitespace-nowrap uppercase",
                                            children: v
                                        }, void 0, false, {
                                            fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                            lineNumber: 102,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "h-[7px] w-[7px] rotate-45 bg-black/15 dark:bg-white/20"
                                        }, void 0, false, {
                                            fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                            lineNumber: 103,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, `${v}-${i}`, true, {
                                    fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                    lineNumber: 101,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                            lineNumber: 99,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid items-stretch lg:grid-cols-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex min-h-[660px] flex-col lg:min-h-[760px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]",
                                                    children: "ЦЕННОСТИ KOENIG ROOM"
                                                }, void 0, false, {
                                                    fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                                    lineNumber: 115,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl",
                                                    children: [
                                                        "Каталог — это быстро.",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[color:var(--muted)]",
                                                            children: " Но “дорого” рождается до него."
                                                        }, void 0, false, {
                                                            fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                                            lineNumber: 120,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                                    lineNumber: 118,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-4 max-w-xl text-base leading-7 text-[color:var(--muted)] sm:text-lg",
                                                    children: "Ткани, посадка и свет — это то, что делает интерьер цельным. Мы собираем это под ключ и доводим до чистого результата."
                                                }, void 0, false, {
                                                    fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                                    lineNumber: 122,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                            lineNumber: 114,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8 grid gap-9",
                                            children: proofs.map((p, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `transition-[opacity,transform] duration-700 ${inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`,
                                                    style: {
                                                        transitionDelay: `${120 + idx * 140}ms`
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-[44px_1fr] items-start gap-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "pt-1 text-base font-semibold tracking-tight text-[color:var(--muted)]",
                                                                children: String(idx + 1).padStart(2, "0")
                                                            }, void 0, false, {
                                                                fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                                                lineNumber: 138,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-base font-semibold text-[color:var(--fg)]",
                                                                        children: p.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                                                        lineNumber: 142,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-2 text-base leading-7 text-[color:var(--muted)]",
                                                                        children: p.description
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                                                        lineNumber: 143,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                                                lineNumber: 141,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                                        lineNumber: 137,
                                                        columnNumber: 23
                                                    }, this)
                                                }, p.title, false, {
                                                    fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                                    lineNumber: 130,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                            lineNumber: 128,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `mt-10 transition-[opacity,transform] duration-700 ${inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`,
                                            style: {
                                                transitionDelay: "640ms"
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "/about",
                                                className: "inline-flex h-12 w-full items-center justify-center rounded-full bg-[color:var(--accent)] px-6 text-base font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 sm:w-auto",
                                                children: "О нас"
                                            }, void 0, false, {
                                                fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                                lineNumber: 158,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                            lineNumber: 152,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                    lineNumber: 113,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                lineNumber: 112,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                            lineNumber: 111,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative min-h-[660px] overflow-hidden lg:min-h-[760px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: visualRef,
                                    className: "absolute inset-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                            className: "absolute inset-0 h-full w-full object-cover",
                                            src: "/why%20us.mp4",
                                            autoPlay: true,
                                            muted: true,
                                            loop: true,
                                            playsInline: true,
                                            preload: "metadata"
                                        }, void 0, false, {
                                            fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                            lineNumber: 172,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.50),transparent_62%)]"
                                        }, void 0, false, {
                                            fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                            lineNumber: 181,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                    lineNumber: 171,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                                lineNumber: 170,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                            lineNumber: 169,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
            lineNumber: 96,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/front/sections/PreCatalogTeaser.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
}),
"[project]/front/sections/PremiumCurtainsAd.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PremiumCurtainsAd",
    ()=>PremiumCurtainsAd
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$front$2f$components$2f$Container$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/front/components/Container.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function clamp01(v) {
    return Math.min(1, Math.max(0, v));
}
function PremiumCurtainsAd() {
    const scenes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                kicker: "PREMIUM FILM",
                title: "Ткань ловит свет",
                subtitle: "Штора — это не про окно. Это про атмосферу комнаты.",
                videoSrc: "/0-3scene.alli60.mp4"
            },
            {
                kicker: "PREMIUM FILM",
                title: "Складка решает всё",
                subtitle: "Линии, длина и вес ткани делают интерьер дороже за секунды.",
                videoSrc: "/3-6scene.alli60.mp4"
            },
            {
                kicker: "PREMIUM FILM",
                title: "Монтаж — это ювелирка",
                subtitle: "Чистая установка без компромиссов. Видно сразу.",
                videoSrc: "/instryments.alli60.mp4"
            }
        ], []);
    const sectionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const videoARef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const videoBRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const durationsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [renderProgress, setRenderProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [allowExit, setAllowExit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeSrc, setActiveSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(scenes[0]?.videoSrc ?? "");
    const [pendingSrc, setPendingSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeLayer, setActiveLayer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [pendingReady, setPendingReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [crossfade, setCrossfade] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSwitching, setIsSwitching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const lastTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const smoothProgressRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastRawProgressRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastVelTsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const velEmaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const commitTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let raf = 0;
        function update() {
            const el = sectionRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const viewportH = window.innerHeight || 1;
            const total = rect.height - viewportH;
            const scrolled = -rect.top;
            const p = total <= 0 ? 0 : clamp01(scrolled / total);
            setProgress(p);
            if (!allowExit && total > 0) {
                const absTop = rect.top + window.scrollY;
                const gateScrollY = absTop + total * ((scenes.length - 0.02) / scenes.length);
                if (window.scrollY > gateScrollY) {
                    window.scrollTo({
                        top: gateScrollY,
                        left: 0,
                        behavior: "auto"
                    });
                }
            }
        }
        function onScroll() {
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(()=>{
                update();
                raf = 0;
            });
        }
        update();
        window.addEventListener("scroll", onScroll, {
            passive: true
        });
        window.addEventListener("resize", onScroll);
        return ()=>{
            if (raf) cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [
        allowExit,
        scenes.length
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let raf = 0;
        function smoothstep(edge0, edge1, x) {
            const t = clamp01((x - edge0) / Math.max(1e-6, edge1 - edge0));
            return t * t * (3 - 2 * t);
        }
        function tick() {
            const now = performance.now();
            const dt = Math.max(1, now - (lastVelTsRef.current || now));
            lastVelTsRef.current = now;
            const raw = progress;
            const lastRaw = lastRawProgressRef.current;
            const vel = Math.abs(raw - lastRaw) / dt;
            lastRawProgressRef.current = raw;
            // Smooth velocity a bit so tiny wheel pulses don't flip the mode.
            velEmaRef.current = velEmaRef.current * 0.85 + vel * 0.15;
            const velSmooth = velEmaRef.current;
            // vel ~ 0..0.003 (depends on wheel + section height). Below vSlow => pronounced slow-mo.
            const vSlow = 0.00025;
            const vFast = 0.0011;
            // When scrolling fast -> follow quickly.
            // When slow/near-zero -> ease to target very slowly (continuous, no stepping), coming to rest in ~3s.
            const fastMix = smoothstep(vSlow, vFast, velSmooth);
            const sp = smoothProgressRef.current;
            const dtSec = dt / 1000;
            const tauFast = 0.10;
            const tauSlow = 1.25;
            const tau = tauSlow + (tauFast - tauSlow) * fastMix;
            const alpha = 1 - Math.exp(-dtSec / Math.max(1e-3, tau));
            const next = sp + (raw - sp) * alpha;
            smoothProgressRef.current = next;
            setRenderProgress(next);
            raf = requestAnimationFrame(tick);
        }
        raf = requestAnimationFrame(tick);
        return ()=>{
            if (raf) cancelAnimationFrame(raf);
        };
    }, [
        progress
    ]);
    const n = scenes.length;
    const scaled = renderProgress * n;
    const active = Math.min(n - 1, Math.floor(scaled));
    const t = clamp01(scaled - active);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const src = scenes[active]?.videoSrc;
        if (!src) return;
        if (src === activeSrc) return;
        lastTimeRef.current = 0;
        setIsSwitching(true);
        setPendingSrc(src);
    }, [
        active,
        activeSrc,
        scenes
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!pendingSrc) return;
        setPendingReady(false);
        setCrossfade(false);
        if (commitTimerRef.current) {
            window.clearTimeout(commitTimerRef.current);
            commitTimerRef.current = null;
        }
    }, [
        pendingSrc
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!pendingSrc) return;
        if (!pendingReady) return;
        if (crossfade) return;
        setCrossfade(true);
        commitTimerRef.current = window.setTimeout(()=>{
            const nextLayer = activeLayer === 0 ? 1 : 0;
            setActiveLayer(nextLayer);
            setActiveSrc(pendingSrc);
            setPendingSrc(null);
            setPendingReady(false);
            setCrossfade(false);
            setIsSwitching(false);
            commitTimerRef.current = null;
        }, 360);
    }, [
        activeLayer,
        crossfade,
        pendingReady,
        pendingSrc
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const src = scenes[active]?.videoSrc;
        if (!src) return;
        let raf = 0;
        function tick() {
            const activeVideo = activeLayer === 0 ? videoARef.current : videoBRef.current;
            const pendingVideo = activeLayer === 0 ? videoBRef.current : videoARef.current;
            if (!activeVideo) return;
            const srcNow = scenes[active]?.videoSrc;
            if (!srcNow) return;
            const duration = durationsRef.current[srcNow] ?? activeVideo.duration ?? 0;
            if (!Number.isFinite(duration) || duration <= 0) {
                raf = requestAnimationFrame(tick);
                return;
            }
            if (!Number.isFinite(activeVideo.duration) || activeVideo.readyState < 2) {
                raf = requestAnimationFrame(tick);
                return;
            }
            const target = clamp01(t) * Math.max(0.001, duration - 0.05);
            const prev = lastTimeRef.current || 0;
            // Additional tiny smoothing (time-domain) to remove decoder micro-jitter.
            // renderProgress already eases to rest over ~3s on scroll stop.
            const alpha = 0.9;
            const next = prev + (target - prev) * alpha;
            lastTimeRef.current = next;
            // Lock user in section until the last scene has effectively reached its end.
            if (!allowExit && active === scenes.length - 1) {
                if (duration > 0 && next >= Math.max(0, duration - 1)) {
                    setAllowExit(true);
                }
            }
            try {
                activeVideo.currentTime = next;
                if (isSwitching && pendingVideo && pendingVideo.readyState >= 2) {
                    pendingVideo.currentTime = next;
                }
            } catch  {
            // ignore
            }
            raf = requestAnimationFrame(tick);
        }
        raf = requestAnimationFrame(tick);
        return ()=>{
            if (raf) cancelAnimationFrame(raf);
        };
    }, [
        active,
        t,
        scenes,
        renderProgress,
        activeLayer,
        isSwitching,
        allowExit
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        ref: sectionRef,
        className: "relative bg-[#0b0b0b] text-[#f7f7f7]",
        style: {
            height: `${(n + 1) * 100}vh`
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "sticky top-0 h-screen overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            ref: videoARef,
                            className: "absolute inset-0 h-full w-full object-cover",
                            src: activeLayer === 0 ? activeSrc : pendingSrc ?? activeSrc,
                            muted: true,
                            playsInline: true,
                            preload: "auto",
                            style: {
                                opacity: activeLayer === 0 ? crossfade ? 0 : 1 : crossfade ? 1 : 0,
                                transition: "opacity 320ms ease"
                            },
                            onLoadedMetadata: (e)=>{
                                const v = e.currentTarget;
                                const srcKey = activeLayer === 0 ? activeSrc : pendingSrc;
                                if (srcKey && Number.isFinite(v.duration) && v.duration > 0) {
                                    durationsRef.current[srcKey] = v.duration;
                                }
                                try {
                                    v.pause();
                                } catch  {
                                // ignore
                                }
                            },
                            onCanPlayThrough: ()=>{
                                if (pendingSrc && activeLayer !== 0) setPendingReady(true);
                            }
                        }, void 0, false, {
                            fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
                            lineNumber: 265,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            ref: videoBRef,
                            className: "absolute inset-0 h-full w-full object-cover",
                            src: activeLayer === 1 ? activeSrc : pendingSrc ?? activeSrc,
                            muted: true,
                            playsInline: true,
                            preload: "auto",
                            style: {
                                opacity: activeLayer === 1 ? crossfade ? 0 : 1 : crossfade ? 1 : 0,
                                transition: "opacity 320ms ease"
                            },
                            onLoadedMetadata: (e)=>{
                                const v = e.currentTarget;
                                const srcKey = activeLayer === 1 ? activeSrc : pendingSrc;
                                if (srcKey && Number.isFinite(v.duration) && v.duration > 0) {
                                    durationsRef.current[srcKey] = v.duration;
                                }
                                try {
                                    v.pause();
                                } catch  {
                                // ignore
                                }
                            },
                            onCanPlayThrough: ()=>{
                                if (pendingSrc && activeLayer !== 1) setPendingReady(true);
                            }
                        }, void 0, false, {
                            fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
                            lineNumber: 300,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_20%,rgba(255,255,255,0.08),transparent_55%),linear-gradient(to_top,rgba(0,0,0,0.62),rgba(0,0,0,0.18),rgba(0,0,0,0.72))]"
                        }, void 0, false, {
                            fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
                            lineNumber: 334,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 bg-black opacity-0"
                        }, void 0, false, {
                            fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
                            lineNumber: 335,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
                    lineNumber: 264,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$front$2f$components$2f$Container$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Container"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-10 grid h-screen items-end pb-10 sm:pb-14",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-3xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs font-semibold tracking-[0.42em] text-white/65",
                                    style: {
                                        opacity: 0.72 + 0.28 * (1 - Math.abs(t - 0.5) * 2)
                                    },
                                    children: scenes[active]?.kicker
                                }, void 0, false, {
                                    fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
                                    lineNumber: 341,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl",
                                    style: {
                                        transform: `translateY(${Math.round((1 - t) * 10)}px)`,
                                        opacity: 0.88 + 0.12 * t,
                                        transition: "opacity 240ms ease"
                                    },
                                    children: scenes[active]?.title
                                }, void 0, false, {
                                    fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
                                    lineNumber: 349,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-3 max-w-2xl text-pretty text-sm leading-6 text-white/75 sm:text-base",
                                    style: {
                                        transform: `translateY(${Math.round((1 - t) * 12)}px)`,
                                        opacity: 0.72 + 0.28 * t,
                                        transition: "opacity 240ms ease"
                                    },
                                    children: scenes[active]?.subtitle
                                }, void 0, false, {
                                    fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
                                    lineNumber: 359,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6 flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "#cta",
                                            className: "inline-flex h-12 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-black shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                                            children: "Рассчитать проект"
                                        }, void 0, false, {
                                            fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
                                            lineNumber: 371,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "#catalog",
                                            className: "inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                                            children: "Смотреть решения"
                                        }, void 0, false, {
                                            fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
                                            lineNumber: 377,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
                                    lineNumber: 370,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-8 h-1 w-full max-w-lg rounded-full bg-white/10",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-1 rounded-full bg-white/65",
                                        style: {
                                            width: `${Math.round(renderProgress * 100)}%`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
                                        lineNumber: 386,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
                                    lineNumber: 385,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
                            lineNumber: 340,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
                        lineNumber: 339,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
                    lineNumber: 338,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
            lineNumber: 263,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/front/sections/PremiumCurtainsAd.tsx",
        lineNumber: 258,
        columnNumber: 5
    }, this);
}
}),
"[project]/front/sections/ScrollStory.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollStory",
    ()=>ScrollStory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$front$2f$components$2f$Container$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/front/components/Container.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function ScrollStory() {
    const steps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                title: "Свет и приватность",
                description: "Настраиваем: мягкий дневной свет или полное затемнение. Вы получаете красивый интерьер и комфорт.",
                overlayLabel: "Blackout / полупрозрачные",
                videoSrc: "/scroll_video.mp4"
            },
            {
                title: "Фактура ткани",
                description: "Тактильность и складка решают ощущение премиальности. Подбираем материал под интерьер и сценарий комнаты.",
                overlayLabel: "Фактура / плотность",
                videoSrc: "/3.1.mp4"
            },
            {
                title: "Декор и детали",
                description: "Карнизы, подхваты, фурнитура и аксессуары — именно они делают проект законченно дорогим.",
                overlayLabel: "Декор / фурнитура",
                videoSrc: "/3.2.mp4"
            }
        ], []);
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const els = Array.from(document.querySelectorAll("[data-kr-step]"));
        if (els.length === 0) return;
        const io = new IntersectionObserver((entries)=>{
            const visible = entries.filter((e)=>e.isIntersecting).sort((a, b)=>(b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
            if (visible[0]) {
                const idx = Number(visible[0].target.dataset.krStep);
                if (!Number.isNaN(idx)) setActive(idx);
            }
        }, {
            root: null,
            threshold: [
                0.2,
                0.35,
                0.5,
                0.65
            ],
            rootMargin: "-20% 0px -55% 0px"
        });
        els.forEach((el)=>io.observe(el));
        return ()=>io.disconnect();
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "py-10 sm:py-14",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$front$2f$components$2f$Container$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Container"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-10 lg:grid-cols-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sticky top-24",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative overflow-hidden rounded-[28px] border border-black/5 bg-white/50 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-[radial-gradient(700px_circle_at_15%_10%,var(--glow),transparent_60%)]"
                                        }, void 0, false, {
                                            fileName: "[project]/front/sections/ScrollStory.tsx",
                                            lineNumber: 76,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative aspect-[4/3]",
                                            children: [
                                                steps.map((s, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 opacity-0 transition-[opacity,transform] duration-700 will-change-transform",
                                                        style: {
                                                            opacity: active === idx ? 1 : 0
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute inset-0",
                                                                style: {
                                                                    clipPath: "ellipse(60% 48% at 52% 50%)"
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                                                    className: `h-full w-full object-cover transition-transform duration-700 ${active === idx ? "scale-[1.06]" : "scale-[1.02]"}`,
                                                                    src: s.videoSrc,
                                                                    autoPlay: active === idx,
                                                                    muted: true,
                                                                    loop: true,
                                                                    playsInline: true,
                                                                    preload: "metadata"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/front/sections/ScrollStory.tsx",
                                                                    lineNumber: 91,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/front/sections/ScrollStory.tsx",
                                                                lineNumber: 85,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.62),transparent_60%)]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/front/sections/ScrollStory.tsx",
                                                                lineNumber: 103,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, s.title, true, {
                                                        fileName: "[project]/front/sections/ScrollStory.tsx",
                                                        lineNumber: 80,
                                                        columnNumber: 21
                                                    }, this)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 opacity-30",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute -left-10 top-10 h-32 w-32 rounded-full border border-black/10 bg-white/20 backdrop-blur dark:border-white/10"
                                                        }, void 0, false, {
                                                            fileName: "[project]/front/sections/ScrollStory.tsx",
                                                            lineNumber: 108,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute -right-12 bottom-10 h-40 w-40 rounded-full border border-black/10 bg-white/20 backdrop-blur dark:border-white/10"
                                                        }, void 0, false, {
                                                            fileName: "[project]/front/sections/ScrollStory.tsx",
                                                            lineNumber: 109,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/front/sections/ScrollStory.tsx",
                                                    lineNumber: 107,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute left-5 top-5 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 backdrop-blur",
                                                    children: steps[active]?.overlayLabel
                                                }, void 0, false, {
                                                    fileName: "[project]/front/sections/ScrollStory.tsx",
                                                    lineNumber: 112,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute right-6 top-6",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative h-12 w-12",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute inset-0 rounded-full bg-white/20"
                                                            }, void 0, false, {
                                                                fileName: "[project]/front/sections/ScrollStory.tsx",
                                                                lineNumber: 118,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute inset-0 animate-[kr-ping_1.8s_ease-out_infinite] rounded-full border border-white/60"
                                                            }, void 0, false, {
                                                                fileName: "[project]/front/sections/ScrollStory.tsx",
                                                                lineNumber: 119,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                                                            }, void 0, false, {
                                                                fileName: "[project]/front/sections/ScrollStory.tsx",
                                                                lineNumber: 120,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/front/sections/ScrollStory.tsx",
                                                        lineNumber: 117,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/front/sections/ScrollStory.tsx",
                                                    lineNumber: 116,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute bottom-0 left-0 right-0 p-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-2xl font-semibold tracking-tight text-white",
                                                            children: steps[active]?.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/front/sections/ScrollStory.tsx",
                                                            lineNumber: 125,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-2 max-w-md text-sm leading-6 text-white/80",
                                                            children: steps[active]?.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/front/sections/ScrollStory.tsx",
                                                            lineNumber: 128,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/front/sections/ScrollStory.tsx",
                                                    lineNumber: 124,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "absolute inset-0 h-full w-full",
                                                    viewBox: "0 0 100 100",
                                                    preserveAspectRatio: "none",
                                                    "aria-hidden": "true",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M20,78 C30,58 38,52 50,50 C62,48 70,56 82,78",
                                                        fill: "none",
                                                        stroke: "rgba(255,255,255,0.72)",
                                                        strokeWidth: "0.9",
                                                        strokeLinecap: "round",
                                                        strokeDasharray: "2 2",
                                                        style: {
                                                            opacity: active === 1 ? 1 : 0.12,
                                                            transition: "opacity 600ms ease"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/front/sections/ScrollStory.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/front/sections/ScrollStory.tsx",
                                                    lineNumber: 133,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/front/sections/ScrollStory.tsx",
                                            lineNumber: 78,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/front/sections/ScrollStory.tsx",
                                    lineNumber: 75,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 text-xs text-[color:var(--muted)]",
                                    children: "Скролль вниз — подсветка меняется, как в продуктовых сторителлингах."
                                }, void 0, false, {
                                    fileName: "[project]/front/sections/ScrollStory.tsx",
                                    lineNumber: 155,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/front/sections/ScrollStory.tsx",
                            lineNumber: 74,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/front/sections/ScrollStory.tsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]",
                                children: "ПРОЦЕСС"
                            }, void 0, false, {
                                fileName: "[project]/front/sections/ScrollStory.tsx",
                                lineNumber: 162,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl",
                                children: "От выбора до идеальной складки"
                            }, void 0, false, {
                                fileName: "[project]/front/sections/ScrollStory.tsx",
                                lineNumber: 165,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-3 max-w-xl text-sm leading-6 text-[color:var(--muted)] sm:text-base",
                                children: "Быстро, спокойно и профессионально. Без длинных объяснений — только важное."
                            }, void 0, false, {
                                fileName: "[project]/front/sections/ScrollStory.tsx",
                                lineNumber: 168,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-8",
                                children: steps.map((s, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        "data-kr-step": idx,
                                        className: `min-h-[42vh] py-10 transition sm:min-h-[48vh] ${idx !== 0 ? "border-t border-black/5 dark:border-white/10" : ""}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex h-full flex-col justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `mt-0.5 w-14 shrink-0 tabular-nums tracking-tight transition ${active === idx ? "text-base font-semibold text-[color:var(--fg)] sm:text-lg" : "text-base font-medium text-[color:var(--muted)] sm:text-lg"}`,
                                                        children: String(idx + 1).padStart(2, "0")
                                                    }, void 0, false, {
                                                        fileName: "[project]/front/sections/ScrollStory.tsx",
                                                        lineNumber: 184,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `relative flex-1 pl-5 transition ${active === idx ? "opacity-100" : "opacity-85"}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `absolute left-0 top-0 h-full w-px transition ${active === idx ? "bg-[color:var(--accent)]/70" : "bg-black/10 dark:bg-white/15"}`,
                                                                "aria-hidden": "true"
                                                            }, void 0, false, {
                                                                fileName: "[project]/front/sections/ScrollStory.tsx",
                                                                lineNumber: 199,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-2xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-3xl",
                                                                children: s.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/front/sections/ScrollStory.tsx",
                                                                lineNumber: 208,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-3 max-w-xl text-base leading-7 text-[color:var(--muted)] sm:text-lg",
                                                                children: s.description
                                                            }, void 0, false, {
                                                                fileName: "[project]/front/sections/ScrollStory.tsx",
                                                                lineNumber: 211,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/front/sections/ScrollStory.tsx",
                                                        lineNumber: 194,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/front/sections/ScrollStory.tsx",
                                                lineNumber: 183,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/front/sections/ScrollStory.tsx",
                                            lineNumber: 182,
                                            columnNumber: 19
                                        }, this)
                                    }, s.title, false, {
                                        fileName: "[project]/front/sections/ScrollStory.tsx",
                                        lineNumber: 175,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/front/sections/ScrollStory.tsx",
                                lineNumber: 173,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/front/sections/ScrollStory.tsx",
                        lineNumber: 161,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/front/sections/ScrollStory.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/front/sections/ScrollStory.tsx",
            lineNumber: 71,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/front/sections/ScrollStory.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__58341606._.js.map