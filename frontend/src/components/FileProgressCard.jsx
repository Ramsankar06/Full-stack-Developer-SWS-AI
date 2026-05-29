const FileProgressCard = ({ file, minimized }) => {
    const { name, size, progress, status } = file;
    const sizeInMB = (size / (1024 * 1024)).toFixed(2);

    if (minimized) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 truncate w-48">{name}</span>
                <span className="text-xs text-gray-500">{progress}%</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium text-gray-800 truncate w-48 lg:w-64">{name}</span>
                </div>
                <span className="text-sm text-gray-500">{sizeInMB} MB</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div 
                    className={`h-2.5 rounded-full ${status === 'FAILED' ? 'bg-red-500' : 'bg-primary-500'}`} 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            
            <div className="flex justify-between items-center text-xs">
                <span className={`${status === 'FAILED' ? 'text-red-500' : 'text-gray-500'} capitalize`}>
                    {status.toLowerCase()}
                </span>
                <span className="text-gray-500">{progress}%</span>
            </div>
        </div>
    );
};

export default FileProgressCard;
