import { useCategories, useCreateCategoryByAdmin } from "../../../../context/api/category";
import SectionCard from "../../../../components/inputSection/InputSection";
import { FormField } from "../../../../components/Categories/Element";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormData } from "../../../../schema/category";
import { Folder, Plus, Search, Settings, Tag } from "lucide-react";
import { Input } from "../../../../components/Input/Input";

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string;
  level: number;
  isActive: boolean;
  isDeleted: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}


const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 hover:border-slate-300";


export const AddCategoryForm: React.FC = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as Resolver<CategoryFormData>
  })

  const { mutate: createCategory, isPending } = useCreateCategoryByAdmin();

  const { data: categories } = useCategories();



  const onsumbit = (data: CategoryFormData) => {
    data.sortOrder = String(data.sortOrder)
    createCategory(data);
  }



  return (
    <div className="min-h-screen w-full bg-blue-200/5 from-slate-50 via-blue-50/30 to-white">

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Add Category</h1>
            <p className="text-slate-500 text-sm mt-1">Create a new product category for your store</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onsumbit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <SectionCard
                icon={
                  <Tag size={15} />
                }
                title="Basic Information"
                subtitle="Core details about this category"
              >
                <div className="py-6 px-2">
                  <Input {...register("name")} type="text" label="Category Name" error={errors.name?.message} />
                </div>


                <FormField label="Description" hint="Optional">
                  <textarea
                    {...register("description")}
                    placeholder="Brief description of this category..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </FormField>
              </SectionCard>

              <SectionCard
                icon={
                  <Search size={15} />
                }
                title="SEO & Meta"
                subtitle="Improve search engine visibility"
              >
                <div className="py-6 px-2">
                  <Input {...register("metaTitle")} type="text" label="Meta Title" error={errors.metaTitle?.message} />
                </div>

                <FormField label="Meta Description">
                  <textarea
                    {...register("metaDescription")}
                    maxLength={160}
                    placeholder="Short description for search engines..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </FormField>
              </SectionCard>
            </div>

            <div className="space-y-6">
              <SectionCard
                icon={
                  <Folder size={15} />
                }
                title="Hierarchy"
                subtitle="Category structure"
              >
                <FormField label="Parent Category">
                  <select {...register("parent")}>
                    <option value="">No Parent</option>

                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </FormField>
              </SectionCard>

              <SectionCard
                icon={
                  <Settings size={15} />
                }
                title="Settings"
                subtitle="Visibility & order"
              >

                <div className="h-px bg-slate-100" />

                <div className="flex items-center gap-2">
                  <Input type="number" label="Sort Order" {...register("sortOrder",{
                    valueAsNumber:false
                  })} error={errors.sortOrder?.message} />
                </div>
              </SectionCard>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">


            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                disabled={isPending}
                type="submit"
                className="flex-1 cursor-pointer sm:flex-none px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-200 transition-all duration-150 flex items-center justify-center gap-2"
              >
                {
                  isPending ? "Creating..." : <>
                    <Plus size={20} />
                    Create Category
                  </>
                }
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
