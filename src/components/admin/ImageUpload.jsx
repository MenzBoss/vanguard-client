import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ImageUpload({ value, onChange, label = 'Image', preview = true }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>

      {value && preview ? (
        <div className="relative group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 dark:border-navy-700"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80';
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove image"
          >
            <X size={16} />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 px-3 py-1.5 bg-navy-900/80 text-white text-xs rounded hover:bg-navy-900 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Change
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-navy-700 rounded-lg p-8 text-center cursor-pointer hover:border-gold-500 dark:hover:border-gold-500 transition-colors"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-gold-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={32} className="text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, GIF, WEBP up to 5MB</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {value && !preview && (
        <div className="mt-2 flex items-center gap-2">
          <p className="text-xs text-green-500 flex items-center gap-1">
            <ImageIcon size={12} /> Image uploaded
          </p>
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
