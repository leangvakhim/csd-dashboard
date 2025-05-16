import React, { useState, forwardRef, useEffect, useRef, useCallback, useImperativeHandle } from "react";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TbCarouselHorizontal, TbCodeDots } from "react-icons/tb";
import { CgWebsite } from "react-icons/cg";
import { LuColumns3 } from "react-icons/lu";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { TbBrandHipchat } from "react-icons/tb";
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
import { TbCalendarEvent } from "react-icons/tb";
import { AiOutlinePhone } from "react-icons/ai";
import { TbWorldQuestion } from "react-icons/tb";
import { TbFocusAuto } from "react-icons/tb";
import EventsPiece from "./Events/EventsPiece";
import CarouselPiece from "./Carousel/CarouselPiece";
import BannerPiece from "./Banner/BannerPiece";
import NewPiece from "./New/NewPiece";
import ServicePiece from "./Service/ServicePiece";
import ProgramPiece from "./Program/ProgramPiece";
import AcademicPiece from "./Academic/AcademicPiece";
import InformationPiece from "./Information/InformationPiece";
import FacilitiesPiece from "./Facilities/FacilitiesPiece";
import GalleryPiece from "./Gallery/GalleryPiece";
import SpecializationPiece from "./Specialization/SpecializationPiece";
import TestimonialPiece from "./Testimontial/TestimontialPiece";
import TypePiece from "./Type/TypePiece";
import CriteriaPiecce from "./Criteria/CriteriaPiece";
import ResearchPiece from "./Research/ResearchPiece";
import FacultyPiece from "./Faculty/FacultyPiece";
import ResearchlabPiece from "./Researchlab/ResearchlabPiece";
import CareerPiece from "./Career/CareerPiece";
import ScholarshipPiece from "./Scholarship/ScholarshipPiece";
import UnlockPiece from "./Unlock/UnlockPiece";
import FeePiece from "./Fee/FeePiece";
import IntroductionPiece from "./Introduction/IntroductionPiece";
import CsdPiece from "./CSD/CsdPiece";
import StudyPiece from "./Study/StudyPiece";
import FuturePiece from "./Future/FuturePiece";
import PotentaiPiece from "./Potential/PotentialPiece";
import InnovationPiece from "./Innovation/InnovationPiece";
import FaqPiece from "./Faq/FaqPiece";
import ApplyPiece from "./Apply/ApplyPiece";
import AvailablePiece from "./Available/AvailablePiece";
import RequirementPiece from "./Requirement/RequirementPiece";
import ImportantPiece from "./Important/ImportantPiece";
import PartnerPiece from "./Partner/PartnerPiece";
import FeedbackPiece from "./Feedback/FeedbackPiece";
import { API_ENDPOINTS } from "../../service/APIConfig";
import AnnouncementPiece from "./Announcement/AnnouncementPiece";
import ContactPiece from "./Contact/ContactPiece";
import QuestionPiece from "./Question/QuestionPiece";
import AboutPiece from "./About/AboutPiece";
import { useLocation } from "react-router-dom";
import { useLoading } from "../Context/LoadingContext";
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
    component: ServicePiece,
    icon: LuColumns3,
    label: "Service",
  },
  {
    type: "Programs",
    component: ProgramPiece,
    icon: TbCodeDots,
    label: "Programs",
  },
  {
    type: "Academic",
    component: AcademicPiece,
    icon: HiOutlineAcademicCap,
    label: "Academic",
  },
  {
    type: "Information",
    component: InformationPiece,
    icon: RiInformationLine,
    label: "Information",
  },
  {
    type: "Facilities",
    component: FacilitiesPiece,
    icon: LuSchool,
    label: "Facilities",
  },
  {
    type: "Gallery",
    component: GalleryPiece,
    icon: GrGallery,
    label: "Gallery",
  },
  {
    type: "Specialization",
    component: SpecializationPiece,
    icon: MdAspectRatio,
    label: "Specialization",
  },
  {
    type: "Testimonial",
    component: TestimonialPiece,
    icon: LuMessagesSquare,
    label: "Testimonial",
  },
  {
    type: "Type",
    component: TypePiece,
    icon: LuFileType,
    label: "Type",
  },
  {
    type: "Criteria",
    component: CriteriaPiecce,
    icon: TbBrandCarbon,
    label: "Criteria",
  },
  {
    type: "CSD",
    component: CsdPiece,
    icon: FaComputer,
    label: "CSD",
  },
  {
    type: "Unlock",
    component: UnlockPiece,
    icon: AiOutlineUnlock,
    label: "Unlock",
  },
  {
    type: "Study",
    component: StudyPiece,
    icon: LiaChalkboardTeacherSolid,
    label: "Study",
  },
  {
    type: "Avaialable",
    component: AvailablePiece,
    icon: MdOutlineEventAvailable,
    label: "Available",
  },
  {
    type: "Fee",
    component: FeePiece,
    icon: TbTax,
    label: "Fee",
  },
  {
    type: "Requirement",
    component: RequirementPiece,
    icon: TbContract,
    label: "Requirement",
  },
  {
    type: "Future",
    component: FuturePiece,
    icon: HiOutlineLightBulb,
    label: "Future",
  },
  {
    type: "Potential",
    component: PotentaiPiece,
    icon: GiMountainClimbing,
    label: "Potential",
  },
  {
    type: "Introduction",
    component: IntroductionPiece,
    icon: TbDirections,
    label: "Introduction",
  },
  {
    type: "Innovation",
    component: InnovationPiece,
    icon: LuBrainCircuit,
    label: "Innovation",
  },
  {
    type: "FAQ",
    component: FaqPiece,
    icon: RiQuestionnaireLine,
    label: "FAQ",
  },
  {
    type: "Apply",
    component: ApplyPiece,
    icon: TfiWrite,
    label: "Apply",
  },
  {
    type: "Important",
    component: ImportantPiece,
    icon: BsExclamationTriangle,
    label: "Important",
  },
  {
    type: "Contact",
    component: ContactPiece,
    icon: AiOutlinePhone,
    label: "Contact",
  },
  {
    type: "Question",
    component: QuestionPiece,
    icon: TbWorldQuestion,
    label: "Question",
  },
  {
    type: "About",
    component: AboutPiece,
    icon: TbFocusAuto,
    label: "About",
  },
  {
    type: "New",
    component: NewPiece,
    icon: TbNews,
    label: "New",
  },
  {
    type: "Event",
    component: EventsPiece,
    icon: TbCalendarEvent,
    label: "Event",
  },
  {
    type: "Announcement",
    component: AnnouncementPiece,
    icon: TbSpeakerphone,
    label: "Announcement",
  },
  {
    type: "Research",
    component: ResearchPiece,
    icon: TbMicroscope,
    label: "Research",
  },
  {
    type: "Faculty",
    component: FacultyPiece,
    icon: FiUser,
    label: "Faculty",
  },
  {
    type: "Lab",
    component: ResearchlabPiece,
    icon: TbCell,
    label: "Lab",
  },
  {
    type: "Scholarship",
    component: ScholarshipPiece,
    icon: TbSchool,
    label: "Scholarship",
  },
  {
    type: "Career",
    component: CareerPiece,
    icon: TbTargetArrow,
    label: "Career",
  },
  {
    type: "Partner",
    component: PartnerPiece,
    icon: LuHeartHandshake,
    label: "Partner",
  },
  {
    type: "Feedback",
    component: FeedbackPiece,
    icon: TbBrandHipchat,
    label: "Feedback",
  },
];

const PageSection = forwardRef(({ formData = {}, setFormData = {}, page_id }, ref) => {
  const programPieceRef = useRef([]);
  const bannerPieceRef = useRef([]);
  const slideshowPieceRef = useRef([]);
  const servicePieceRef = useRef([]);
  const academicPieceRef = useRef([]);
  const informationPieceRef = useRef([]);
  const facilitiesPieceRef = useRef([]);
  const galleryPieceRef = useRef([]);
  const specializationPieceRef = useRef([]);
  const testimonialPieceRef = useRef([]);
  const criteriaPieceRef = useRef([]);
  const typePieceRef = useRef([]);
  const csdPieceRef = useRef([]);
  const unlockPieceRef = useRef([]);
  const studyPieceRef = useRef([]);
  const availablePieceRef = useRef([]);
  const feePieceRef = useRef([]);
  const requirementPieceRef = useRef([]);
  const futurePieceRef = useRef([]);
  const potentialPieceRef = useRef([]);
  const introductionPieceRef = useRef([]);
  const innovationPieceRef = useRef([]);
  const faqPieceRef = useRef([]);
  const applyPieceRef = useRef([]);
  const importantPieceRef = useRef([]);
  const contactPieceRef = useRef([]);
  const questionPieceRef = useRef([]);
  const newPieceRef = useRef([]);
  const eventPieceRef = useRef([]);
  const announcementPieceRef = useRef([]);
  const researchPieceRef = useRef([]);
  const facultyPieceRef = useRef([]);
  const labPieceRef = useRef([]);
  const scholarshipPieceRef = useRef([]);
  const careerPieceRef = useRef([]);
  const partnerPieceRef = useRef([]);
  const feedbackPieceRef = useRef([]);
  const [showSection, setShowSection] = useState(false);
  const [selectedSections, setSelectedSections] = useState([]);
  const {setLoading} = useLoading();

  useEffect(() => {
    const fetchSections = async () => {
      if (!page_id) return;

      try {
        setLoading(true);
        const response = await axios.get(`${API_ENDPOINTS.getSectionByPage}/${page_id}`);
        const fetchedSections = response.data?.data || [];

        const mapped = fetchedSections.map((section) => ({
          id: section.sec_id,
          type: section.sec_type,
          data: section
        }));

        setSelectedSections(mapped);
      } catch (error) {
        console.error("❌ Failed to fetch sections:", error);
      }finally{
        setLoading(false);
      }
    };

    fetchSections();
  }, [page_id]);

  // --- Dynamic ref map and getter for generalization ---
  const refMap = {
    Programs: programPieceRef,
    Banner: bannerPieceRef,
    Slideshow: slideshowPieceRef,
    Service: servicePieceRef,
    Academic: academicPieceRef,
    Information: informationPieceRef,
    Facilities: facilitiesPieceRef,
    Gallery: galleryPieceRef,
    Specialization: specializationPieceRef,
    Testimonial: testimonialPieceRef,
    Type: typePieceRef,
    Criteria: criteriaPieceRef,
    CSD: csdPieceRef,
    Unlock: unlockPieceRef,
    Study: studyPieceRef,
    Avaialable: availablePieceRef,
    Fee: feePieceRef,
    Requirement: requirementPieceRef,
    Future: futurePieceRef,
    Potential: potentialPieceRef,
    Introduction: introductionPieceRef,
    Innovation: innovationPieceRef,
    FAQ: faqPieceRef,
    Apply: applyPieceRef,
    Important: importantPieceRef,
    Contact: contactPieceRef,
    Question: questionPieceRef,
    New: newPieceRef,
    Event: eventPieceRef,
    Announcement: announcementPieceRef,
    Research: researchPieceRef,
    Faculty: facultyPieceRef,
    Lab: labPieceRef,
    Scholarship: scholarshipPieceRef,
    Career: careerPieceRef,
    Partner: partnerPieceRef,
    Feedback: feedbackPieceRef,
  };

  const getDynamicData = async (type, method) => {
    const results = [];
    const refs = refMap[type]?.current || [];
    for (const ref of refs) {
      if (ref?.[method]) {
        const data = await ref[method]();
        if (Array.isArray(data)) {
          results.push(...data);
        } else if (data) {
          results.push(data);
        } else {
          console.warn("⚠️ Skipped pushing non-iterable data in getDynamicData:", data);
        }
      }
    }
    return results;
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

    getPrograms: async () => { return await getDynamicData("Programs", "getPrograms"); },
    getBanners: async () => { return await getDynamicData("Banner", "getBanners"); },
    getSlideshows: async () => { return await getDynamicData("Slideshow", "getSlideshows"); },
    getServices: async () => { return await getDynamicData("Service", "getServices"); },
    getAcademics: async () => { return await getDynamicData("Academic", "getAcademics"); },
    getInformations: async () => { return await getDynamicData("Information", "getInformations"); },
    getFacilities: async () => { return await getDynamicData("Facilities", "getFacilities"); },
    getGallery: async () => { return await getDynamicData("Gallery", "getGallery"); },
    getSpecializations: async () => { return await getDynamicData("Specialization", "getSpecializations"); },
    getTestimonials: async () => { return await getDynamicData("Testimonial", "getTestimonials"); },
    getTypes: async () => { return await getDynamicData("Type", "getTypes"); },
    getCriterias: async () => { return await getDynamicData("Criteria", "getCriterias"); },
    getCSDs: async () => { return await getDynamicData("CSD", "getCSDs"); },
    getUnlocks: async () => { return await getDynamicData("Unlock", "getUnlocks"); },
    getStudys: async () => { return await getDynamicData("Study", "getStudys"); },
    getAvailables: async () => { return await getDynamicData("Avaialable", "getAvailables"); },
    getFees: async () => { return await getDynamicData("Fee", "getFees"); },
    getRequirements: async () => { return await getDynamicData("Requirement", "getRequirements"); },
    getFutures: async () => { return await getDynamicData("Future", "getFutures"); },
    getPotentials: async () => { return await getDynamicData("Potential", "getPotentials"); },
    getIntroductions: async () => { return await getDynamicData("Introduction", "getIntroductions"); },
    getContacts: async () => { return await getDynamicData("Contact", "getContacts"); },
    getInnovations: async () => { return await getDynamicData("Innovation", "getInnovations"); },
    getFAQs: async () => { return await getDynamicData("FAQ", "getFAQs"); },
    getApplys: async () => { return await getDynamicData("Apply", "getApplys"); },
    getImportants: async () => { return await getDynamicData("Important", "getImportants"); },
    getContacts: async () => { return await getDynamicData("Contact", "getContacts"); },
    getQuestions: async () => { return await getDynamicData("Question", "getQuestions"); },
    getNews: async () => { return await getDynamicData("New", "getNews"); },
    getEvents: async () => { return await getDynamicData("Event", "getEvents"); },
    getAnnouncements: async () => { return await getDynamicData("Announcement", "getAnnouncements"); },
    getResearchs: async () => { return await getDynamicData("Research", "getResearchs"); },
    getFacultys: async () => { return await getDynamicData("Faculty", "getFacultys"); },
    getLabs: async () => { return await getDynamicData("Lab", "getLabs"); },
    getScholarships: async () => { return await getDynamicData("Scholarship", "getScholarships"); },
    getCareers: async () => { return await getDynamicData("Career", "getCareers"); },
    getPartners: async () => { return await getDynamicData("Partner", "getPartners"); },
    getFeedbacks: async () => { return await getDynamicData("Feedback", "getFeedbacks"); },
  }));

  const handleAddPage = () => {
    setShowSection(!showSection);
  };

  const handleAddSection = (sectionType) => {
    const newSection = {
      id: selectedSections.length + 1,
      type: sectionType,
      isTemporary: true,
    };

    setSelectedSections([...selectedSections, newSection]);
    setShowSection(false);
  };

  const handleDataChange = useCallback((newData, index) => {
    setSelectedSections(prevSections => {

      const prevData = prevSections[index]?.data || {};
      const hasChanges = Object.keys(newData).some(
        key => newData[key] !== prevData[key]
      );
      if (!hasChanges) return prevSections;

      const updated = [...prevSections];
      updated[index].data = {
        ...updated[index].data,
        ...newData,
      };
      return updated;
    });
  }, []);

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        {selectedSections.map((section, index) => {
          const SectionComponent = sectionOptions.find((s) => s.type === section.type)?.component;

          if (!SectionComponent) return null;

          const moveSection = (dragIndex, hoverIndex) => {
            const newSections = [...selectedSections];
            const [dragged] = newSections.splice(dragIndex, 1);
            newSections.splice(hoverIndex, 0, dragged);
            setSelectedSections(newSections);
          };

          const SectionItem = ({ section, index }) => {
            const ref = React.useRef(null);
            const [, drop] = useDrop({
              accept: "SECTION",
              hover(item) {
                if (item.index !== index) {
                  moveSection(item.index, index);
                  item.index = index;
                }
              },
            });

            const [{ isDragging }, drag] = useDrag({
              type: "SECTION",
              item: { type: "SECTION", index },
              collect: (monitor) => ({
                isDragging: monitor.isDragging(),
              }),
            });

            drag(drop(ref));

            return (
              <div
                ref={ref}
                key={section.id}
                style={{ opacity: isDragging ? 0.5 : 1 }}
                className="bg-gray-50 rounded-lg border border-gray-300 mx-4 my-2"
              >
                <SectionComponent
                  ref={
                        section.type === "Programs" ? el => programPieceRef.current[index] = el
                      : section.type === "Banner" ? el => bannerPieceRef.current[index] = el
                      : section.type === "Slideshow" ? el => slideshowPieceRef.current[index] = el
                      : section.type === "Service" ? el => servicePieceRef.current[index] = el
                      : section.type === "Academic" ? el => academicPieceRef.current[index] = el
                      : section.type === "Information" ? el => informationPieceRef.current[index] = el
                      : section.type === "Facilities" ? el => facilitiesPieceRef.current[index] = el
                      : section.type === "Gallery" ? el => galleryPieceRef.current[index] = el
                      : section.type === "Specialization" ? el => specializationPieceRef.current[index] = el
                      : section.type === "Testimonial" ? el => testimonialPieceRef.current[index] = el
                      : section.type === "Type" ? el => typePieceRef.current[index] = el
                      : section.type === "Criteria" ? el => criteriaPieceRef.current[index] = el
                      : section.type === "CSD" ? el => csdPieceRef.current[index] = el
                      : section.type === "Unlock" ? el => unlockPieceRef.current[index] = el
                      : section.type === "Study" ? el => studyPieceRef.current[index] = el
                      : section.type === "Avaialable" ? el => availablePieceRef.current[index] = el
                      : section.type === "Fee" ? el => feePieceRef.current[index] = el
                      : section.type === "Requirement" ? el => requirementPieceRef.current[index] = el
                      : section.type === "Future" ? el => futurePieceRef.current[index] = el
                      : section.type === "Potential" ? el => potentialPieceRef.current[index] = el
                      : section.type === "Introduction" ? el => introductionPieceRef.current[index] = el
                      : section.type === "Innovation" ? el => innovationPieceRef.current[index] = el
                      : section.type === "FAQ" ? el => faqPieceRef.current[index] = el
                      : section.type === "Apply" ? el => applyPieceRef.current[index] = el
                      : section.type === "Important" ? el => importantPieceRef.current[index] = el
                      : section.type === "Contact" ? el => contactPieceRef.current[index] = el
                      : section.type === "Question" ? el => questionPieceRef.current[index] = el
                      : section.type === "New" ? el => newPieceRef.current[index] = el
                      : section.type === "Event" ? el => eventPieceRef.current[index] = el
                      : section.type === "Announcement" ? el => announcementPieceRef.current[index] = el
                      : section.type === "Research" ? el => researchPieceRef.current[index] = el
                      : section.type === "Faculty" ? el => facultyPieceRef.current[index] = el
                      : section.type === "Lab" ? el => labPieceRef.current[index] = el
                      : section.type === "Scholarship" ? el => scholarshipPieceRef.current[index] = el
                      : section.type === "Career" ? el => careerPieceRef.current[index] = el
                      : section.type === "Partner" ? el => partnerPieceRef.current[index] = el
                      : null
                    }
                  data={section.data}
                  sectionId={section.data?.sec_id || section.id}
                  pageId={page_id}
                  onDataChange={(newData) => handleDataChange(newData, index)}
                />
              </div>
            );
          };

          return <SectionItem key={section.id} section={section} index={index} />;
        })}
      </DndProvider>

      {/* Add new section button */}
      <a
        className={`mx-4 cursor-pointer flex items-center p-3 text-sm font-medium text-blue-600 border-t border ${
          showSection ? "rounded-t-lg" : "rounded-lg"
        } bg-gray-50 hover:bg-gray-100 hover:underline mt-2`}
        onClick={handleAddPage}
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-2 ml-2" >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span>
          Add new section
        </span>
      </a>

      <div>
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
    </div>
  );
});

export default PageSection;
