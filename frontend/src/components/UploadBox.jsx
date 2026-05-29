import { useCallback } from 'react';

const UploadBox = ({ onFilesSelected }) => {
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesSelected(Array.from(e.dataTransfer.files));
            e.dataTransfer.clearData();
        }
    }, [onFilesSelected]);

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesSelected(Array.from(e.target.files));
        }
    };

    return (
        <div
            className="w-full border-2 border-dashed border-primary-500 rounded-xl bg-white p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-50 transition-colors shadow-sm"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file-upload').click()}
        >
            <input
                type="file"
                id="file-upload"
                multiple
                accept=".pdf"
                className="hidden"
                onChange={handleChange}
            />
            <svg className="w-12 h-12 text-primary-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800">Drag & drop files here</h3>
            <p className="text-gray-500 mt-2">or click to browse (PDF only)</p>
        </div>
    );
};

export default UploadBox;
