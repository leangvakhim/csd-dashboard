import React from 'react'
import { Link } from 'react-router-dom'

const AnnouncementFieldImportFile = () => {
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = [
                'text/csv',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];

            if (!validTypes.includes(file.type)) {
                alert('Invalid file type. Please upload a CSV or Excel file.');
                return;
            }

            // Handle the file processing here
            console.log("Selected file:", file.name);
        }
    };

    return (
        <div className="flex items-center gap-4 mt-2">
            <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                id="fileUpload"
                className="hidden"
                onChange={handleFileUpload}
            />
            <label
                htmlFor="fileUpload"
                className="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
            >
                Import File
            </label>
        </div>
    )
}

export default AnnouncementFieldImportFile