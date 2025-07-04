 import React, { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL; 

const Form = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", data: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);


 const fetchItems = async () => {
  try {
    const res = await fetch(BASE_URL);

    if (!res.ok) {
      const err = await res.json();
      alert("Failed to fetch items. See console.");
      return;
    }

    const data = await res.json();
    setItems(data);
  } catch (error) {
    alert("Error fetching data. Check console.");
  }
};



  const fetchItemById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);

    if (!res.ok) {
      const err = await res.json();
      alert("Failed to fetch item. See console.");
      return;
    }

    const data = await res.json();
    alert(`Fetched by ID:\nName: ${data.name}`);
  } catch (error) {
    alert("Error fetching item. Check console.");
  }
};



  const handleCreate = async () => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, data: { info: form.data } }),
    });
    console.log(res);
    if (!res.ok) {
      const err = await res.json();
      alert("Create failed. See console.");
      return;
    }

    const newItem = await res.json();
    setItems([...items, newItem]);
    setForm({ name: "", data: "" });
  } catch (error) {
    alert("Error saving data. Check console.");
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
      const err = await res.json();
      alert("Failed to update item. See console.");
      return;
    }

    const updatedItem = await res.json();
    setItems(items.map((item) => (item.id === editingId ? updatedItem : item)));
    setForm({ name: "", data: "" });
    setEditingId(null);
  } catch (error) {
    alert("Error updating data. Check console.");
  }
};


 const handleDelete = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Failed to delete item. See console.");
      return;
    }

    setItems(items.filter((item) => item.id !== id));
  } catch (error) {
    alert("Error deleting item. Check console.");
  }
};


  const handleEdit = (item) => {
    setForm({ name: item.name, data: item.data?.info || "" });
    setEditingId(item.id);
  };

  return (
<div className="flex gap-8 max-w-3xl mx-auto p-8  mt-52 bg-purple-900 rounded-xl text-white shadow-lg">
 

  <div className="space-y-4">
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
          <button onClick={() => fetchItemById(item.id)} className="text-blue-600 font-medium">View</button>
          <button onClick={() => handleEdit(item)} className="text-yellow-600 font-medium">Edit</button>
          <button onClick={() => handleDelete(item.id)} className="text-red-600 font-medium">Delete</button>
        </div>
      </li>
    ))}
  </ul>
</div>



  );
};

export default Form;
