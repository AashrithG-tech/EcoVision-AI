
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
    UploadCloud,
    ImagePlus,
    X,
    FileImage,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

type ImageUploaderProps = {
    onImageSelect?: (file: File | null) => void;
    disabled?: boolean;
};

const MAX_SIZE = 10 * 1024 * 1024;

const ACCEPTED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export default function ImageUploader({
                                          onImageSelect,
                                          disabled = false,
                                      }: ImageUploaderProps) {
    {
        const inputRef = useRef<HTMLInputElement>(null);

        const [image, setImage] = useState<File | null>(null);
        const [preview, setPreview] = useState<string | null>(null);
        const [isDragging, setIsDragging] = useState(false);
        const [error, setError] = useState("");

        useEffect(() => {
            if (!image) {
                setPreview(null);
                return;
            }

            const url = URL.createObjectURL(image);
            setPreview(url);

            return () => URL.revokeObjectURL(url);
        }, [image]);

        const handleFile = (file: File) => {
            if (disabled) return;
            setError("");

            if (!ACCEPTED_TYPES.includes(file.type)) {
                setError("Only JPG, PNG, and WebP images are supported.");
                return;
            }

            if (file.size > MAX_SIZE) {
                setError("Image size must not exceed 10 MB.");
                return;
            }

            if (file.size === 0) {
                setError("The selected image is empty.");
                return;
            }

            setImage(file);
            onImageSelect?.(file);
        };

        const handleInputChange = (
            event: ChangeEvent<HTMLInputElement>
        ) => {
            const file = event.target.files?.[0];

            if (file) handleFile(file);

            event.target.value = "";
        };

        const handleDrop = (event: DragEvent<HTMLDivElement>) => {

            if (disabled) {
                setIsDragging(false);
                return;
            }
            event.preventDefault();
            setIsDragging(false);

            const file = event.dataTransfer.files?.[0];

            if (file) handleFile(file);
        };

        const removeImage = () => {
            setImage(null);
            setError("");
            onImageSelect?.(null);
        };

        return (
            <section className="rounded-3xl border border-white/10 bg-[#0B1C14] p-6 md:p-8">
                <div className="mb-7 flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-500/10 p-3">
                        <ImagePlus className="h-6 w-6 text-emerald-400"/>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            AI Waste Scanner
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Upload an image to identify its waste category.
                        </p>
                    </div>
                </div>

                {!image ? (
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => inputRef.current?.click()}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                inputRef.current?.click();
                            }
                        }}
                        onDragOver={(event) => {
                            event.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={(event) => {
                            event.preventDefault();
                            setIsDragging(false);
                        }}
                        onDrop={handleDrop}
                        className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all md:p-14 ${
                            isDragging
                                ? "border-emerald-400 bg-emerald-500/10"
                                : "border-emerald-500/25 bg-emerald-500/[0.03] hover:border-emerald-400/60 hover:bg-emerald-500/[0.06]"
                        }`}
                    >
                        <div
                            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
                            <UploadCloud className="h-8 w-8 text-emerald-400"/>
                        </div>

                        <h3 className="text-lg font-semibold text-white">
                            Drop your waste image here
                        </h3>

                        <p className="mt-2 text-sm text-slate-400">
                            Or click to browse files from your device
                        </p>

                        <div
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-[#07130e]">
                            <ImagePlus className="h-4 w-4"/>
                            Choose Image
                        </div>

                        <p className="mt-5 text-xs text-slate-500">
                            JPG, PNG or WebP • Maximum 10 MB
                        </p>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5">
                        <div className="relative overflow-hidden rounded-xl bg-black/20">
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Selected waste"
                                    className="max-h-80 w-full object-contain"
                                />
                            )}

                            <button
                                type="button"
                                onClick={removeImage}
                                aria-label="Remove selected image"
                                className="absolute right-3 top-3 rounded-lg bg-black/70 p-2 text-white transition hover:bg-red-500"
                            >
                                <X className="h-5 w-5"/>
                            </button>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <FileImage className="h-6 w-6 shrink-0 text-emerald-400"/>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-white">
                                        {image.name}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        {(image.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-emerald-400">
                                <CheckCircle2 className="h-4 w-4"/>
                                Image Ready
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="mt-5 rounded-xl border border-emerald-500/30 px-5 py-2.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/10"
                        >
                            Replace Image
                        </button>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleInputChange}
                    className="hidden"
                    aria-label="Upload waste image"
                    disabled={disabled}
                />

                {error && (
                    <div
                        role="alert"
                        className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
                    >
                        <AlertCircle className="h-5 w-5 shrink-0"/>
                        {error}
                    </div>
                )}
            </section>
        );
    }
}
