import { useState, useEffect } from "react";
import { Search, Plus, RefreshCw, Edit, Trash2 } from "lucide-react";
import Card, { CardHeader, CardContent, CardFooter } from "./ui/Card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import FileInput from "./ui/fileInput";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import ConfirmModal from "./ConfirmModal";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
});

const mockCategories = [];

const CategoryGrid = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

  const authHeaders = {
    Authorization: `Bearer ${Cookies.get("authToken")}`,
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/categories");
      const formatted = data.data.map((category) => ({
        id: category._id,
        name: category.name,
        image:
          category.image,
      }));
      setCategories(formatted);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      fetchCategories();
    }, 500);
  };

  const deleteCategory = async(categoryId) => {
    try {
        await api.delete(`/categories/${categoryId}`, {
            headers: authHeaders,
        });
        setCategories((prev) =>
      prev.filter((category) => category.id !== categoryId)
    );
        toast.success("Category deleted successfully");
        setIsModalOpen(false);
    } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category. Please try again.");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const form = new FormData();
    form.append("name", newCategoryName);
    form.append("image", newCategoryImage);
    console.log(form);
    setIsSubmitting(true);
    try {
      const response = await api.post("/categories", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...authHeaders,
        },
      });

      if (response.status === 201) {
        const { _id, name, image } = response.data.data;
        const newCategory = {
          id: _id,
          name,
          image: image,
        };
        setCategories((prev) => [...prev, newCategory]);
        setNewCategoryName("");
        setNewCategoryImage(null);
        toast.success("Category added successfully");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category List */}
      <Card>
        <CardHeader
          title="Categories Management"
          description="View and manage vehicle categories"
          action={
            <Button
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              size="sm"
              onClick={handleRefresh}
            >
              {isLoading ? (
                <RefreshCw size={16} className="ml-1 animate-spin" />
              ) : (
                <RefreshCw size={16} className="ml-1" />
              )}
              Refresh
            </Button>
          }
        />

        <div className="px-6 pt-4 flex flex-wrap gap-4 items-center justify-between border-b border-gray-200 pb-4 relative">
          <div className="w-full md:w-64 relative">
            {!searchTerm && (
              <label
                htmlFor="search"
                className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500"
              >
                <Search className="size-18" />
              </label>
            )}

            <Input
              id="search"
              placeholder="Search categories"
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>

        <CardContent>
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-[10px] border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-40">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-[30%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                        <Edit size={16} className="text-gray-700" />
                      </button>
                      <button
                        className="p-1 bg-white rounded-full shadow-sm hover:bg-red-100 transition-colors"
                        onClick={() =>{ setIsModalOpen(true); setCategoryIdToDelete(category.id)}}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {category.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">
                No categories found matching your search.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Category */}
      <Card>
        <CardHeader
          title="Add New Category"
          description="Create a new vehicle category"
        />

        <form onSubmit={handleAddCategory}>
          <CardContent className="space-y-4">
            <Input
              label="Category Name"
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
              
            />

            <FileInput
              label="Category Image"
              onChange={setNewCategoryImage}
              helperText="Upload an image for the category"
              showPreview
            />
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={!newCategoryName.trim()}
            >
              {isSubmitting ? (
              <>
                <svg
                  class="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Plus className="size-16" />
                Add Category
              </>
            )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      {isModalOpen && (
        <ConfirmModal title={"If you delete this category, all vehicles with it will also be deleted. Do you want to continue?"} onCancel={()=> setIsModalOpen(false)} onConfirm={()=> deleteCategory(categoryIdToDelete)} open={isModalOpen}/>
      )
    }
    </div>
  );
};

export default CategoryGrid;
