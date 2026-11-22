
import { useEffect, useState } from "react";
import {
    AlertTriangle,
    Box,
    FileText,
    GlassWater,
    Leaf,
    Package,
    Recycle,
    RefreshCw,
    Trash2,
    type LucideIcon,
} from "lucide-react";

type GuideItem = {
    type: string;
    recyclable: boolean;
    color: string;
    instructions: string[];
    tip: string;
};

type GuideResponse = {
    success: boolean;
    categories: Record<string, GuideItem>;
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    cardboard: Package,
    glass: GlassWater,
    metal: Box,
    paper: FileText,
    plastic: Recycle,
    trash: Trash2,
};

const CATEGORY_LABELS: Record<string, string> = {
    cardboard: "Cardboard",
    glass: "Glass",
    metal: "Metal",
    paper: "Paper",
    plastic: "Plastic",
    trash: "General Waste",
};

export default function RecyclingGuide() {
    const [categories, setCategories] = useState<
        Record<string, GuideItem>
    >({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        async function loadGuide() {
            setLoading(true);
            setError("");

            try {
                const response = await
                    fetch(
                        `${
                            import.meta.env.VITE_API_BASE_URL ||
                            "http://127.0.0.1:8000"
                        }/recycling-guide`
                    )
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data: GuideResponse = await response.json();

                if (!data.success) {
                    throw new Error("Unable to load recycling information.");
                }

                setCategories(data.categories);
            } catch (err) {
                if (controller.signal.aborted) return;

                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to connect to the backend."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadGuide();

        return () => controller.abort();
    }, [retryCount]);

    return (
        <section id="recycling-guide" className="scroll-mt-8 space-y-6">
            <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/10 p-3">
                    <Leaf className="h-6 w-6 text-emerald-400" />
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-white">
                        Recycling Guide
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                        Explore responsible disposal practices for six waste categories.
                    </p>
                </div>
            </div>

            {loading && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-slate-400">
                    Loading recycling information...
                </div>
            )}

            {error && (
                <div
                    role="alert"
                    className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6"
                >
                    <p className="text-sm text-red-300">{error}</p>

                    <button
                        type="button"
                        onClick={() => setRetryCount((count) => count + 1)}
                        className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-sm text-white"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(categories).map(([category, guide]) => {
                        const Icon = CATEGORY_ICONS[category] ?? Recycle;

                        return (
                            <article
                                key={category}
                                className="rounded-2xl border border-white/10 bg-[#0B1C14] p-6 transition hover:border-emerald-500/30"
                            >
                                <div
                                    className="mb-5 inline-flex rounded-xl p-3"
                                    style={{
                                        backgroundColor: `${guide.color}20`,
                                    }}
                                >
                                    <Icon
                                        className="h-7 w-7"
                                        style={{ color: guide.color }}
                                    />
                                </div>

                                <h3 className="text-xl font-semibold text-white">
                                    {CATEGORY_LABELS[category] ?? category}
                                </h3>

                                <p className="mt-2 text-sm text-slate-400">
                                    {guide.type}
                                </p>

                                <div className="mt-5 flex items-center gap-2 text-xs">
                                    {guide.recyclable ? (
                                        <>
                                            <Recycle className="h-4 w-4 text-emerald-400" />
                                            <span className="text-emerald-300">
                        Potentially recyclable
                      </span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle className="h-4 w-4 text-amber-400" />
                                            <span className="text-amber-300">
                        Check disposal requirements
                      </span>
                                        </>
                                    )}
                                </div>

                                <div className="mt-6 border-t border-white/10 pt-5">
                                    <h4 className="mb-3 text-sm font-semibold text-white">
                                        Disposal Instructions
                                    </h4>

                                    <ol className="space-y-3">
                                        {guide.instructions.map((instruction, index) => (
                                            <li
                                                key={index}
                                                className="flex gap-3 text-sm leading-6 text-slate-400"
                                            >
                        <span className="font-semibold text-emerald-400">
                          {index + 1}.
                        </span>
                                                {instruction}
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                <div className="mt-6 rounded-xl bg-emerald-500/[0.06] p-4">
                                    <p className="text-xs font-semibold text-emerald-300">
                                        ECO TIP
                                    </p>
                                    <p className="mt-2 text-xs leading-5 text-slate-400">
                                        {guide.tip}
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            <p className="text-xs text-slate-500">
                Recycling acceptance varies by location. Always check local
                collection rules before disposing of materials.
            </p>
        </section>
    );
}
