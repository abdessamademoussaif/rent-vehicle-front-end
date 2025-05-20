import { useState, useEffect } from "react";
import axios from "axios";

export default function CategoryMarkManager() {
  const [categories, setCategories] = useState([]);
  const [marks, setMarks] = useState([]);
  const [formType, setFormType] = useState("category");
  const [formData, setFormData] = useState({ name: "", image: null });
  const [previewUrl, setPreviewUrl] = useState(null);

  const imageNotFound =
    "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB1idTD7.img?w=768&h=461&m=6";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [catRes, markRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/categories`),
      axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/marks`),
    ]);
    setCategories(catRes.data.data);
    setMarks(markRes.data.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    if (formData.image) data.append("image", formData.image);

    const endpoint = formType === "category" ? "/api/categories" : "/api/marks";
    await axios.post(endpoint, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setFormData({ name: "", image: null });
    setPreviewUrl(null);
    fetchData();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Manage Categories & Marks</h2>

      {/* Display Lists */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-medium">All Categories</h3>
          <div className="grid grid-cols-2 gap-4 mt-7">
            {categories?.map((cat) => (
              <div
                key={cat._id}
                className="border bg-white rounded-xl p-3 flex flex-col items-center hover:shadow-md cursor-pointer"
              >
                <img
                  src={cat.image || imageNotFound}
                  alt={cat.name}
                  width={65}
                  height={65}
                  onError={(e) => (e.target.src = imageNotFound)}
                />
                <h2 className="mt-2">{cat.name}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium">All Marks</h3>
          <div className="grid grid-cols-2 gap-4 mt-7">
            {marks?.map((mark) => (
              <div
                key={mark._id}
                className="border bg-white rounded-xl p-3 flex flex-col items-center hover:shadow-md cursor-pointer"
              >
                <img
                  src={mark.image || imageNotFound}
                  alt={mark.name}
                  width={65}
                  height={65}
                  onError={(e) => (e.target.src = imageNotFound)}
                />
                <h2 className="mt-2">{mark.name}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">
          Add New {formType === "category" ? "Category" : "Mark"}
        </h3>

        <div className="mb-4 space-x-2">
          <button
            className={`px-3 py-1 rounded ${
              formType === "category" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFormType("category")}
          >
            Category
          </button>
          <button
            className={`px-3 py-1 rounded ${
              formType === "mark" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFormType("mark")}
          >
            Mark
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />

          {previewUrl && (
            <div className="mt-2">
              <p className="text-sm mb-1">Image Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="h-24 w-auto object-contain border rounded"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add {formType}
          </button>
        </form>
      </div>
    </div>
  );
}
