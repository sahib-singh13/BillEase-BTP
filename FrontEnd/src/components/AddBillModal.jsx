import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaTimes, FaMinus } from 'react-icons/fa';

const AddBillModal = ({ onClose }) => {
  const [billName, setBillName] = useState('');
  const [shopName, setShopName] = useState('');
  const [date, setDate] = useState('');
  const [items, setItems] = useState([{ name: '', cost: '' }]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleAddItem = () => {
    setItems([...items, { name: '', cost: '' }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      billName,
      shopName,
      date,
      items,
      billImage: selectedFile
    };
    console.log('Form Data:', formData);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Bill</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Bill Photo
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                accept="image/*"
                ref={fileInputRef}
              />
            </label>
            
            {previewUrl && (
              <div className="mt-4 text-center">
                <div className="relative inline-block">
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-md hover:text-red-600 z-10"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                  <img
                    src={previewUrl}
                    alt="Bill preview"
                    className="w-48 h-48 object-cover rounded-lg border-2 border-orange-100"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Bill Name"
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
              className="w-full p-2 border rounded-lg mb-3"
              required
            />
            <input
              type="text"
              placeholder="Shop Name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full p-2 border rounded-lg mb-3"
              required
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Items</h3>
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                  required
                />
                <input
                  type="number"
                  placeholder="Cost"
                  value={item.cost}
                  onChange={(e) => handleItemChange(index, 'cost', e.target.value)}
                  className="w-24 p-2 border rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <FaMinus className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddItem}
              className="text-orange-500 hover:text-orange-600 flex items-center text-sm"
            >
              <FaPlus className="mr-1" /> Add Item
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Submit Bill
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBillModal;