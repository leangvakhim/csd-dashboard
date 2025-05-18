import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { API_ENDPOINTS, axiosInstance } from '../../service/APIConfig';
import Swal from 'sweetalert2';

const AnnouncementFieldImportFile = ({ onDelete, selectedStudents }) => {
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

            Swal.fire({
                title: "Import File!",
                text: response.data.message || "Import successful!",
                icon: "success",
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: true,
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded',
                },
                didOpen: () => {
                    const popup = Swal.getPopup();
                    popup.setAttribute('draggable', 'true');
                    popup.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text/plain', null);
                    });
                }
            }).then(() => {
                window.location.reload();
            });
        } catch (error) {
            console.error('Import failed:', error);
            Swal.fire({
                title: 'Error',
                text: 'Import failed! Please check your file.',
                icon: 'error',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded',
                },
            });
        }
    };

    return (
        <div className="flex items-center gap-4 mt-2">
            <div className='flex gap-4'>
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
                <button
                    onClick={onDelete}
                    disabled={selectedStudents.length === 0}
                    className="!bg-red-600 text-white font-medium px-4 py-2 rounded hover:!bg-red-700 cursor-pointer"
                >
                    Delete Records
                </button>
            </div>
        </div>
    )
}

export default AnnouncementFieldImportFile