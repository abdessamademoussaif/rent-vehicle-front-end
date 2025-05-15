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

const mockMarks = [];

const MarkGrid = () => {
  const [marks, setMarks] = useState(mockMarks);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newMarkName, setNewMarkName] = useState("");
  const [newMarkImage, setNewMarkImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [markIdToDelete, setMarkIdToDelete] = useState(null);
  const authHeaders = {
    Authorization: `Bearer ${Cookies.get("authToken")}`,
  };
  const fetchMarks = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/marks");
      const formatted = data.data.map((mark) => ({
        id: mark._id,
        name: mark.name,
        image: mark.image,
      }));
      setMarks(formatted);
    } catch (error) {
      toast.error("Failed to fetch Marks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, []);

  const filteredMarks = marks.filter((mark) =>
    mark.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  
  const deleteMark = async (markId) => {
    try {
      await api.delete(`/marks/${markId}`, {
        headers: authHeaders,
      });
      setMarks(marks.filter((mark) => mark.id !== markId));
      toast.success("Mark deleted successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting makr:", error);
      toast.error("Failed to delete mark. Please try again.");
    }
  };

  const handleAddMark = async (e) => {
    e.preventDefault();
    if (!newMarkName.trim()) return;

    const form = new FormData();
    form.append("name", newMarkName);
    form.append("image", newMarkImage);
    setIsSubmitting(true);
    try {
      const response = await api.post("/marks", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...authHeaders,
        },
      });

      if (response.status === 201) {
        const { _id, name, image } = response.data.data;
        const newMark = {
          id: _id,
          name,
          image: image,
        };
        setMarks((prev) => [...prev, newMark]);
        setNewMarkName("");
        setNewMarkImage(null);
        toast.success("Mark added successfully");
      }
    } catch (error) {
      console.error("Error adding mark:", error);
      toast.error("Failed to add mark. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Marks Management"
          description="View and manage vehicle marks"
          action={
            <Button
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              size="sm"
              onClick={handleRefresh}
            >
              {isLoading && (
                <RefreshCw size={16} className="ml-1  animate-spin" />
              )}
              {!isLoading && <RefreshCw size={16} className="ml-1" />}
              Refresh
            </Button>
          }
        />

        <div className="px-6 pt-4 flex flex-wrap gap-4 items-center justify-between border-b border-gray-200 pb-4 relative">
          <div className="w-full md:w-64">
            {!searchTerm && (
              <label
                htmlFor="search"
                className="absolute focus:hidden inset-y-0 left-5 pl-3 flex items-center pointer-events-none text-gray-500"
              >
                <Search className="size-18 " />
              </label>
            )}

            <Input
              placeholder=" "
              value={searchTerm}
              id="search"
              onChange={handleSearch}
            />
          </div>
        </div>

        <CardContent>
          {filteredMarks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarks.map((mark) => (
                <div
                  key={mark.id}
                  className="rounded-[10px] border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-40">
                    <img
                      src={mark.image}
                      alt={mark.name}
                      className="w-[30%]   absolute mx-auto top-50% -translate-y-[10%] left-0 right-0 bottom-0"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                        <Edit size={16} className="text-gray-700" />
                      </button>
                      <button
                        className="p-1 bg-white rounded-full shadow-sm hover:bg-red-100 transition-colors"
                        onClick={() => {setIsModalOpen(true); setMarkIdToDelete(mark.id);}}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {mark.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">
                No marks found matching your search.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="Add New Mark"
          description="Create a new vehicle mark"
        />

        <CardContent>
          <form onSubmit={handleAddMark} className="space-y-4">
            <Input
              label="Mark Name"
              placeholder="Enter mark name"
              value={newMarkName}
              onChange={(e) => setNewMarkName(e.target.value)}
              required
              
            />

            <FileInput
              label="Mark Image"
              onChange={setNewMarkImage}
              helperText="Upload an image for the mark"
              showPreview
            />
          </form>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleAddMark}
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={!newMarkName.trim()}
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
                Add Mark
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      {isModalOpen && (
        <ConfirmModal title={"If you delete this mark, all vehicles with it will also be deleted. Do you want to continue?"} onCancel={()=> setIsModalOpen(false)} onConfirm={()=> deleteMark(markIdToDelete)} open={isModalOpen}/>
    )}
    </div>
  );
};

export default MarkGrid;
