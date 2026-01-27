
import React, { useState } from 'react';


const MAX_IMAGE_SIZE = 500 * 1024; // 500 KB

const ImageUploadPreview = ({ 
    label, 
    onFileChange, 
    preview = null, 
    required = false,
    colSpan = '1',
    error = null,
    disabled = false,
    accept = 'image/*',
}) => {
    const [sizeError, setSizeError] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file && file.size > MAX_IMAGE_SIZE) {
            setSizeError('A imagem deve ter no máximo 500 KB.');
            // Limpa o input
            e.target.value = '';
            // Não chama o onFileChange
            return;
        } else {
            setSizeError(null);
        }
        onFileChange && onFileChange(e);
    };

    return (
        <div className={`sm:col-span-${colSpan}`}>
            {label && (
                <label className="block text-gray-700 text-sm font-bold mb-1">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="mb-3">
                <input
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    required={required}
                    disabled={disabled}
                    className={`block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100
                        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    `}
                />
            </div>
            {preview && (
                <div className="mt-2 mb-1">
                    <img
                        src={preview}
                        alt="Preview"
                        className="max-w-full h-auto rounded border border-gray-300"
                        style={{ maxHeight: '200px' }}
                    />
                </div>
            )}
            {(sizeError || error) && (
                <p className="text-red-500 text-xs mb-2">{sizeError || error}</p>
            )}
        </div>
    );
};

export default ImageUploadPreview;
