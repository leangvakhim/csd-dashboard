import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { TbFileDescription } from "react-icons/tb";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DescriptionSection from './Description/DescriptionSection';
import ProjectSection from './Project/ProjectSection';
import MeetingSection from './Meeting/MeetingSection';

const ResearchFieldSection = forwardRef((props, ref) => {
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

    useImperativeHandle(ref, () => ({
        getSections: () => {
            return selectedSections.map((section, index) => {
                return {
                sec_id: section.id,
                sec_type: section.type,
                sec_order: index + 1,
                lang: formData?.lang ?? 1,
                display: 0,
                active: 1,
                ...section.data,
                };
            });
            },

            updateSectionIds: (newIds) => {
            setSelectedSections(prev =>
                prev.map(section => {
                const match = newIds.find(n => n.tempId === section.id);
                if (!match) return section;

                const updatedData = { ...section.data };

                if (updatedData.banners && Array.isArray(updatedData.banners)) {
                    updatedData.banners = updatedData.banners.map(b => ({
                    ...b,
                    ban_sec: match.realId
                    }));
                }

                    return {
                        ...section,
                        id: match.realId,
                        isTemporary: false,
                        data: updatedData,
                    };
                })
            );
        },

        getPrograms: () => programPieceRef.current?.getPrograms?.() || [],
        getBanners: () => bannerPieceRef.current?.getBanners?.() || [],
        getSlideshows: () => slideshowPieceRef.current?.getSlideshows?.() || [],
        getServices: () => servicePieceRef.current?.getServices?.() || [],
        getAcademics: () => academicPieceRef.current?.getAcademics?.() || [],
        getInformations: () => informationPieceRef.current?.getInformations?.() || [],
        getFacilities: () => facilitiesPieceRef.current?.getFacilities?.() || [],
        getGallery: () => galleryPieceRef.current?.getGallery?.() || [],
        getSpecializations: () => specializationPieceRef.current?.getSpecializations?.() || [],
        getTestimonials: () => testimonialPieceRef.current?.getTestimonials?.() || [],
        getTypes: () => typePieceRef.current?.getTypes?.() || [],
        getCriterias: () => criteriaPieceRef.current?.getCriterias?.() || [],
        getCSDs: () => csdPieceRef.current?.getCSDs?.() || [],
        getUnlocks: () => unlockPieceRef.current?.getUnlocks?.() || [],
        getStudys: () => studyPieceRef.current?.getStudys?.() || [],
        getAvailables: () => availablePieceRef.current?.getAvailables?.() || [],
        getFees: () => feePieceRef.current?.getFees?.() || [],
        getRequirements: () => requirementPieceRef.current?.getRequirements?.() || [],
        getFutures: () => futurePieceRef.current?.getFutures?.() || [],
        getPotentials: () => potentialPieceRef.current?.getPotentials?.() || [],
        getIntroductions: () => introductionPieceRef.current?.getIntroductions?.() || [],
        getInnovations: () => innovationPieceRef.current?.getInnovations?.() || [],
        getFAQs: () => faqPieceRef.current?.getFAQs?.() || [],
        getApplys: () => applyPieceRef.current?.getApplys?.() || [],
        getImportants: () => importantPieceRef.current?.getImportants?.() || [],
        getContacts: () => contactPieceRef.current?.getContacts?.() || [],
        getQuestions: () => questionPieceRef.current?.getQuestions?.() || [],
        getNews: () => newPieceRef.current?.getNews?.() || [],
        getEvents: () => eventPieceRef.current?.getEvents?.() || [],
        getAnnouncements: () => announcementPieceRef.current?.getAnnouncements?.() || [],
        getResearchs: () => researchPieceRef.current?.getResearchs?.() || [],
        getFacultys: () => facultyPieceRef.current?.getFacultys?.() || [],
        getLabs: () => labPieceRef.current?.getLabs?.() || [],
        getScholarships: () => scholarshipPieceRef.current?.getScholarships?.() || [],
        getCareers: () => careerPieceRef.current?.getCareers?.() || [],
        getPartners: () => partnerPieceRef.current?.getPartners?.() || [],
        getFeedbacks: () => feedbackPieceRef.current?.getFeedbacks?.() || [],
    }));

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