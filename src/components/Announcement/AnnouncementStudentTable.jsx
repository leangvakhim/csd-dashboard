import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../service/APIConfig';

const AnnouncementStudentTable = () => {
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        axios.get(API_ENDPOINTS.getAnnouncementStudent)
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    // Calculate pagination
    const totalPages = Math.ceil(students.length / rowsPerPage);
    const indexOfLastStudent = currentPage * rowsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - rowsPerPage;
    const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="relative overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <label htmlFor="rowsPerPage" className="mr-2">Rows per page:</label>
                    <select
                        id="rowsPerPage"
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border !rounded px-2 py-1 !border-gray-300"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>
            <table className="w-full text-sm text-left text-gray-500 border">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 !border-b">
                    <tr>
                        <th className="px-6 py-3">NO.</th>
                        <th className="px-6 py-3">Student ID</th>
                        <th className="px-6 py-3">SE</th>
                        <th className="px-6 py-3">MIS</th>
                        <th className="px-6 py-3">Web</th>
                        <th className="px-6 py-3">Linux</th>
                        <th className="px-6 py-3">OOAD</th>
                        <th className="px-6 py-3">Result</th>
                    </tr>
                </thead>
                <tbody>
                    {currentStudents.map((student, index) => (
                        <tr key={index} className="bg-white border-b border-gray-200">
                            <td className="px-6 py-4">{indexOfFirstStudent + index + 1}</td>
                            <td className="px-6 py-4">{student.student_id}</td>
                            <td className="px-6 py-4">{student.SE ?? '-'}</td>
                            <td className="px-6 py-4">{student.MIS ?? '-'}</td>
                            <td className="px-6 py-4">{student.Web ?? '-'}</td>
                            <td className="px-6 py-4">{student.Linux ?? '-'}</td>
                            <td className="px-6 py-4">{student.OOAD ?? '-'}</td>
                            <td className="px-6 py-4">{student.result}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
                <button onClick={handlePreviousPage} disabled={currentPage === 1} className="py-2 px-4 border rounded disabled:opacity-50">
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="py-2 px-4 border rounded disabled:opacity-50">
                    Next
                </button>
            </div>
        </div>
    );
}

export default AnnouncementStudentTable;