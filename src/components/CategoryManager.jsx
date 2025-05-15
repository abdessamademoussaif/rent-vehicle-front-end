const categories = ['SUV', 'Sedan', 'Truck'];

export default function CategoryManager() {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Manage Categories / Marks</h2>
      <ul className="space-y-2">
        {categories.map((cat, idx) => (
          <li key={idx} className="flex justify-between items-center border-b pb-1">
            <span>{cat}</span>
            <button className="text-red-500 hover:underline">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
