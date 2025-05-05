import React, {useState, useEffect} from 'react'

const EmailDashboard = () => {
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedStudents, setSelectedStudents] = useState([]);
    // Calculate pagination
    const totalPages = Math.ceil(students.length / rowsPerPage);
    const indexOfLastStudent = currentPage * rowsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - rowsPerPage;
    const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
    // useEffect(() => {
    //     onSelectedStudentsChange(selectedStudents);
    // }, [selectedStudents, onSelectedStudentsChange]);

    // useEffect(() => {
    //     axios.get(API_ENDPOINTS.getAnnouncementStudent)
    //         .then(response => {
    //             setStudents(response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);
    //         });
    // }, []);

    // const dynamicSubjects = students.length > 0
    // ? Object.keys(students[0]).filter(key =>
    //     !['student_id', 'student_identity', 'result'].includes(key)
    //     )
    // : [];

    // const handlePreviousPage = () => {
    //     if (currentPage > 1) {
    //         setCurrentPage(currentPage - 1);
    //     }
    // };

    // const handleNextPage = () => {
    //     if (currentPage < totalPages) {
    //         setCurrentPage(currentPage + 1);
    //     }
    // };

    return (
        <div className="relative overflow-x-auto py-8 px-12">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <label htmlFor="rowsPerPage" className="mr-2">Rows per page:</label>
                    <select
                        id="rowsPerPage"
                        value={rowsPerPage}
                        // onChange={(e) => {
                        //     setRowsPerPage(parseInt(e.target.value));
                        //     setCurrentPage(1);
                        // }}
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
                        <th className="px-4 py-3">
                            <input
                                type="checkbox"
                                className='!border-gray-300'
                                // onChange={(e) => {
                                //     if (e.target.checked) {
                                //         setSelectedStudents(currentStudents.map((student) => student.student_id));
                                //     } else {
                                //         setSelectedStudents([]);
                                //     }
                                // }}
                                // checked={currentStudents.length > 0 && selectedStudents.length === currentStudents.length}
                            />
                        </th>
                        <th className="px-4 py-3">First Name</th>
                        <th className="px-4 py-3">Last Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">View</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white border-b border-gray-200">
                        <td className="px-4 py-4">
                            <input
                                type="checkbox"
                                className='!border-gray-300'
                                // checked={selectedStudents.includes(student.student_id)}
                                // onChange={(e) => {
                                //     if (e.target.checked) {
                                //         setSelectedStudents([...selectedStudents, student.student_id]);
                                //     } else {
                                //         setSelectedStudents(selectedStudents.filter((id) => id !== student.student_id));
                                //     }
                                // }}
                            />
                        </td>
                        <td className="px-4 py-4">lala</td>
                        <td className="px-4 py-4">lala</td>
                        <td className="px-4 py-4">lala</td>
                        <td className="px-4 py-4 cursor-pointer hover:text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-mail-opened"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 9l9 6l9 -6l-9 -6l-9 6" /><path d="M21 9v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" /><path d="M3 19l6 -6" /><path d="M15 13l6 6" /></svg>
                        </td>
                    </tr>
                </tbody>
                {/* <tbody>
                    {currentStudents.map((student, index) => (
                        <tr key={index} className="bg-white border-b border-gray-200">
                            <td className="px-4 py-4">
                                <input
                                    type="checkbox"
                                    className='!border-gray-300'
                                    checked={selectedStudents.includes(student.student_id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedStudents([...selectedStudents, student.student_id]);
                                        } else {
                                            setSelectedStudents(selectedStudents.filter((id) => id !== student.student_id));
                                        }
                                    }}
                                />
                            </td>
                            {dynamicSubjects.map((subject, idx) => (
                                <td key={idx} className="px-6 py-4">{student[subject] ?? '-'}</td>
                            ))}
                            <td className="px-6 py-4">{student.result}</td>
                        </tr>
                    ))}
                </tbody> */}
            </table>

            <div className="flex justify-between items-center mt-4">
                {/* <button onClick={handlePreviousPage} disabled={currentPage === 1} className="py-2 px-4 border rounded disabled:opacity-50">
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="py-2 px-4 border rounded disabled:opacity-50">
                    Next
                </button> */}
            </div>
        </div>
    );
}

export default EmailDashboard