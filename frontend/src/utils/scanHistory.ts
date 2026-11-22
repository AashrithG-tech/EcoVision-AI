
import type { PredictionResult } from "../services/api";

const STORAGE_KEY = "ecovision_scan_history";
const MAX_HISTORY = 100;

export interface ScanRecord {
    id: string;
    filename: string;
    timestamp: string;
    result: PredictionResult;
}

export function getScanHistory(): ScanRecord[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) return [];

        const parsed: unknown = JSON.parse(stored);

        if (!Array.isArray(parsed)) return [];

        return parsed.filter(
            (item): item is ScanRecord =>
                typeof item === "object" &&
                item !== null &&
                typeof item.id === "string" &&
                typeof item.filename === "string" &&
                typeof item.timestamp === "string" &&
                typeof item.result === "object" &&
                item.result !== null &&
                typeof item.result.category === "string" &&
                typeof item.result.confidence === "number"
        );
    } catch {
        return [];
    }
}

export function saveScan(
    filename: string,
    result: PredictionResult
): ScanRecord {
    const record: ScanRecord = {
        id: crypto.randomUUID(),
        filename,
        timestamp: new Date().toISOString(),
        result,
    };

    const updated = [
        record,
        ...getScanHistory(),
    ].slice(0, MAX_HISTORY);

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
    );

    return record;
}

export function deleteScan(id: string): ScanRecord[] {
    const updated = getScanHistory().filter(
        (scan) => scan.id !== id
    );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
    );

    return updated;
}

export function clearScanHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
}

export function getScanStatistics(history: ScanRecord[]) {
    const categoryCounts: Record<string, number> = {};

    for (const scan of history) {
        const category = scan.result.category;

        categoryCounts[category] =
            (categoryCounts[category] ?? 0) + 1;
    }

    const totalScans = history.length;

    const uniqueCategories = Object.keys(
        categoryCounts
    ).length;

    const averageConfidence =
        totalScans > 0
            ? history.reduce(
            (sum, scan) => sum + scan.result.confidence,
            0
        ) / totalScans
            : 0;

    return {
        totalScans,
        uniqueCategories,
        averageConfidence,
        categoryCounts,
    };
}
