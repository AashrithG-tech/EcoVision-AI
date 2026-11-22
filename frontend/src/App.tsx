
import {
    ArrowRight,
    Leaf,
    Recycle,
    ScanLine,
    Sparkles,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import ImageUploader from "./components/ImageUploader";


import { useState } from "react";
import type { PredictionResult as Result } from "./services/api";
import { classifyWaste } from "./services/api";
import PredictionResult from "./components/PredictionResult";

import RecyclingGuide from "./components/RecyclingGuide";



import {
    getScanHistory,
    saveScan,
    deleteScan,
    clearScanHistory,
} from "./utils/scanHistory";


import type { ScanRecord } from "./utils/scanHistory";

import ScanHistory from "./components/ScanHistory";




function App() {


    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [result, setResult] = useState<Result | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleImageSelect = (file: File | null) => {
        setSelectedFile(file);
        setResult(null);
        setError("");
    };

    const handleAnalyze = async () => {
        if (!selectedFile || loading) return;

        setLoading(true);
        setError("");
        setResult(null);


        try {
            const prediction = await classifyWaste(selectedFile);

            setResult(prediction);

            // Save successful AI classifications to browser storage
            try {
                saveScan(selectedFile.name, prediction);
                setScanHistory(getScanHistory());
            } catch (storageError) {
                console.warn(
                    "Prediction succeeded, but scan history could not be saved.",
                    storageError
                );
            }
        }
        catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to analyze the image."
            );
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteScan = (id: string) => {
        try {
            setScanHistory(deleteScan(id));
        } catch (error) {
            console.error("Failed to delete scan:", error);
            window.alert("Unable to delete the scan.");
        }
    };

    const handleClearHistory = () => {
        try {
            clearScanHistory();
            setScanHistory([]);
        } catch (error) {
            console.error("Failed to clear scan history:", error);
            window.alert("Unable to clear scan history.");
        }
    };



    const [scanHistory, setScanHistory] = useState<ScanRecord[]>(
        () => getScanHistory()
    );


    return (
        <div className="min-h-screen bg-[#07130e] text-white lg:flex">
            <Sidebar />

            <main className="min-w-0 flex-1 pt-16 lg:pt-0">
                {/* Top navigation */}
                <header className="flex items-center justify-between border-b border-white/10 px-6 py-5 lg:px-10">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-widest text-emerald-400">
                            EcoVision Workspace
                        </p>
                        <h2 className="mt-1 text-xl font-semibold">
                            Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        AI Model Integrated
                    </div>
                </header>

                <div
                    id="dashboard"
                    className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-10"
                >

                    <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] px-5 py-4">
                        <div>
                            <p className="text-sm font-semibold text-white">
                                Scan History
                            </p>
                            <p className="text-xs text-slate-400">
                                Successful AI classifications saved locally
                            </p>
                        </div>

                        <div className="rounded-xl bg-emerald-500/15 px-5 py-3">
    <span className="text-2xl font-bold text-emerald-400">
      {scanHistory.length}
    </span>
                            <span className="ml-2 text-xs text-slate-400">
      scans
    </span>
                        </div>
                    </div>

                    {/* Hero */}
                    <section className="relative overflow-hidden rounded-3xl border border-emerald-500/15 bg-gradient-to-br from-[#153C2B] via-[#0D281D] to-[#091A13] p-8 md:p-12">
                        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

                        <div className="relative max-w-2xl">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-300">
                                <Sparkles className="h-4 w-4" />
                                Powered by ResNet18 AI
                            </div>

                            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                                Smarter Waste.
                                <br />
                                <span className="text-emerald-400">
                  Greener Tomorrow.
                </span>
                            </h1>

                            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
                                Discover the power of AI-driven waste classification.
                                Upload an image, identify the material, and learn how
                                to dispose of it responsibly.
                            </p>

                            <a
                                href="#scan"
                                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-[#07130e] transition hover:bg-emerald-300"
                            >
                                Start Scanning
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </section>

                    {/* Feature cards */}
                    <section className="grid gap-5 md:grid-cols-3">
                        {[
                            {
                                title: "AI Classification",
                                description:
                                    "Identify six common waste categories using image recognition.",
                                icon: ScanLine,
                            },
                            {
                                title: "Smart Recycling",
                                description:
                                    "Receive practical guidance for responsible waste disposal.",
                                icon: Recycle,
                            },
                            {
                                title: "Eco Awareness",
                                description:
                                    "Build better recycling habits through informed decisions.",
                                icon: Leaf,
                            },
                        ].map(({ title, description, icon: Icon }) => (
                            <div
                                key={title}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-500/30"
                            >
                                <div className="mb-5 inline-flex rounded-xl bg-emerald-500/10 p-3">
                                    <Icon className="h-6 w-6 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-semibold">{title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </section>

                    {/* Scan section placeholder */}

                    {/* AI Image Scanner */}

                    <section id="scan" className="scroll-mt-8">
                        <ImageUploader
                            onImageSelect={handleImageSelect}
                            disabled={loading}
                        />

                        {selectedFile && (
                            <button
                                type="button"
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-400 px-6 py-4 font-semibold text-[#07130e] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#07130e]/30 border-t-[#07130e]" />
                                        Analyzing with AI...
                                    </>
                                ) : (
                                    <>
                                        <ScanLine className="h-5 w-5" />
                                        Analyze Waste
                                    </>
                                )}
                            </button>
                        )}

                        {error && (
                            <div
                                role="alert"
                                className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
                            >
                                {error}
                            </div>
                        )}

                        {result && <PredictionResult result={result} />}
                    </section>

                    {/* Scan History and Analytics */}
                    <ScanHistory
                        history={scanHistory}
                        onDelete={handleDeleteScan}
                        onClear={handleClearHistory}
                    />


                    {/* Recycling Guide */}
                    <RecyclingGuide />


                </div>
            </main>
        </div>
    );
}

export default App;
