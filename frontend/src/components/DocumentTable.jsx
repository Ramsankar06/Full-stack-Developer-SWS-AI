const DocumentTable = ({ documents }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">File Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Upload Date</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-primary-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-900">{doc.fileName}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-500">{(doc.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-500">{new Date(doc.uploadedAt).toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a 
                                    href={`http://localhost:8081/api/documents/${doc.id}/download`} 
                                    className="text-primary-600 hover:text-primary-900"
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    Download
                                </a>
                            </td>
                        </tr>
                    ))}
                    {documents.length === 0 && (
                        <tr>
                            <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                No documents uploaded yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentTable;
