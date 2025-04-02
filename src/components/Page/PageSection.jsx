import React, { useState } from "react";
import { TbCarouselHorizontal, TbCodeDots } from "react-icons/tb";
import { CgWebsite } from "react-icons/cg";
import { LuColumns3 } from "react-icons/lu";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { TbBrandHipchat } from "react-icons/tb";
import CarouselPiece from "./Carousel/CarouselPiece";
import { RiInformationLine } from "react-icons/ri";
import { LuSchool } from "react-icons/lu";
import { GrGallery } from "react-icons/gr";
import { MdAspectRatio } from "react-icons/md";
import { LuFileType } from "react-icons/lu";
import { LuMessagesSquare } from "react-icons/lu";
import { TbBrandCarbon } from "react-icons/tb";
import { FaComputer } from "react-icons/fa6";
import { AiOutlineUnlock } from "react-icons/ai";
import { MdOutlineEventAvailable } from "react-icons/md";
import { TbTax } from "react-icons/tb";
import { HiOutlineLightBulb } from "react-icons/hi";
import { TbContract } from "react-icons/tb";
import { MdOutlineSwipeDownAlt } from "react-icons/md";
import { TbDirections } from "react-icons/tb";
import { TbCell } from "react-icons/tb";
import { TbTargetArrow } from "react-icons/tb";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { LuBrainCircuit } from "react-icons/lu";
import { BsExclamationTriangle } from "react-icons/bs";
import { TfiWrite } from "react-icons/tfi";
import { TbMicroscope } from "react-icons/tb";
import { TbNews } from "react-icons/tb";
import { GiMountainClimbing } from "react-icons/gi";
import { FiUser } from "react-icons/fi";
import { TbSpeakerphone } from "react-icons/tb";
import { RiQuestionnaireLine } from "react-icons/ri";
import { TbSchool } from "react-icons/tb";
import { LuHeartHandshake } from "react-icons/lu";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import BannerPiece from "./Banner/BannerPiece";
import ServicePiece from "./Service/ServicePiece";

const sectionOptions = [

    {
        type: "Slideshow",
        component: CarouselPiece,
        icon: TbCarouselHorizontal,
        label: "Slideshow",
    },
    {
        type: "Banner",
        component: BannerPiece,
        icon: CgWebsite,
        label: "Banner",
    },
    {
        type: "Service",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Service Section
                </h1>
            </div>
        ),
        icon: LuColumns3,
        label: "Service",
    },
    {
        type: "Programs",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Programs Section
                </h1>
            </div>
        ),
        icon: TbCodeDots,
        label: "Programs",
    },
    {
        type: "Academic",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Academic Section
                </h1>
            </div>
        ),
        icon: HiOutlineAcademicCap,
        label: "Academic",
    },
    {
        type: "Information",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Information Section
                </h1>
            </div>
        ),
        icon: RiInformationLine,
        label: "Information",
    },
    {
        type: "Facilities",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Facilities Section
                </h1>
            </div>
        ),
        icon: LuSchool,
        label: "Facilities",
    },
    {
        type: "Gallery",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Gallery Section
                </h1>
            </div>
        ),
        icon: GrGallery,
        label: "Gallery",
    },
    {
        type: "Specialization",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Specialization Section
                </h1>
            </div>
        ),
        icon: MdAspectRatio,
        label: "Specialization",
    },
    {
        type: "Testimonial",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Testimonial Section
                </h1>
            </div>
        ),
        icon: LuMessagesSquare,
        label: "Testimonial",
    },
    {
        type: "Type",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Type Section
                </h1>
            </div>
        ),
        icon: LuFileType,
        label: "Type",
    },
    {
        type: "Criteria",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Criteria Section
                </h1>
            </div>
        ),
        icon: TbBrandCarbon,
        label: "Criteria",
    },
    {
        type: "CSD",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    CSD Section
                </h1>
            </div>
        ),
        icon: FaComputer,
        label: "CSD",
    },
    {
        type: "Unlock",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Unlock Section
                </h1>
            </div>
        ),
        icon: AiOutlineUnlock,
        label: "Unlock",
    },
    {
        type: "Study",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Study Section
                </h1>
            </div>
        ),
        icon: LiaChalkboardTeacherSolid,
        label: "Study",
    },
    {
        type: "Avaialable",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Avaialable Section
                </h1>
            </div>
        ),
        icon: MdOutlineEventAvailable,
        label: "Available",
    },
    {
        type: "Fee",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Fee Section
                </h1>
            </div>
        ),
        icon: TbTax,
        label: "Fee",
    },
    {
        type: "Requirement",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Requirement Section
                </h1>
            </div>
        ),
        icon: TbContract,
        label: "Requirement",
    },
    {
        type: "Future",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Future Section
                </h1>
            </div>
        ),
        icon: HiOutlineLightBulb,
        label: "Future",
    },
    {
        type: "Potential",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Potential Section
                </h1>
            </div>
        ),
        icon: GiMountainClimbing,
        label: "Potential",
    },
    {
        type: "Introduction",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Introduction Section
                </h1>
            </div>
        ),
        icon: TbDirections,
        label: "Introduction",
    },
    {
        type: "Innovation",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Innovation Section
                </h1>
            </div>
        ),
        icon: LuBrainCircuit,
        label: "Innovation",
    },
    {
        type: "FAQ",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    FAQ Section
                </h1>
            </div>
        ),
        icon: RiQuestionnaireLine,
        label: "FAQ",
    },
    {
        type: "Apply",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Apply Section
                </h1>
            </div>
        ),
        icon: TfiWrite,
        label: "Apply",
    },
    {
        type: "Important",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Important Section
                </h1>
            </div>
        ),
        icon: BsExclamationTriangle,
        label: "Important",
    },
    {
        type: "Pyscroll",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Pyscroll Section
                </h1>
            </div>
        ),
        icon: MdOutlineSwipeDownAlt,
        label: "Pyscroll",
    },
    {
        type: "New",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    News Section
                </h1>
            </div>
        ),
        icon: TbNews,
        label: "New",
    },
    {
        type: "Event",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Event Section
                </h1>
            </div>
        ),
        icon: TbSpeakerphone,
        label: "Event",
    },
    {
        type: "Research",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Research Section
                </h1>
            </div>
        ),
        icon: TbMicroscope,
        label: "Research",
    },
    {
        type: "Faculty",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Faculty Section
                </h1>
            </div>
        ),
        icon: FiUser,
        label: "Faculty",
    },
    {
        type: "Lab",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Lab Section
                </h1>
            </div>
        ),
        icon: TbCell,
        label: "Lab",
    },
    {
        type: "Scholarship",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Scholarship Section
                </h1>
            </div>
        ),
        icon: TbSchool,
        label: "Scholarship",
    },
    {
        type: "Career",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Career Section
                </h1>
            </div>
        ),
        icon: TbTargetArrow,
        label: "Career",
    },
    {
        type: "Partner",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Partner Section
                </h1>
            </div>
        ),
        icon: LuHeartHandshake,
        label: "Partner",
    },
    {
        type: "Feedback",
        component: () => (
            <div className="bg-gray-50 p-2 rounded-lg">
                <h1 className="text-xl font-bold text-center">
                    Feedback Section
                </h1>
            </div>
        ),
        icon: TbBrandHipchat,
        label: "Feedback",
    },
];

const PageSection = () => {
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
              className="space-y-4"
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
                      className="bg-gray-50 rounded-lg border border-gray-300 mx-4"
                    >
                      {sectionOptions
                        .filter((s) => s.type === section.type)
                        .map((s, i) => {
                          const SectionComponent = s.component;
                          return <SectionComponent key={i} />;
                        })}
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
        className={`mx-4 cursor-pointer flex items-center p-3 text-sm font-medium text-blue-600 border-t border ${
          showSection ? "rounded-t-lg" : "rounded-lg"
        } bg-gray-50 hover:bg-gray-100 hover:underline mt-4`}
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
        Add new section
      </a>

      {/* Display section options when Add new section is clicked */}
      {showSection && (
        <div className="bg-gray-50 h-auto mx-4 border !border-gray-200 rounded-b-lg overflow-y-auto mb-4">
          <div className="grid !grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4 gap-8 p-8">
            {sectionOptions.map((section) => (
              <div
                key={section.type}
                className="cursor-pointer hover:!bg-gray-100 bg-white grid-cols-1 h-auto border rounded-xl"
                onClick={() => handleAddSection(section.type)}
              >
                <section.icon className="w-24 h-24 mx-auto mt-8" />
                <h1 className="text-center text-2xl font-medium !mb-8">
                  {section.label}
                </h1>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageSection;
