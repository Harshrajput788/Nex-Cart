import React, { useCallback, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ICategory } from "../../../Types/category";

import {
  useCategories,
  useDeleteCategoryByAdmin,
} from "../../../context/api/category";

import UpdateCategory from "../../../components/Categories/UpdateCategory";
import AlertBox from "../../../components/Alert/Alert";

type CategoryNode = ICategory & {
  children: CategoryNode[];
};

const buildCategoryTree = (categories: ICategory[]): CategoryNode[] => {
  const map = new Map<string, CategoryNode>();
  const tree: CategoryNode[] = [];

  for (const category of categories) {
    map.set(category._id, {
      ...category,
      children: [],
    });
  }

  for (const category of categories) {
    const node = map.get(category._id);

    if (!node) continue;

    if (category.parent?._id) {
      const parentNode = map.get(category.parent._id);

      if (parentNode) {
        parentNode.children.push(node);
      } else {
        tree.push(node);
      }
    } else {
      tree.push(node);
    }
  }

  return tree;
};

const filterCategoryTree = (
  nodes: CategoryNode[],
  searchTerm: string,
  filterStatus: "all" | "active" | "inactive"
): CategoryNode[] => {
  const filterNode = (node: CategoryNode): CategoryNode | null => {
    const matchesSearch =
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && node.isActive) ||
      (filterStatus === "inactive" && !node.isActive);

    const filteredChildren = node.children
      .map(filterNode)
      .filter(Boolean) as CategoryNode[];

    if ((matchesSearch && matchesStatus) || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren,
      };
    }

    return null;
  };

  return nodes
    .map(filterNode)
    .filter(Boolean) as CategoryNode[];
};

interface CategoryRowProps {
  category: CategoryNode;
  depth: number;
  expandedCategories: Set<string>;
  onToggleExpand: (id: string) => void;
  onEdit: (category: ICategory) => void;
  onDelete: (category: ICategory) => void;
  onToggleActive: (category: ICategory) => void;
}

const CategoryRow: React.FC<CategoryRowProps> = React.memo(
  ({
    category,
    depth,
    expandedCategories,
    onToggleExpand,
    onEdit,
    onDelete,
    onToggleActive,
  }) => {
    const hasChildren = category.children.length > 0;
    const isExpanded = expandedCategories.has(category._id);

    return (
      <>
        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
          <td className="px-4 py-3">
            <div
              className="flex items-center"
              style={{ paddingLeft: `${depth * 24}px` }}
            >
              {hasChildren ? (
                <button
                  type="button"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                  onClick={() => onToggleExpand(category._id)}
                  className="mr-2 p-1 rounded hover:bg-blue-100 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-blue-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ) : (
                <div className="w-8" />
              )}

              <div>
                <h3 className="font-medium text-gray-900">
                  {category.name}
                </h3>

                <p className="text-xs text-gray-500 mt-0.5">
                  /{category.slug}
                </p>
              </div>
            </div>
          </td>

          <td className="px-4 py-3 hidden md:table-cell">
            <p className="text-sm text-gray-600 line-clamp-2">
              {category.description || "-"}
            </p>
          </td>

          <td className="px-4 py-3 hidden lg:table-cell">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              Level {category.level}
            </span>
          </td>

          <td className="px-4 py-3">
            <button
              type="button"
              onClick={() => onToggleActive(category)}
              className="cursor-pointer"
            >
              {category.isActive ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <Eye className="w-3 h-3 mr-1" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  <EyeOff className="w-3 h-3 mr-1" />
                  Inactive
                </span>
              )}
            </button>
          </td>

          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                title="Edit"
                onClick={() => onEdit(category)}
                className="p-2 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <Edit2 className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
              </button>

              <button
                type="button"
                title="Delete"
                onClick={() => onDelete(category)}
                className="p-2 rounded-lg hover:bg-red-100 transition-colors group"
              >
                <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
              </button>
            </div>
          </td>
        </tr>

        {isExpanded &&
          category.children.map((child) => (
            <CategoryRow
              key={child._id}
              category={child}
              depth={depth + 1}
              expandedCategories={expandedCategories}
              onToggleExpand={onToggleExpand}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
            />
          ))}
      </>
    );
  }
);

CategoryRow.displayName = "CategoryRow";

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useCategories();

  const deleteCategoryMutation = useDeleteCategoryByAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const [showFilters, setShowFilters] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState<ICategory | null>(null);

  const categories = useMemo(() => {
    return (data || []).filter((category) => !category.isDeleted);
  }, [data]);

  const categoryTree = useMemo(() => {
    return buildCategoryTree(categories);
  }, [categories]);

  const filteredTree = useMemo(() => {
    return filterCategoryTree(
      categoryTree,
      searchTerm,
      filterStatus
    );
  }, [categoryTree, searchTerm, filterStatus]);

  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.isActive
  ).length;

  const inactiveCategories = categories.filter(
    (category) => !category.isActive
  ).length;

  const toggleExpand = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const updated = new Set(prev);

      if (updated.has(categoryId)) {
        updated.delete(categoryId);
      } else {
        updated.add(categoryId);
      }

      return updated;
    });
  }, []);

  const handleEdit = useCallback((category: ICategory) => {
    setSelectedCategory(category);
    setShowModal(true);
  }, []);

  const handleDelete = useCallback((category: ICategory) => {
    setSelectedCategory(category);
    setShowDeleteAlert(true);
  }, []);

  const handleToggleActive = useCallback((category: ICategory) => {
    console.log("Toggle category:", category._id);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">
          Loading categories...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 font-semibold">
          {error instanceof Error
            ? error.message
            : "Something went wrong"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 md:p-6 lg:p-8">
      {showDeleteAlert &&
        selectedCategory && (
          <AlertBox
            id={selectedCategory._id}
            name={selectedCategory.name}
            mutation={deleteCategoryMutation}
            setDelete={setShowDeleteAlert}
          />
        )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Categories
          </h1>

          <p className="text-gray-600 mt-1">
            Manage your product category hierarchy
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>

            <div className="hidden lg:flex gap-2">
              {["all", "active", "inactive"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setFilterStatus(
                      status as "all" | "active" | "inactive"
                    )
                  }
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    filterStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/categories/add-category")
              }
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Category
            </button>
          </div>

          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 flex gap-2">
              {["all", "active", "inactive"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setFilterStatus(
                      status as "all" | "active" | "inactive"
                    )
                  }
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    filterStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                    Name
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase hidden md:table-cell">
                    Description
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase hidden lg:table-cell">
                    Level
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTree.length > 0 ? (
                  filteredTree.map((category) => (
                    <CategoryRow
                      key={category._id}
                      category={category}
                      depth={0}
                      expandedCategories={expandedCategories}
                      onToggleExpand={toggleExpand}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleActive={handleToggleActive}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center"
                    >
                      <div className="flex flex-col items-center text-gray-500">
                        <Search className="w-10 h-10 mb-3 text-gray-300" />

                        <h3 className="text-lg font-medium">
                          No categories found
                        </h3>

                        <p className="text-sm mt-1">
                          Try changing your filters or search
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">
              Total Categories
            </p>

            <h3 className="text-2xl font-bold text-blue-600 mt-1">
              {totalCategories}
            </h3>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">
              Active Categories
            </p>

            <h3 className="text-2xl font-bold text-green-600 mt-1">
              {activeCategories}
            </h3>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">
              Inactive Categories
            </p>

            <h3 className="text-2xl font-bold text-gray-600 mt-1">
              {inactiveCategories}
            </h3>
          </div>
        </div>
      </div>

      {showModal && selectedCategory && (
        <UpdateCategory
          setShowModal={setShowModal}
          category={selectedCategory}
        />
      )}
    </div>
  );
};

export default CategoriesPage;