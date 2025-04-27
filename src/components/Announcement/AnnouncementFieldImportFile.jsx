import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { API_ENDPOINTS } from '../../service/APIConfig';

const AnnouncementFieldImportFile = () => {
    const [file, setFile] = useState(null);
    const handleFileUpload = async (e) => {
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
            console.log("Selected file:", file.name);
        }

        setFile(file);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(API_ENDPOINTS.ImportAnnouncementFile, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

            alert(response.data.message);
        } catch (error) {
            console.error('Import failed:', error);
            alert('Import failed! Please check your file.');
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