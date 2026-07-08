import type { ThumbnailType } from "../../Types/thumbnail";
import { useState, type ChangeEvent, useEffect } from "react";
import {
    type CreateThumbnailInput,
    createThumbnailSchema,
} from "../../schema/thumbnail";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../Input/Input";
import { useCategories } from "../../context/api/category";
import { useCreateThumbnailByAdmin } from "../../context/api/thumbnails";

interface Props {
    onClose: (value: boolean) => void;
}

export const CreateThumbanail: React.FC<Props> = ({
    onClose,
}) => {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CreateThumbnailInput>({
        resolver: zodResolver(createThumbnailSchema),

        defaultValues: {
            type: "BANNER",
            color: "#2563eb",
            heading: "",
            paragraph: "",
            categoryId: "",
        },
    });

    const { mutate: createThumbnails, isPending } = useCreateThumbnailByAdmin(() => onClose(false));

    const { data: categories = [] } = useCategories();

    const [color,setColor] = useState("");

    const [image, setImage] = useState<File | null>(null);

    const [imagePreview, setImagePreview] =
        useState<string>("");

    const [serverError, setServerError] =
        useState<string>("");

    const inputCls =
        "w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

    const handleImage = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        try {
            const file = e.target.files?.[0];

            if (!file) return;

            if (file.size > 2 * 1024 * 1024) {
                setServerError(
                    "Image size must be less than 2MB"
                );
                return;
            }

            if (!file.type.startsWith("image/")) {
                setServerError(
                    "Only image files are allowed"
                );
                return;
            }

            setServerError("");

            setImage(file);

            setValue("thumbnail", file);

            const previewUrl = URL.createObjectURL(file);

            setImagePreview(previewUrl);
        } catch (error) {
            console.log(error);

            setServerError(
                "Failed to process image"
            );
        }
    };

    const onSubmit = async (
        data: CreateThumbnailInput
    ) => {
        try {
            setServerError("");

            if (!image) {
                setServerError(
                    "Thumbnail image is required"
                );

                return;
            }

            const formData = new FormData();

            formData.append("thumbnail", image);

            formData.append("type", data.type);

            console.log(color);

            formData.append(
                "heading",
                data.heading || ""
            );

            formData.append(
                "paragraph",
                data.paragraph || ""
            );

            formData.append(
                "color",
                color
            );

            formData.append(
                "categoryId",
                data.categoryId
            );

            createThumbnails(formData);

            reset();

            setImage(null);

            setImagePreview("");

        } catch (error: any) {
            console.log(error);

            setServerError(
                error?.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-lg"
            >
                <div className="bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6 space-y-4">
                        {serverError && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                                {serverError}
                            </div>
                        )}

                        {imagePreview && (
                            <div className="relative h-36 rounded-2xl overflow-hidden bg-slate-100">
                                <img
                                    src={imagePreview}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                    Thumbnail Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImage}
                                    className={inputCls}
                                />

                                {errors.thumbnail && (
                                    <span className="text-xs text-red-500">
                                        {
                                            errors.thumbnail
                                                ?.message as string
                                        }
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                    Type
                                </label>

                                <select
                                    {...register("type")}
                                    className={`${inputCls} cursor-pointer`}
                                >
                                    {(
                                        [
                                            "PRODUCT",
                                            "CATEGORY",
                                            "BANNER",
                                            "COLLECTION",
                                        ] as ThumbnailType[]
                                    ).map((t) => (
                                        <option
                                            key={t}
                                            value={t}
                                        >
                                            {t}
                                        </option>
                                    ))}
                                </select>

                                {errors.type && (
                                    <span className="text-xs text-red-500">
                                        {errors.type.message}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Input
                                    type="text"
                                    label="Heading"
                                    error={
                                        errors.heading?.message
                                    }
                                    {...register("heading")}
                                />
                            </div>

                            <div className="col-span-2 space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                    Paragraph
                                </label>

                                <textarea
                                    {...register("paragraph")}
                                    rows={3}
                                    placeholder="Short description..."
                                    className={`${inputCls} resize-none`}
                                />

                                {errors.paragraph && (
                                    <span className="text-xs text-red-500">
                                        {
                                            errors.paragraph
                                                .message
                                        }
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1.5 flex-col flex">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                    Accent Color
                                </label>

                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => { setColor(e.target.value) }}
                                    className="w-14 h-10 rounded-xl border border-slate-200 cursor-pointer p-1"
                                />

                                <input
                                    type="text"
                                    value={color}
                                    {...register("color")}
                                    onChange={(e) => { setColor(e.target.value) }}
                                    className="w-full h-10 rounded-xl border border-slate-200 cursor-pointer p-1"
                                />

                                {errors.color && (
                                    <span className="text-xs text-red-500">
                                        {errors.color.message}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                    Category
                                </label>

                                <select
                                    {...register("categoryId")}
                                    className={`${inputCls} cursor-pointer`}
                                >
                                    <option value="">
                                        Select Category
                                    </option>

                                    {categories.map((c) => (
                                        <option
                                            key={c._id}
                                            value={c._id}
                                        >
                                            {c.name}
                                        </option>
                                    ))}
                                </select>

                                {errors.categoryId && (
                                    <span className="text-xs text-red-500">
                                        {
                                            errors.categoryId
                                                .message
                                        }
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={() =>
                                onClose(false)
                            }
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                            <Plus size={20} />

                            {isPending
                                ? "Creating..."
                                : "Create"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};