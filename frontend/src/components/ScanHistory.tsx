
import {
    BarChart3,
    Clock3,
    History,
    Layers3,
    Trash2,
    TrendingUp,
} from "lucide-react";

import type { ScanRecord } from "../utils/scanHistory";
import { getScanStatistics } from "../utils/scanHistory";

type Props = {
    history: ScanRecord[];
    onDelete: (id: string) => void;
    onClear: () => void;
};

const CATEGORY_COLORS: Record<string, string> = {
    cardboard: "#D4A373",
    glass: "#38BFA7",
    metal: "#94A3B8",
    paper: "#60A5FA",
    plastic: "#A78BFA",
    trash: "#F87171",
};

const CATEGORY_NAMES: Record<string, string> = {
    cardboard: "Cardboard",
    glass: "Glass",
    metal: "Metal",
    paper: "Paper",
    plastic: "Plastic",
    trash: "General Waste",
};

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Unknown date";

    return date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export default function ScanHistory({
                                        history,
                                        onDelete,
                                        onClear,
                                    }: Props) {
    const stats = getScanStatistics(history);

    const categoryEntries = Object.entries(
        stats.categoryCounts
    ).sort((a, b) => b[1] - a[1]);

    const maxCount = Math.max(
        1,
        ...categoryEntries.map(([, count]) => count)
    );

    const cards = [
        {
            label: "Total Scans",
            value: stats.totalScans.toString(),
            icon: History,
        },
        {
            label: "Waste Categories",
            value: stats.uniqueCategories.toString(),
            icon: Layers3,
        },
        {
            label: "Avg. Model Confidence",
            value: `${stats.averageConfidence.toFixed(1)}%`,
            icon: TrendingUp,
        },
    ];

    return (
        <section
            id="history"
            className="scroll-mt-8 space-y-6"
        >
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-500/10 p-3">
                        <History className="h-6 w-6 text-emerald-400" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white">
                            Scan History & Analytics
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Explore your previous AI waste classifications.
                        </p>
                    </div>
                </div>

                {history.length > 0 && (
                    <button
                        type="button"
                        onClick={() => {
                            if (
                                window.confirm(
                                    "Delete all saved scans? This cannot be undone."
                                )
                            ) {
                                onClear();
                            }
                        }}
                        className="flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm text-red-300 transition hover:bg-red-500/10"
                    >
                        <Trash2 className="h-4 w-4" />
                        Clear History
                    </button>
                )}
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-3">
                {cards.map(({ label, value, icon: Icon }) => (
                    <div
                        key={label}
                        className="rounded-2xl border border-white/10 bg-[#0B1C14] p-6"
                    >
                        <div className="mb-5 inline-flex rounded-xl bg-emerald-500/10 p-3">
                            <Icon className="h-5 w-5 text-emerald-400" />
                        </div>

                        <p className="text-3xl font-bold text-white">
                            {value}
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                            {label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Category distribution */}
            <div className="rounded-3xl border border-white/10 bg-[#0B1C14] p-6 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-emerald-400" />
                    <h3 className="text-lg font-semibold text-white">
                        Waste Category Distribution
                    </h3>
                </div>

                {categoryEntries.length === 0 ? (
                    <p className="text-sm text-slate-400">
                        No scans yet. Analyze an image to see your statistics.
                    </p>
                ) : (
                    <div className="space-y-5">
                        {categoryEntries.map(([category, count]) => (
                            <div key={category}>
                                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-300">
                    {CATEGORY_NAMES[category] ?? category}
                  </span>
                                    <span className="text-white">
                    {count} {count === 1 ? "scan" : "scans"}
                  </span>
                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(count / maxCount) * 100}%`,
                                            backgroundColor:
                                                CATEGORY_COLORS[category] ?? "#34D399",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent scans */}
            <div className="rounded-3xl border border-white/10 bg-[#0B1C14] p-6 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                    <Clock3 className="h-6 w-6 text-emerald-400" />
                    <h3 className="text-lg font-semibold text-white">
                        Recent Scans
                    </h3>
                </div>

                {history.length === 0 ? (
                    <p className="text-sm text-slate-400">
                        Your scan history is empty.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {history.map((scan) => (
                            <div
                                key={scan.id}
                                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-white">
                                        {scan.filename}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        {formatDate(scan.timestamp)}
                                    </p>

                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                            color:
                                CATEGORY_COLORS[scan.result.category] ??
                                "#34D399",
                            backgroundColor: `${
                                CATEGORY_COLORS[scan.result.category] ??
                                "#34D399"
                            }20`,
                        }}
                    >
                      {CATEGORY_NAMES[scan.result.category] ??
                          scan.result.category}
                    </span>

                                        <span className="text-xs text-slate-400">
                      {scan.result.confidence.toFixed(2)}%
                    </span>

                                        {scan.result.uncertain && (
                                            <span className="text-xs text-amber-300">
                        Needs verification
                      </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onDelete(scan.id)}
                                    aria-label={`Delete scan ${scan.filename}`}
                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <p className="text-xs text-slate-500">
                Scan records are stored locally in this browser.
                Average model confidence is not a measure of classification accuracy.
            </p>
        </section>
    );
}
