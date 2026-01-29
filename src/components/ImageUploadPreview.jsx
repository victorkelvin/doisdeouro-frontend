
import React from 'react';



const ImageUploadPreview = ({ 
    label, 
    onFileChange, 
    preview = null, 
    required = false,
    colSpan = '1',
    disabled = false,
    accept = 'image/*',
}) => {

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
                    onChange={onFileChange}
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
                        className="max-w-full h-auto rounded border border-gray-300 bg-gray-100"
                        style={{ maxHeight: '200px', background: 'linear-gradient(90deg, #f3f3f3 25%, #e2e2e2 50%, #f3f3f3 75%)' }}
                        loading="lazy"
                        onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/128x128?text=Sem+Foto'; }}
                    />
                </div>
            )}
            {/* {(sizeError || error) && (
                <p className="text-red-500 text-xs mb-2">{sizeError || error}</p>
            )} */}
        </div>
    );
};

export default ImageUploadPreview;
