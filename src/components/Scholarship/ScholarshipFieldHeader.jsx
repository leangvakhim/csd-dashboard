import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ScholarshipFieldHeader = ({ onSave }) => {
    const navigate = useNavigate();

    const returnToPreviousPage = () => {
        navigate(-1); // Navigate back to the previous page
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const aside = document.getElementById('application-sidebar-brand');
            const toggleBtn = document.getElementById('headerCollapse');
            let overlay = document.getElementById('sidebar-overlay');

            if (
                aside &&
                aside.classList.contains('hs-overlay-open:translate-x-0') &&
                !aside.contains(event.target) &&
                (!toggleBtn || !toggleBtn.contains(event.target))
            ) {
                aside.classList.remove('hs-overlay-open:translate-x-0');
                aside.classList.add('-translate-x-full');
                if (overlay) {
                    overlay.remove();
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <header className='px-8 py-2 my-1 bg-white shadow-md rounded-md'>
            <nav className="w-full flex items-center justify-between" aria-label="Global">
                {/* Sidebar Toggle Button */}
                <div className="relative xl:hidden">
                    <button
                        className="text-xl cursor-pointer text-gray-700"
                        id="headerCollapse"
                        onClick={() => {
                            const aside = document.getElementById('application-sidebar-brand');
                            let overlay = document.getElementById('sidebar-overlay');
                            if (aside) {
                                const isVisible = aside.classList.contains('hs-overlay-open:translate-x-0');
                                aside.classList.toggle('hs-overlay-open:translate-x-0', !isVisible);
                                aside.classList.toggle('-translate-x-full', isVisible);
                                if (!isVisible && !overlay) {
                                    overlay = document.createElement('div');
                                    overlay.id = 'sidebar-overlay';
                                    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-[998] xl:hidden';
                                    document.body.appendChild(overlay);
                                } else if (overlay) {
                                    overlay.remove();
                                }
                            }
                        }}
                        aria-controls="application-sidebar-brand"
                        aria-label="Toggle navigation"
                    >
                        <i className="ti ti-menu-2"></i>
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={returnToPreviousPage}
                        className="cursor-pointer !bg-red-600 text-white font-medium px-4 py-2 rounded hover:bg-red-700"
                    >
                        Return
                    </button>
                    <button
                        onClick={onSave}
                        className="cursor-pointer bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default ScholarshipFieldHeader;