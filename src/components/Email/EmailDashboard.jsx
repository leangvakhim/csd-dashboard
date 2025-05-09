import React, {useState, useEffect} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_ENDPOINTS, API } from '../../service/APIConfig';

const EmailDashboard = () => {
    const [emails, setEmails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState(null);
    // Calculate pagination
    const totalPages = Math.ceil(emails.length / rowsPerPage);
    const indexOfLastEmail = currentPage * rowsPerPage;
    const indexOfFirstEmail = indexOfLastEmail - rowsPerPage;
    const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);

    useEffect(() => {
        axios.get(API_ENDPOINTS.getMail)
            .then(response => {
                setEmails(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

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

    const handleDeleteSelected = () => {
        if (selectedEmails.length === 0) return;

        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete selected emails!',
            icon: 'warning',
            showCancelButton: true,
            customClass: {
                confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 !mr-2',
                cancelButton: '!bg-red-600 hover:!bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:!ring-red-400'
            },
            confirmButtonText: 'Yes, delete them!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(API_ENDPOINTS.deleteMail, { m_id: selectedEmails })
                    .then(() => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Selected emails have been deleted.',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false
                        });

                        setTimeout(() => {
                            setEmails(prev => prev.filter(email => !selectedEmails.includes(email.m_id)));
                            setSelectedEmails([]);
                        }, 1500);
                    })
                    .catch(error => {
                        console.error('Failed to delete emails:', error);
                        Swal.fire('Error', 'There was an error deleting the emails.', 'error');
                    });
            }
        });
    };

    return (
        <div className="relative overflow-x-auto py-8 px-12">
            <div>
                <button
                    type="button"
                    onClick={handleDeleteSelected}
                    class="focus:outline-none text-white !bg-red-700 hover:!bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-md !px-5 !py-2.5 mb-2">Delete</button>
            </div>
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
                        <th className="px-4 py-3">
                            <input
                                type="checkbox"
                                className='!border-gray-300'
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedEmails(currentEmails.map((email) => email.m_id));
                                    } else {
                                        setSelectedEmails([]);
                                    }
                                }}
                                checked={currentEmails.length > 0 && selectedEmails.length === currentEmails.length}
                            />
                        </th>
                        <th className="px-4 py-3">First Name</th>
                        <th className="px-4 py-3">Last Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">View</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmails.map((email) => (
                        <tr key={email.m_id} className="bg-white border-b border-gray-200">
                        <td className="px-4 py-4">
                            <input
                            type="checkbox"
                            className='!border-gray-300'
                            checked={selectedEmails.includes(email.m_id)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                setSelectedEmails([...selectedEmails, email.m_id]);
                                } else {
                                setSelectedEmails(selectedEmails.filter(id => id !== email.m_id));
                                }
                            }}
                            />
                        </td>
                        <td className="px-4 py-4">{email.m_firstname}</td>
                        <td className="px-4 py-4">{email.m_lastname}</td>
                        <td className="px-4 py-4">{email.m_email}</td>
                        <td
                            className="px-4 py-4 cursor-pointer hover:text-blue-600"
                            onClick={() => {
                                setSelectedEmail(email);
                                setIsModalOpen(true);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round" className="icon icon-tabler icon-tabler-mail-opened">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M3 9l9 6l9 -6l-9 -6l-9 6" />
                            <path d="M21 9v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
                            <path d="M3 19l6 -6" />
                            <path d="M15 13l6 6" />
                            </svg>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
                    <div className="flex justify-between items-center !border-b-2 pb-3">
                        <h3 className="text-xl font-semibold">Mail Details</h3>
                        <button
                        onClick={() => setIsModalOpen(false)}
                        className="!text-red-700 hover:!text-red-800">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="py-4 space-y-4">
                        <p className="text-base text-gray-700">
                            <strong>First Name:</strong> {selectedEmail?.m_firstname}
                        </p>
                        <p className="text-base text-gray-700">
                            <strong>Last Name:</strong> {selectedEmail?.m_lastname}
                        </p>
                        <p className="text-base text-gray-700">
                            <strong>Email:</strong> {selectedEmail?.m_email}
                        </p>
                        <p className="text-base text-gray-700">
                            <strong>Description:</strong> {selectedEmail?.m_description}
                        </p>
                    </div>
                    </div>
                </div>
            )}


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

export default EmailDashboard