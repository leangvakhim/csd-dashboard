import React, {useEffect} from 'react'
import { Link } from 'react-router-dom'

const ScholarshipHeader = () => {
    //   const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
        const aside = document.getElementById('application-sidebar-brand');
        const toggleBtn = document.getElementById('headerCollapse');
        let overlay = document.getElementById('sidebar-overlay');
        if (
            aside &&
            aside.classList.contains('hs-overlay-open:translate-x-0') &&
            !aside.contains(event.target) &&
            !toggleBtn.contains(event.target)
        ) {
            aside.classList.remove('hs-overlay-open:translate-x-0');
            aside.classList.add('-translate-x-full');
            // hide overlay
            if (overlay) {
            overlay.remove();
            }
        }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <header className="container full-container w-full text-sm py-5 xl:px-9 px-5 border-b-2 border-b-gray-900">
            <nav className="w-full flex items-center justify-start gap-4" aria-label="Global">
            <div className="relative xl:hidden">
                <button
                    className="text-xl cursor-pointer text-heading"
                    id="headerCollapse"
                    onClick={() => {
                    const aside = document.getElementById('application-sidebar-brand');
                    let overlay = document.getElementById('sidebar-overlay');
                    if (aside) {
                        const isVisible = aside.classList.contains('hs-overlay-open:translate-x-0');
                        if (isVisible) {
                        aside.classList.remove('hs-overlay-open:translate-x-0');
                        aside.classList.add('-translate-x-full');
                        // hide overlay
                        if (overlay) {
                            overlay.remove();
                        }
                        } else {
                        aside.classList.add('hs-overlay-open:translate-x-0');
                        aside.classList.remove('-translate-x-full');
                        // show overlay
                        if (!overlay) {
                            overlay = document.createElement('div');
                            overlay.id = 'sidebar-overlay';
                            overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-[998] xl:hidden';
                            document.body.appendChild(overlay);
                        }
                        }
                    }
                    }}
                    aria-controls="application-sidebar-brand"
                    aria-label="Toggle navigation"
                >
                    <i className="ti ti-menu-2 relative z-1"></i>
                </button>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                    to="/scholarship/scholarship-details"
                    className="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700"
                    aria-current="scholarship"
                    >
                    Add Scholarship
                    </Link>
                </div>
            </nav>
        </header>
    )
}

export default ScholarshipHeader