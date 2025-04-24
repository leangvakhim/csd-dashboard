import React, { useState } from 'react'
import { TbFileDescription } from "react-icons/tb";
import { FaRegListAlt } from "react-icons/fa";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DescriptionSection from './Description/DescriptionSection';
import ProjectSection from './Project/ProjectSection';
import MeetingSection from './Meeting/MeetingSection';

const ResearchFieldSection = () => {
    const [showSection, setShowSection] = useState(false);
    const [selectedSections, setSelectedSections] = useState([]);

    const handleAddPage = () => {
        setShowSection(!showSection);
    };

    const handleAddSection = (sectionType) => {
        setSelectedSections([
            ...selectedSections,
            { id: Date.now(), type: sectionType },
        ]);
        setShowSection(false);
    };

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
                            {selectedSections.map((section, index) => (
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
                                                <DescriptionSection/>
                                            )}
                                            {section.type === "Project" && (
                                                <ProjectSection/>
                                            )}
                                            {section.type === "Meeting" && (
                                                <MeetingSection/>
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
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
                        <div
                            className="cursor-pointer hover:!bg-gray-100 bg-white grid-cols-1 h-auto border rounded-xl"
                            onClick={() => handleAddSection("Description")}
                        >
                            <TbFileDescription className="w-24 h-24 mx-auto mt-8" />
                            <h1 className="text-center text-2xl font-medium !mb-8">
                                Description
                            </h1>
                        </div>

                        <div
                            className="cursor-pointer hover:!bg-gray-100 bg-white grid-cols-1 h-auto border rounded-xl"
                            onClick={() => handleAddSection("Project")}
                        >
                            <LiaProjectDiagramSolid className="w-24 h-24 mx-auto mt-8" />
                            <h1 className="text-center text-2xl font-medium !mb-8">
                                Project
                            </h1>
                        </div>

                        <div
                            className="cursor-pointer hover:!bg-gray-100 bg-white grid-cols-1 h-auto border rounded-xl"
                            onClick={() => handleAddSection("Meeting")}
                        >
                            <HiOutlineUserGroup className="w-24 h-24 mx-auto mt-8" />
                            <h1 className="text-center text-2xl font-medium !mb-8">
                                Meeting
                            </h1>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ResearchFieldSection