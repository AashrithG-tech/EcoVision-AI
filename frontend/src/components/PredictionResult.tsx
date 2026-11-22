
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
    AlertTriangle,
    Box,
    CheckCircle2,
    CircleHelp,
    FileText,
    GlassWater,
    Lightbulb,
    Package,
    Recycle,
    Sparkles,
    Trash2,
    type LucideIcon,
} from "lucide-react";

import type { PredictionResult as Result } from "../services/api";

type Props = {
    result: Result;
};

type CategoryStyle = {
    label: string;
    color: string;
    background: string;
    icon: LucideIcon;
};

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
    cardboard: {
        label: "Cardboard",
        color: "#D4A373",
        background: "rgba(212, 163, 115, 0.12)",
        icon: Package,
    },
    glass: {
        label: "Glass",
        color: "#38BFA7",
        background: "rgba(56, 191, 167, 0.12)",
        icon: GlassWater,
    },
    metal: {
        label: "Metal",
        color: "#94A3B8",
        background: "rgba(148, 163, 184, 0.12)",
        icon: Box,
    },
    paper: {
        label: "Paper",
        color: "#60A5FA",
        background: "rgba(96, 165, 250, 0.12)",
        icon: FileText,
    },
    plastic: {
        label: "Plastic",
        color: "#A78BFA",
        background: "rgba(167, 139, 250, 0.12)",
        icon: Recycle,
    },
    trash: {
        label: "General Waste",
        color: "#F87171",
        background: "rgba(248, 113, 113, 0.12)",
        icon: Trash2,
    },
};

const DEFAULT_STYLE: CategoryStyle = {
    label: "Unknown",
    color: "#94A3B8",
    background: "rgba(148, 163, 184, 0.12)",
    icon: CircleHelp,
};

const clampPercentage = (value: number) =>
    Math.max(0, Math.min(100, value));

export default function PredictionResult({ result }: Props) {
    const resultRef = useRef<HTMLElement>(null);

    const categoryStyle =
        CATEGORY_STYLES[result.category] ?? DEFAULT_STYLE;

    const CategoryIcon = categoryStyle.icon;

    useEffect(() => {
        resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }, [result]);

    return (
        <motion.section
            ref={resultRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mt-6 min-w-0 space-y-6"
            aria-live="polite"
        >
            {/* Main prediction card */}
            <div className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0B1C14] p-4 sm:p-6 md:p-8">
                <div className="mb-7 flex items-start gap-3">
                    <div className="shrink-0 rounded-xl bg-emerald-500/10 p-3">
                        <Sparkles className="h-6 w-6 text-emerald-400" />
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-white sm:text-xl">
                            AI Analysis Result
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Powered by ResNet18 image classification
                        </p>
                    </div>
                </div>

                {/* Detected category */}
                <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 md:p-6">
                    <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                        Detected Waste Category
                    </p>

                    {/* Responsive category and confidence layout */}
                    <div className="mt-5 flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        {/* Category icon and name */}
                        <div className="flex min-w-0 items-center gap-4">
                            <div
                                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl sm:h-16 sm:w-16"
                                style={{
                                    backgroundColor: categoryStyle.background,
                                }}
                            >
                                <CategoryIcon
                                    className="h-7 w-7 sm:h-8 sm:w-8"
                                    style={{ color: categoryStyle.color }}
                                />
                            </div>

                            <div className="min-w-0">
                                <h3 className="break-words text-2xl font-bold leading-tight text-white sm:text-3xl">
                                    {categoryStyle.label}
                                </h3>

                                <p className="mt-1 text-sm text-slate-400">
                                    AI-predicted material
                                </p>
                            </div>
                        </div>

                        {/* Confidence on its own row on smaller screens */}
                        <div className="min-w-0 border-t border-white/10 pt-4 lg:shrink-0 lg:border-0 lg:pt-0 lg:text-right">
                            <p
                                className="text-3xl font-bold"
                                style={{ color: categoryStyle.color }}
                            >
                                {result.confidence.toFixed(2)}%
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Model confidence
                            </p>
                        </div>
                    </div>

                    {/* Confidence progress bar */}
                    <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: `${clampPercentage(result.confidence)}%`,
                            }}
                            transition={{
                                duration: 0.9,
                                ease: "easeOut",
                            }}
                            className="h-full rounded-full"
                            style={{
                                backgroundColor: categoryStyle.color,
                            }}
                        />
                    </div>

                    {/* Confidence disclaimer */}
                    <div className="mt-5 flex items-start gap-2">
                        <AlertTriangle
                            className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                        />

                        <div className="min-w-0">
                            <p className="text-sm font-medium text-amber-300">
                                {result.uncertain
                                    ? "Low model confidence — verification required"
                                    : "AI prediction — not independently verified"}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-400">
                                Model confidence does not guarantee accuracy.
                                Check the material before following disposal advice.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Classification breakdown */}
            <div className="min-w-0 rounded-3xl border border-white/10 bg-[#0B1C14] p-4 sm:p-6 md:p-8">
                <h3 className="text-lg font-semibold text-white">
                    Classification Breakdown
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                    Model probability estimates across six waste categories
                </p>

                <div className="mt-7 space-y-5">
                    {result.predictions.map((prediction, index) => {
                        const style =
                            CATEGORY_STYLES[prediction.category] ??
                            DEFAULT_STYLE;

                        const Icon = style.icon;

                        return (
                            <div key={prediction.category}>
                                <div className="mb-2 flex min-w-0 items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <Icon
                                            className="h-4 w-4 shrink-0"
                                            style={{ color: style.color }}
                                        />

                                        <span className="min-w-0 break-words text-sm text-slate-300">
                                            {style.label}
                                        </span>
                                    </div>

                                    <span className="shrink-0 text-sm font-medium text-white">
                                        {prediction.confidence.toFixed(2)}%
                                    </span>
                                </div>

                                <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${clampPercentage(
                                                prediction.confidence
                                            )}%`,
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            delay: index * 0.08,
                                            ease: "easeOut",
                                        }}
                                        className="h-full rounded-full"
                                        style={{
                                            backgroundColor: style.color,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Always-visible verification notice */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-amber-500/25 bg-amber-500/[0.08] p-4 sm:p-6"
            >
                <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-400" />

                    <h3 className="text-lg font-semibold text-amber-200">
                        {result.uncertain
                            ? "Prediction Needs Verification"
                            : "Verify the Predicted Material"}
                    </h3>
                </div>

                <p className="mt-3 text-sm leading-7 text-amber-100/80">
                    {result.uncertain
                        ? "The model has low confidence in this classification. Review the object carefully before making a disposal decision."
                        : "This classification has not been independently verified. High model confidence does not guarantee that the predicted material is correct."}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                    {result.uncertain
                        ? "Try another photograph with better lighting, one clearly visible object, and a simple background."
                        : "Confirm the object's actual material, especially when distinguishing plastic, paper, cardboard, glass, and metal."}
                </p>
            </motion.div>

            {/* Suggested recycling guidance */}
            {result.recommendation && (
                <div className="min-w-0 rounded-3xl border border-emerald-500/20 bg-[#0B1C14] p-4 sm:p-6 md:p-8">
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 rounded-xl bg-emerald-500/10 p-3">
                            <Recycle className="h-6 w-6 text-emerald-400" />
                        </div>

                        <div className="min-w-0">
                            <h3 className="text-xl font-semibold text-white">
                                Suggested Recycling Guidance
                            </h3>

                            <p className="mt-1 text-sm text-emerald-300">
                                {result.recommendation.type}
                            </p>

                            <p className="mt-2 text-xs leading-5 text-amber-300/90">
                                This guidance assumes the predicted material is correct.
                                Verify the material before applying these instructions.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-2">
                        {result.recommendation.recyclable ? (
                            <>
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />

                                <span className="text-sm font-medium text-emerald-300">
                                    Potentially recyclable
                                </span>
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />

                                <span className="text-sm font-medium text-amber-300">
                                    Check local disposal requirements
                                </span>
                            </>
                        )}
                    </div>

                    {/* Recycling instructions */}
                    <div className="mt-6 space-y-4">
                        {result.recommendation.instructions.map(
                            (instruction, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: index * 0.08,
                                    }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                    </div>

                                    <p className="min-w-0 text-sm leading-6 text-slate-300">
                                        {instruction}
                                    </p>
                                </motion.div>
                            )
                        )}
                    </div>

                    {/* Eco tip */}
                    <div className="mt-7 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.05] p-4 sm:p-5">
                        <div className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 shrink-0 text-emerald-400" />

                            <h4 className="font-semibold text-white">
                                Eco Tip
                            </h4>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            {result.recommendation.tip}
                        </p>
                    </div>
                </div>
            )}

            {/* Final disclaimer */}
            <p className="px-2 text-center text-xs leading-5 text-slate-500">
                AI predictions may be incorrect even when confidence is high.
                Always verify the material and follow local waste disposal guidelines.
            </p>
        </motion.section>
    );
}
