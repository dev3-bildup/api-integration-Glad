import React, { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

const Form = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", data: "" });
  const [editingId, setEditingId] = useState(null);

  // Get or generate userId
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      const userId = crypto.randomUUID();
      localStorage.setItem("userId", userId);
    }
    fetchItems();
  }, []);

  const USER_ID = localStorage.getItem("userId");

  const fetchItems = async () => {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    const filtered = data.filter(item => item.userId === USER_ID);
    setItems(filtered);
  };

  const fetchItemById = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    const data = await res.json();
    alert(`Fetched by ID:\nName: ${data.name}`);
  };

  const handleCreate = async () => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        data: { info: form.data },
        userId: USER_ID,
      }),
    });
    const newItem = await res.json();
    setItems([...items, newItem]);
    setForm({ name: "", data: "" });
  };

  const handleUpdate = async () => {
    const res = await fetch(`${BASE_URL}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        data: { info: form.data },
        userId: USER_ID, 
      }),
    });
    const updatedItem = await res.json();
    setItems(items.map((item) => (item.id === editingId ? updatedItem : item)));
    setForm({ name: "", data: "" });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    setItems(items.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, data: item.data?.info || "" });
    setEditingId(item.id);
  };

  return (
    <div className="flex gap-8 w-[70%] justify-between mx-auto p-8 mt-52 bg-purple-900 rounded-xl text-white shadow-lg">
      <div className="w-1/2">
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
          <input
            className="border border-white p-[48px] w-full rounded bg-white text-black"
            placeholder="Fill in here..."
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
          />
        </div>

        {editingId ? (
          <button
            className="bg-yellow-500 text-white mt-4 px-6 py-3 rounded hover:bg-yellow-600 transition"
            onClick={handleUpdate}
          >
            Update
          </button>
        ) : (
          <button
            className="bg-blue-600 text-white px-6 mt-4 py-3 rounded hover:bg-blue-700 transition"
            onClick={handleCreate}
          >
            Create
          </button>
        )}
      </div>

      <ul className="w-1/2">
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
                onClick={() => fetchItemById(item.id)}
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
  );
};

export default Form;
