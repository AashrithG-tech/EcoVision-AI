
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Leaf,
    LayoutDashboard,
    ScanLine,
    History,
    Recycle,
    Menu,
    X,
} from "lucide-react";

const navigation = [
    { label: "Dashboard", icon: LayoutDashboard, href: "#dashboard" },
    { label: "Scan Waste", icon: ScanLine, href: "#scan" },
    { label: "Scan History", icon: History, href: "#history" },
    {
        label: "Recycling Guide",
        icon: Recycle,
        href: "#recycling-guide",
    },
];

const GITHUB_URL = "https://github.com/AashrithG-tech";

function SidebarContent({
                            onNavigate,
                        }: {
    onNavigate?: () => void;
}) {
    return (
        <>
            {/* Branding */}
            <div className="mb-12 flex items-center gap-3">
                <div className="shrink-0 rounded-xl bg-emerald-500/15 p-2.5">
                    <Leaf className="h-6 w-6 text-emerald-400" />
                </div>

                <div className="min-w-0">
                    <h1 className="text-xl font-bold text-white">
                        EcoVision{" "}
                        <span className="text-emerald-400">AI</span>
                    </h1>

                    <p className="text-xs text-slate-500">
                        Smart Waste Intelligence
                    </p>
                </div>
            </div>

            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                Workspace
            </p>

            {/* Navigation */}
            <nav className="space-y-2" aria-label="Main navigation">
                {navigation.map(({ label, icon: Icon, href }) => (
                    <a
                        key={label}
                        href={href}
                        onClick={onNavigate}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-emerald-500/10 hover:text-emerald-400 focus-visible:outline-2 focus-visible:outline-emerald-400"
                    >
                        <Icon className="h-5 w-5 shrink-0" />
                        {label}
                    </a>
                ))}
            </nav>

            <div className="mt-auto pt-8">
                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                    <Leaf className="mb-3 h-6 w-6 text-emerald-400" />

                    <p className="text-sm font-semibold text-white">
                        Small actions. Big impact.
                    </p>

                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                        Make smarter recycling decisions with AI-powered
                        waste recognition.
                    </p>
                </div>

                <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center gap-2 px-3 text-sm text-slate-500 transition hover:text-white"
                >

                </a>
            </div>
        </>
    );
}

export default function Sidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close the mobile drawer with Escape.
    useEffect(() => {
        if (!mobileOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setMobileOpen(false);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [mobileOpen]);

    // Prevent background scrolling while drawer is open.
    useEffect(() => {
        if (!mobileOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [mobileOpen]);

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-[#091A13] p-6 lg:flex">
                <SidebarContent />
            </aside>

            {/* Mobile navigation header */}
            <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#091A13]/95 px-5 backdrop-blur-xl lg:hidden">
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open navigation menu"
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-navigation"
                    className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-emerald-400 transition hover:bg-white/10"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-emerald-400" />

                    <span className="font-bold text-white">
                        EcoVision{" "}
                        <span className="text-emerald-400">AI</span>
                    </span>
                </div>

                <div className="w-11" aria-hidden="true" />
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        {/* Backdrop */}
                        <motion.button
                            type="button"
                            aria-label="Close navigation menu"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setMobileOpen(false)}
                            className="absolute inset-0 h-full w-full bg-black/70 backdrop-blur-sm"
                        />

                        {/* Sliding panel */}
                        <motion.aside
                            id="mobile-navigation"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Mobile navigation"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                            }}
                            className="absolute inset-y-0 left-0 flex w-[min(85vw,320px)] flex-col overflow-y-auto border-r border-white/10 bg-[#091A13] p-6 shadow-2xl"
                        >
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Close menu"
                                className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <SidebarContent
                                onNavigate={() => setMobileOpen(false)}
                            />
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
