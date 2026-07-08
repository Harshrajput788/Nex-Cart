import { useState } from "react";
import type { IProductVariant,AttributeField } from "../../../../Types/productVarient";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../../context/hook/Index";
import { createProductVariant } from "../../../../context/api/varient";

const AddProductVarient = () => {

    const {productId} = useParams()

    const [variant, setVariant] = useState<IProductVariant>({
        productId: productId || "",
        sku: "",
        attributes: {},
        price: 0,
        salePrice: undefined,
        stock: 0,
        isActive: true,
        isDeleted: false,
    });

    const dispatch  = useAppDispatch();

    const [attributes, setAttributes] = useState<AttributeField[]>([
        { id: 1, key: "Color", value: "" },
    ]);

    const handleInputChange = (
        field: keyof IProductVariant,
        value: string | number | boolean | undefined
    ) => {
        setVariant((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAttributeChange = (
        id: number,
        field: "key" | "value",
        value: string
    ) => {
        setAttributes((prev) =>
            prev.map((attr) =>
                attr.id === id ? { ...attr, [field]: value } : attr
            )
        );
    };

    const handleAddAttribute = () => {
        setAttributes((prev) => [
            ...prev,
            { id: Date.now(), key: "", value: "" },
        ]);
    };

    const handleRemoveAttribute = (id: number) => {
        setAttributes((prev) => prev.filter((attr) => attr.id !== id));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formattedAttributes: Record<string, string> = {};
        attributes.forEach((attr) => {
            if (attr.key.trim()) {
                formattedAttributes[attr.key.trim()] = attr.value.trim();
            }
        });

        const payload: IProductVariant = {
            ...variant,
            attributes: formattedAttributes,
        };

        console.log("Submitting variant:", payload);
        dispatch(createProductVariant(payload));
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
                        <h1 className="text-2xl font-semibold text-slate-900">
                            Add Product Variant
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-500">
                            Create a new product variant with SKU, pricing, stock, and dynamic
                            attributes.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <h2 className="text-lg font-medium text-slate-900">
                                        Basic Info
                                    </h2>
                                    <div className="mt-5 space-y-4">
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700">
                                                Product ID
                                            </span>
                                            <input
                                                type="text"
                                                readOnly
                                                value={variant.productId}
                                                onChange={(e) =>
                                                    handleInputChange("productId", e.target.value)
                                                }
                                                placeholder="Enter product ID"
                                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700">
                                                SKU
                                            </span>
                                            <input
                                                type="text"
                                                value={variant.sku}
                                                onChange={(e) =>
                                                    handleInputChange("sku", e.target.value)
                                                }
                                                placeholder="Enter SKU"
                                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </label>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <label className="block">
                                                <span className="text-sm font-medium text-slate-700">
                                                    Price
                                                </span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={variant.price}
                                                    onChange={(e) =>
                                                        handleInputChange("price", Number(e.target.value))
                                                    }
                                                    placeholder="0.00"
                                                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-medium text-slate-700">
                                                    Sale Price
                                                </span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={variant.salePrice ?? ""}
                                                    onChange={(e) => {
                                                        handleInputChange("salePrice",e.target.value ? Number(e.target.value) : undefined)
                                                    }}
                                                    placeholder="Optional"
                                                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                />
                                            </label>
                                        </div>
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700">
                                                Stock
                                            </span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={variant.stock}
                                                onChange={(e) =>
                                                    handleInputChange("stock", Number(e.target.value))
                                                }
                                                placeholder="Enter available stock"
                                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <h2 className="text-lg font-medium text-slate-900">
                                        Visibility
                                    </h2>
                                    <div className="mt-5 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                Active variant
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                Enable or disable this variant for storefront display.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleInputChange("isActive", !variant.isActive)
                                            }
                                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                                variant.isActive
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-slate-200 text-slate-700"
                                            }`}
                                        >
                                            {variant.isActive ? "Active" : "Inactive"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-medium text-slate-900">
                                                Attributes
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Add custom attribute pairs for this variant.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddAttribute}
                                            className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                                        >
                                            Add attribute
                                        </button>
                                    </div>
                                    <div className="mt-5 space-y-4">
                                        {attributes.map((attr) => (
                                            <div
                                                key={attr.id}
                                                className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1.2fr_1.2fr_auto]"
                                            >
                                                <label className="block">
                                                    <span className="text-sm font-medium text-slate-700">
                                                        Attribute
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={attr.key}
                                                        onChange={(e) =>
                                                            handleAttributeChange(attr.id, "key", e.target.value)
                                                        }
                                                        placeholder="e.g. Color"
                                                        className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                    />
                                                </label>
                                                <label className="block">
                                                    <span className="text-sm font-medium text-slate-700">
                                                        Value
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={attr.value}
                                                        onChange={(e) =>
                                                            handleAttributeChange(attr.id, "value", e.target.value)
                                                        }
                                                        placeholder="e.g. Navy"
                                                        className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                    />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveAttribute(attr.id)}
                                                    className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 sm:w-auto"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <h2 className="text-lg font-medium text-slate-900">
                                        Preview
                                    </h2>
                                    <div className="mt-4 space-y-3 rounded-2xl bg-white p-5 text-sm text-slate-700">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-slate-900">SKU</span>
                                            <span>{variant.sku || "—"}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-slate-900">Price</span>
                                            <span>${variant.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-slate-900">
                                                Sale Price
                                            </span>
                                            <span>
                                                {variant.salePrice !== undefined
                                                    ? `$${variant.salePrice.toFixed(2)}`
                                                    : "None"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-slate-900">Stock</span>
                                            <span>{variant.stock}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-slate-900">
                                                Status
                                            </span>
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    variant.isActive
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-slate-100 text-slate-700"
                                                }`}
                                            >
                                                {variant.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="reset"
                                onClick={() => {
                                    setVariant({
                                        _id: "",
                                        productId: productId || "",
                                        sku: "",
                                        attributes: {},
                                        price: 0,
                                        salePrice: undefined,
                                        stock: 0,
                                        isActive: true,
                                        isDeleted: false,
                                    });
                                    setAttributes([{ id: 1, key: "Color", value: "" }]);
                                }}
                                className="inline-flex justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="inline-flex justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Save Variant
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProductVarient;