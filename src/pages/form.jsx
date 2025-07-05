import React, { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

const Form = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", data: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const localData = localStorage.getItem("myItems");
    if (localData) {
      setItems(JSON.parse(localData));
    } else {
      fetchItems();
    }
  }, []);


  const updateItems = (newItems) => {
    setItems(newItems);
    localStorage.setItem("myItems", JSON.stringify(newItems));
  };

  const fetchItems = async () => {
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok) {
        alert("Failed to fetch items.");
        return;
      }
      const data = await res.json();
      updateItems(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching items.");
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, data: { info: form.data } }),
      });

      if (!res.ok) {
        alert("Create failed.");
        return;
      }

      const newItem = await res.json();
      updateItems([...items, newItem]);
      setForm({ name: "", data: "" });
    } catch (error) {
      console.error(error);
      alert("Error saving data.");
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${BASE_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, data: { info: form.data } }),
      });

      if (!res.ok) {
        alert("Update failed.");
        return;
      }

      const updatedItem = await res.json();
      const updatedItems = items.map((item) =>
        item.id === editingId ? updatedItem : item
      );
      updateItems(updatedItems);
      setForm({ name: "", data: "" });
      setEditingId(null);
    } catch (error) {
      console.error(error);
      alert("Error updating item.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Delete failed.");
        return;
      }

      const filtered = items.filter((item) => item.id !== id);
      updateItems(filtered);
    } catch (error) {
      console.error(error);
      alert("Error deleting item.");
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, data: item.data?.info || "" });
    setEditingId(item.id);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-8 mt-20 bg-purple-900 rounded-xl text-white shadow-lg">
 
      <div className="w-full md:w-1/2 space-y-4">
        <h2 className="text-3xl font-bold">Form</h2>
        <div>
          <label>Item</label>
          <input
            className="border border-white p-3 w-full rounded bg-white text-black"
            placeholder="item"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            className="border border-white p-3 w-full rounded bg-white text-black"
            rows="4"
            placeholder="Fill in here..."
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
          ></textarea>
        </div>

        {editingId ? (
          <button
            className="bg-yellow-500 text-white px-6 py-3 rounded hover:bg-yellow-600 transition"
            onClick={handleUpdate}
          >
            Update
          </button>
        ) : (
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
            onClick={handleCreate}
          >
            Create
          </button>
        )}
      </div>


      <div className="w-full md:w-1/2 max-h-[400px] overflow-y-auto pr-2 space-y-4">
        <h2 className="text-2xl font-semibold">Item List</h2>
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="bg-white text-black p-4 rounded-md flex justify-between items-center shadow-sm"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">{item.data?.info}</p>
              </div>
              <div className="space-x-3">
                <button
                  onClick={() => alert(`Item ID: ${item.id}`)}
                  className="text-blue-600 font-medium"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="text-yellow-600 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 font-medium"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Form;
