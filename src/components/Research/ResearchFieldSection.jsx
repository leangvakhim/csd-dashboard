import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { TbFileDescription } from "react-icons/tb";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DescriptionSection from './Description/DescriptionSection';
import ProjectSection from './Project/ProjectSection';
import MeetingSection from './Meeting/MeetingSection';
import axios from "axios";
import { API_ENDPOINTS } from "../../service/APIConfig";

const ResearchFieldSection = forwardRef(({formData, setFormData}, ref) => {
    const [showSection, setShowSection] = useState(false);
    const [selectedSections, setSelectedSections] = useState([]);
    const descriptionPieceRefs = useRef({});
    const projectPieceRefs = useRef({});
    const meetingPieceRefs = useRef({});

    const handleAddPage = () => {
        setShowSection(!showSection);
    };

    const handleAddSection = (sectionType) => {
        const newId = selectedSections.length + 1;
        setSelectedSections([
            ...selectedSections,
            { id: newId.toString(), type: sectionType, data: {} },
        ]);
        setShowSection(false);
    };

    useEffect(() => {
        const fetchResearchTitles = async () => {
            try {
                const rsdId = formData.rsd_id;
                if (!rsdId) return;

                const response = await axios.get(`${API_ENDPOINTS.getResearchSectionByRsdtitle}/${rsdId}`);

                const fetchedSections = response.data.data.map((item) => ({
                    id: item.rsdt_id.toString(),
                    type: item.rsdt_type,
                    data: {
                        rsdt_order: item.rsdt_order,
                        rsdt_code: item.rsdt_code,
                        rsdt_text: item.rsdt_text,
                        display: item.display,
                    },
                }));

                setSelectedSections(fetchedSections);

            } catch (error) {
                console.error("❌ Error fetching research titles:", error.response?.data || error.message);
            }
        };

        fetchResearchTitles();
    }, [formData.rsd_id]);

    useImperativeHandle(ref, () => {
        return {
            getResearchSections: () => {
                return selectedSections.map((section, index) => {
                    const data = {
                        rsdt_id: parseInt(section.id),
                        rsdt_type: section.type,
                        rsdt_order: index + 1,
                        display: 0,
                        active: 1,
                        ...section.data,
                    };
                    return data;
                });
            },

            getDescriptions: async () => {
                const descriptionData = await Promise.all(
                    Object.values(descriptionPieceRefs.current || {}).map(async (ref) => {
                        if (ref?.current?.getDescriptions) {
                            return await ref.current.getDescriptions();
                        }
                        return null;
                    })
                );
                return descriptionData.filter(item => item !== null);
            },

            getProjects: async () => {
                const projectData = await Promise.all(
                    Object.values(projectPieceRefs.current || {}).map(async (ref) => {
                        if (ref?.current?.getProjects) {
                            return await ref.current.getProjects();
                        }
                        return null;
                    })
                );
                return projectData.filter(item => item !== null);
            },

            getMeetings: async () => {
                const meetingData = await Promise.all(
                    Object.values(meetingPieceRefs.current || {}).map(async (ref) => {
                        if (ref?.current?.getMeetings) {
                            return await ref.current.getMeetings();
                        }
                        return null;
                    })
                );
                return meetingData.filter(item => item !== null);
            },
        };
    });

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const newSections = Array.from(selectedSections);
        const [reorderedItem] = newSections.splice(result.source.index, 1);
        newSections.splice(result.destination.index, 0, reorderedItem);

        setSelectedSections(newSections);
    };

    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                        >
                            {selectedSections.map((section, index) => {
                                if (section.type === "Description" && !descriptionPieceRefs.current[section.id]) {
                                    descriptionPieceRefs.current[section.id] = React.createRef();
                                }
                                if (section.type === "Project" && !projectPieceRefs.current[section.id]) {
                                    projectPieceRefs.current[section.id] = React.createRef();
                                }
                                if (section.type === "Meeting" && !meetingPieceRefs.current[section.id]) {
                                    meetingPieceRefs.current[section.id] = React.createRef();
                                }
                                return (
                                <Draggable
                                    key={section.id.toString()}
                                    draggableId={section.id.toString()}
                                    index={index}
                                >

                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="bg-gray-50 rounded-lg border border-gray-300 "
                                        >
                                            {section.type === "Description" && (
                                                <DescriptionSection
                                                    ref={descriptionPieceRefs.current[section.id]}
                                                    sectionId={parseInt(section.id)}
                                                    rsdId={formData.rsd_id} />
                                            )}
                                            {section.type === "Project" && (
                                                <ProjectSection
                                                    ref={projectPieceRefs.current[section.id]}
                                                    sectionId={parseInt(section.id)}
                                                    rsdId={formData.rsd_id} />
                                            )}
                                            {section.type === "Meeting" && (
                                                <MeetingSection
                                                    ref={meetingPieceRefs.current[section.id]}
                                                    sectionId={parseInt(section.id)}
                                                    rsdId={formData.rsd_id} />
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {/* Add new section button */}
            <a
                className={` cursor-pointer flex items-center p-3 text-sm font-medium text-blue-600 border-t border ${
                    showSection ? "rounded-t-lg" : "rounded-lg"
                } bg-gray-50 hover:bg-gray-100 hover:underline mt-2`}
                onClick={handleAddPage}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 mr-2 ml-2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                </svg>
                Add new research section
            </a>

            {/* Display section options when Add new section is clicked */}
            {showSection && (
                <div className="bg-gray-50 h-auto border !border-gray-200 rounded-b-lg overflow-y-auto mb-4">
                    <div className="grid !grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 gap-8 p-8">
                        {[
                            { type: "Description", icon: <TbFileDescription className="w-24 h-24 mx-auto mt-8" />, label: "Description" },
                            { type: "Project", icon: <LiaProjectDiagramSolid className="w-24 h-24 mx-auto mt-8" />, label: "Project" },
                            { type: "Meeting", icon: <HiOutlineUserGroup className="w-24 h-24 mx-auto mt-8" />, label: "Meeting" },
                        ].map((section) => (
                            <div
                                key={section.type}
                                className="cursor-pointer hover:!bg-gray-100 bg-white grid-cols-1 h-auto border rounded-xl"
                                onClick={() => handleAddSection(section.type)}
                            >
                                {section.icon}
                                <h1 className="text-center text-2xl font-medium !mb-8">
                                    {section.label}
                                </h1>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
});

export default ResearchFieldSection