import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../../service/APIConfig'

const MenuModal = ({ isOpen, onClose, data}) => {
    const [menuOptions, setMenuOptions] = useState([]);
    const [pageOptions, setPageOptions] = useState([]);
    const [formData, setFormData] = useState({
        lang: 1,
        title: null,
        menup_id: null,
        display: true,
        active: 1,
        p_menu: null,
    });

    useEffect(() => {
        if (data) {
            setFormData({
                lang: data.lang || 1,
                title: data.title || '',
                menup_id: data.menup_id || null,
                display: !!data.display,
                active: data.active ?? 1,
                p_menu: data.p_menu || null,
            });
        }

        const fetchMenus = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.getMenu);
                if (res.data && Array.isArray(res.data.data)) {
                const filteredMenus = res.data.data.filter(menu =>
                    menu.menup_id === null && menu.menu_id !== data?.menu_id
                );
                setMenuOptions(filteredMenus);
                } else {
                console.error('❌ Invalid menu data structure:', res.data.data);
                }
            } catch (err) {
                console.error('❌ Failed to fetch parent menus:', err);
            }
        };

        const fetchPages = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.getPage);
                if (res.data && Array.isArray(res.data.data)) {
                        setPageOptions(res.data.data);
                    } else {
                        console.error('❌ Invalid page data structure:', res.data.data);
                        setPageOptions([]); // fallback
                    }
            } catch (err) {
                console.error('❌ Failed to fetch pages:', err);
            }
        };

        fetchMenus();
        fetchPages();
    }, [data]);

    const saveMenu = async () => {
        const payload = {
            lang: parseInt(formData.lang) || 1,
            title: formData.title || null,
            menup_id: formData.menup_id ? parseInt(formData.menup_id) : null,
            display: formData.display ? 1 : 0,
            active: formData.active ? 1 : 0,
            p_menu: formData.p_menu ? parseInt(formData.p_menu) : null,
        };
        let res;
        if (data?.menu_id) {
            res = await axios.post(`${API_ENDPOINTS.updateMenu}/${data.menu_id}`, payload);
            if (formData.p_menu) {
                await axios.put(`${API_ENDPOINTS.updatePageByMenu}/${formData.p_menu}`, {
                    p_menu: res.data?.data?.menu_id || null,
                });
            }
            window.location.reload();
        } else {
            res = await axios.post(API_ENDPOINTS.createMenu, payload);
            if (formData.p_menu) {
                await axios.put(`${API_ENDPOINTS.updatePageByMenu}/${formData.p_menu}`, {
                    p_menu: res.data?.data?.menu_id || null,
                });
            }
            window.location.reload();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveMenu();
            onClose(); // Close the modal
        } catch (err) {
            if (err.response && err.response.status === 422) {
                console.error('❌ Validation errors:', err.response.data.errors);
            } else {
                console.error('❌ Failed to create menu:', err);
            }
        }
    };

    useEffect(() => {
    if (data) {
        setFormData({
        lang: data.lang || 1,
        title: data.title || '',
        menup_id: data.menup_id || null,
        display: !!data.display,
        active: data.active ?? 1,
        p_menu: null,
    });

    const fetchPages = async () => {
        try {
            const res = await axios.get(API_ENDPOINTS.getPage);
            if (res.data && Array.isArray(res.data.data)) {
                const pages = res.data.data;
                setPageOptions(pages);

                const matchedPage = pages.find(p => p.p_menu === data.menu_id);
                if (matchedPage) {
                        setFormData(prev => ({
                        ...prev,
                        p_menu: matchedPage.p_id
                        }));
                    }
                }
            } catch (err) {
                console.error('❌ Failed to fetch pages:', err);
            }
        };

        fetchPages();
        }
    }, [data]);

    if (!isOpen) return null;
    return (
    <>
      <div className=" fixed inset-0 z-[999] bg-black bg-opacity-50"></div>
        <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="z-[1000] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0  flex items-center justify-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="!bg-white !rounded-lg !shadow-sm relative">
                    <div className="flex items-center justify-between p-4 md:p-5 border rounded-t border-gray-400">
                        <h3 className="text-lg font-semibold text-gray-900 ">
                            Create New Menu
                        </h3>
                        <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center ">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 md:p-5">
                        <div className="grid grid-cols-2 gap-4 mb-4 ">
                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 ">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="!bg-gray-50 !border !border-gray-300 !text-gray-900 text-sm !rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                                />
                            </div>

                            <div className="col-span-1">
                                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 ">Parent Menu</label>
                                <select
                                    value={formData.menup_id}
                                    onChange={(e) => setFormData(prev => ({ ...prev, menup_id: parseInt(e.target.value) || null }))}
                                    className="!bg-gray-50 !border !border-gray-300 !text-gray-900 text-sm !rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                                >
                                    <option value="">Select Parent Menu</option>
                                    {menuOptions.map((menu) => (
                                        <option key={menu.menu_id} value={menu.menu_id}>
                                            {menu.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-1">
                                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 ">Languages</label>
                                <select
                                    value={formData.lang}
                                    onChange={(e) => setFormData(prev => ({ ...prev, lang: parseInt(e.target.value) || 1 }))}
                                    className="!bg-gray-50 !border !border-gray-300 !text-gray-900 text-sm !rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                                >
                                    <option value=""></option>
                                    <option value="1">English</option>
                                    <option value="2">Khmer</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 ">Pages</label>
                                <select
                                    // value={formData.p_menu || ''}
                                    value={formData.p_menu !== null ? formData.p_menu : ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, p_menu: parseInt(e.target.value) || null }))}
                                    className="!bg-gray-50 !border !border-gray-300 !text-gray-900 text-sm !rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                                >
                                    <option value="">Select Page</option>
                                    {Array.isArray(pageOptions) && pageOptions.map((page) => (
                                        <option key={page.p_id} value={page.p_id}>
                                            {page.p_title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-1">
                                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 ">Display</label>
                                <div className="">
                                    <label className="toggle-switch mt-1">
                                        <input
                                            type="checkbox"
                                            checked={formData.display}
                                            onChange={(e) => setFormData(prev => ({ ...prev, display: e.target.checked }))}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button type="submit" className="!bg-blue-600 !text-white font-medium px-4 py-2 rounded-lg hover:!bg-blue-700">
                              Add new menu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default MenuModal