"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { InventoryItem } from "../components/InventoryItem";

type Item = {
  id: string;
  name: string;
  quantity: number;
};

export default function InventoryManager() {
  const [productName, setProductName] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("inventory_items");
    if (saved) {
      setItems(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("inventory_items", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  useEffect(() => {
    document.title = productName || "Gerenciador de Estoque";
  }, [productName]);

  const updateQuantity = (id: string, amount: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(0, item.quantity + amount) };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const addItem = () => {
    if (productName.trim() === "") return;

    const newItem: Item = {
      id: Date.now().toString(),
      name: productName,
      quantity: 0
    };
    
    setItems((prevItems) => [...prevItems, newItem]);
    setProductName("");
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-black">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Nome do novo produto..."
            className="flex-1 text-xl font-bold p-2 border-b-2 border-gray-200 outline-none focus:border-blue-500"
          />

          <button 
            onClick={addItem}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus size={20} /> Adicionar
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <InventoryItem 
              key={item.id} 
              item={item} 
              onUpdateQuantity={updateQuantity} 
              onRemove={removeItem} 
            />
          ))}
          
          {items.length === 0 && (
            <p className="text-center text-gray-500 py-6">Nenhum item no estoque.</p>
          )}
        </div>
      </div>
    </div>
  );
}