

const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:8000"
).replace(/\/+$/, "");


export interface Prediction {
    category: string;
    confidence: number;
}

export interface Recommendation {
    type: string;
    recyclable: boolean;
    color: string;
    instructions: string[];
    tip: string;
}

export interface PredictionResult {
    category: string;
    confidence: number;
    predictions: Prediction[];
    uncertain: boolean;
    recommendation: Recommendation | null;
    message: string;
}

interface PredictionResponse {
    success: boolean;
    result: PredictionResult;
}

export async function classifyWaste(
    file: File
): Promise<PredictionResult> {
    const formData = new FormData();

    // The field name must match FastAPI's "file" parameter.
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        let message = `Request failed (${response.status})`;

        try {
            const errorData = await response.json();
            message = errorData.detail || message;
        } catch {
            // Use the HTTP status message.
        }

        throw new Error(message);
    }

    const data: PredictionResponse = await response.json();

    if (!data.success || !data.result) {
        throw new Error("Invalid response from the AI server.");
    }

    return data.result;
}
