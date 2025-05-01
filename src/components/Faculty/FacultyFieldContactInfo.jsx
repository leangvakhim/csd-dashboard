import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { API, API_ENDPOINTS } from '../../service/APIConfig';
import axios from 'axios';
import { useEffect } from 'react';

const FacultyFieldContactInfo = forwardRef(({ f_id }, ref) => {
    const [rotatedStates, setRotatedStates] = useState({});
    const [contactinfo, setContactinfo] = useState([
        {
            id: "1",
            f_id: f_id,
            title: "Contact info 1",
            fc_name: null,
            display: 0,
            active: 1,
        },
    ]);

    console.log("f_id is; ",f_id);

    useImperativeHandle(ref, () => ({
        getData: () => {
            const sortedContactinfo = [...contactinfo].sort((a, b) => a.fc_order - b.fc_order || 0);
            const contactInfoData = sortedContactinfo.map((item, index) => {
                const baseItem = {
                    f_id: item.f_id,
                    fc_order: index + 1,
                    fc_name: item.fc_name,
                    display: item.display,
                    active: item.active,
                };

                if (typeof item.fc_id === 'number') {
                    baseItem.fc_id = item.fc_id;
                }

                return baseItem;
            });

            return contactInfoData;
        }
    }));



    const handleDeleteContactinfo = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this contact?");
        if (!confirmDelete) return;

        try {
            await axios.put(`${API_ENDPOINTS.deleteFacultyContact}/${id}`);

            // Update contact state without reloading the page
            setContactinfo(prevContactinfo =>
                prevContactinfo.map(contact =>
                    contact.id === id
                        ? { ...contact, active: contact.active ? 0 : 1 } // Mark as deleted
                        : contact
                )
            );

            window.location.reload();
        } catch (error) {
            console.error("❌ Error deleting contact info:", error);
        }
    };


    const handleAddContactinfo = async () => {
        const newContactinfo = {
            id: (contactinfo.length + 1).toString(),
            f_id: f_id,
            title: `Contact info ${contactinfo.length + 1}`,
            fc_name: null,
            display: 0,
            active: 1,
        };
        setContactinfo((prevContactinfo) => [...prevContactinfo, newContactinfo]);

    };

    const toggleRotation = (id) => {
        setRotatedStates((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const onDragEndContactinfo = (result) => {
        if (!result.destination) return;

        const newContactinfo = Array.from(contactinfo);
        const [reorderedContactinfo] = newContactinfo.splice(result.source.index, 1);
        newContactinfo.splice(result.destination.index, 0, reorderedContactinfo);

        setContactinfo(newContactinfo);
    };

    useEffect(() => {
        if (f_id) {
            fetch(`${API_ENDPOINTS.getFacultyContactByFaculty}/${f_id}`)
                .then(res => res.json())
                .then(result => {
                    if (Array.isArray(result.data)) {
                        const formatted = result.data.map((item, index) => ({
                            fc_id: item.fc_id,
                            f_id: item.f_id,
                            id: item.fc_id?.toString(),
                            title: `Contact info ${index + 1}`,
                            fc_name: item.fc_name || '',
                            fc_order: item.fc_order || 0,
                            display: item.display ?? 1,
                            active: item.active ?? 1
                        }));
                        setContactinfo(formatted);
                    }
                })
                .catch(err => console.error("❌ Error fetching faculty contact info:", err));
        }
    }, [f_id]);


    return (
        <div className="flex-1">
            <label className="block text-xl font-medium leading-6 text-white-900">
                Contact Information
            </label>
            <DragDropContext onDragEnd={onDragEndContactinfo}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className='mt-2'>
                            <ul class="h-auto overflow-y-auto border rounded-t-lg mt-1">
                                {contactinfo.map((contactinfos, index) => (
                                    <Draggable
                                        key={contactinfos.id}
                                        draggableId={contactinfos.id}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <li
                                                className={`below-border ${index === contactinfos.length - 1 ? 'border-none' : ''}`}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                            >
                                                {/* Contact Info  */}
                                                <details className='group [&_summary::-webkit-details-marker]:hidden !border-b-1 '>
                                                    <summary className='cursor-pointer flex justify-between rounded-lg px-2 py-2 pl-5 w-full '
                                                        onClick={() => toggleRotation(contactinfos.id)}
                                                    >
                                                        <div className="flex ">
                                                            <div className="cursor-grab my-auto"
                                                                {...provided.dragHandleProps}>
                                                                <svg class="cursor-grab size-5 my-auto" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"></path>
                                                                </svg>
                                                            </div>
                                                            <span className="ml-2 text-lg">
                                                                {contactinfo[index]?.fc_name || ''}
                                                            </span>
                                                        </div>
                                                        <span className=' shrink-0 transition-transform duration-500 group-open:-rotate-0 flex gap-2'>
                                                            <div className='block'>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={1.5}
                                                                    stroke="currentColor"
                                                                    className="size-6 cursor-pointer"
                                                                    onClick={() => handleDeleteContactinfo(contactinfos.fc_id)}
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                </svg>
                                                            </div>
                                                            <span
                                                                className={`cursor-pointer shrink-0 transition-transform duration-300 ${rotatedStates[contactinfos.id] ? "rotate-180" : ""
                                                                    }`}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                                                </svg>
                                                            </span>
                                                        </span>
                                                    </summary>

                                                    {/* Contact Info title */}
                                                    <div className="grid grid-cols-1 gap-4 px-4 py-2">
                                                        <div className="flex-1">
                                                            <label className="block text-xl font-medium leading-6 text-white-900">
                                                                Title
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    type="text"
                                                                    value={contactinfo[index]?.fc_name || ''}
                                                                    onChange={(e) => {
                                                                        const updatedContactinfo = [...contactinfo];  // Create a new copy of the array
                                                                        if (updatedContactinfo[index]) {
                                                                            updatedContactinfo[index].fc_name = e.target.value;  // Safely update the value
                                                                            setContactinfo(updatedContactinfo);  // Update state with new array
                                                                        }
                                                                    }}
                                                                    className="!border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    {/* Display button */}
                                                    <div className="grid grid-cols-1 gap-4 px-4 py-2">
                                                        <div className="flex flex-row items-center w-full gap-4">
                                                            <label className="block text-xl font-medium leading-6 text-white-900">
                                                                Display
                                                            </label>
                                                            <div className="mt-2">
                                                                <label className="toggle-switch mb-1">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={contactinfos.display}
                                                                        onChange={(e) => {
                                                                            const updatedContactinfo = [...contactinfo];
                                                                            updatedContactinfo[index].display = e.target.checked ? 1 : 0;
                                                                            setContactinfo(updatedContactinfo);
                                                                        }}
                                                                    />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </details>
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                            </ul>
                            <a
                                className="flex items-center cursor-pointer p-3 text-sm font-medium text-blue-600 !border-b !border-x rounded-b-lg bg-gray-50  hover:bg-gray-100  hover:underline"
                                onClick={handleAddContactinfo}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 mr-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Add new contact information
                            </a>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
});

export default FacultyFieldContactInfo