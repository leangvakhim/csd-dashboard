import React, { useState, forwardRef, useEffect, useRef, useCallback, useImperativeHandle } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CgWebsite } from "react-icons/cg";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { RiInformationLine } from "react-icons/ri";
import { GrGallery } from "react-icons/gr";
import { MdAspectRatio, MdOutlineEventAvailable } from "react-icons/md";
import { LuColumns3, LuSchool, LuFileType, LuMessagesSquare, LuBrainCircuit, LuHeartHandshake } from "react-icons/lu";
import { FaComputer } from "react-icons/fa6";
import { AiOutlineUnlock } from "react-icons/ai";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FaPeopleGroup } from "react-icons/fa6";
import { TbSquareRoundedLetterS, TbSquareRoundedLetterD, TbSquareRoundedLetterL, TbBrandDatabricks, TbUsersGroup, TbTax, TbCarouselHorizontal, TbCodeDots, TbBrandHipchat, TbContract, TbDirections, TbCell, TbTargetArrow, TbMicroscope, TbNews, TbSpeakerphone, TbCalendarEvent, TbSchool, TbFocusAuto, TbWorldQuestion, TbBrandCarbon } from "react-icons/tb";
import { LiaChalkboardTeacherSolid, LiaNewspaperSolid } from "react-icons/lia";
import { BsExclamationTriangle } from "react-icons/bs";
import { TfiWrite } from "react-icons/tfi";
import { GiMountainClimbing } from "react-icons/gi";
import { FiUser } from "react-icons/fi";
import { RiQuestionnaireLine } from "react-icons/ri";
import { AiOutlinePhone } from "react-icons/ai";
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
import { API_ENDPOINTS, axiosInstance } from "../../service/APIConfig";
import AnnouncementPiece from "./Announcement/AnnouncementPiece";
import ContactPiece from "./Contact/ContactPiece";
import QuestionPiece from "./Question/QuestionPiece";
import AboutPiece from "./About/AboutPiece";
import { useLocation } from "react-router-dom";
import { useLoading } from "../Context/LoadingContext";
import LoFPiece from "./LoF/LoFPiece";
import LoRPiece from "./LoR/LoRPiece";
import LoNEPiece from "./LoNE/LoNEPiece";
import LoDPiece from "./LoD/LoDPiece";
import FacultyDetailPiece from "./Faculty/FacultyDetailPiece";
import ResearchDetailPiece from "./Research/ResearchDetailPiece";
import ResearchlabDetailPiece from "./Researchlab/ResearchlabDetailPiece";
import ScholarshipDetailPiece from "./Scholarship/ScholarshipDetailPiece";
import EventsDetailPiece from "./Events/EventsDetailPiece";
import NewDetailPiece from "./New/NewDetailPiece";
import CareerDetailPiece from "./Career/CareerDetailPiece";
import AnnouncementDetailPiece from "./Announcement/AnnouncementDetailPiece";
const sectionOptions = [
  {
    type: "Slideshow",
    component: CarouselPiece,
    option: "Section",
    icon: TbCarouselHorizontal,
    label: "Slideshow",
  },
  {
    type: "Banner",
    component: BannerPiece,
    option: "Section",
    icon: CgWebsite,
    label: "Banner",
  },
  {
    type: "Service",
    component: ServicePiece,
    option: "Section",
    icon: LuColumns3,
    label: "Service",
  },
  {
    type: "Programs",
    component: ProgramPiece,
    option: "Section",
    icon: TbCodeDots,
    label: "Programs",
  },
  {
    type: "Academic",
    component: AcademicPiece,
    option: "Section",
    icon: HiOutlineAcademicCap,
    label: "Academic",
  },
  {
    type: "Information",
    component: InformationPiece,
    option: "Section",
    icon: RiInformationLine,
    label: "Information",
  },
  {
    type: "Facilities",
    component: FacilitiesPiece,
    option: "Section",
    icon: LuSchool,
    label: "Facilities",
  },
  {
    type: "Gallery",
    component: GalleryPiece,
    option: "Section",
    icon: GrGallery,
    label: "Gallery",
  },
  {
    type: "Specialization",
    component: SpecializationPiece,
    option: "Section",
    icon: MdAspectRatio,
    label: "Specialization",
  },
  {
    type: "Testimonial",
    component: TestimonialPiece,
    option: "Section",
    icon: LuMessagesSquare,
    label: "Testimonial",
  },
  {
    type: "Type",
    component: TypePiece,
    option: "Section",
    icon: LuFileType,
    label: "Type",
  },
  {
    type: "Criteria",
    component: CriteriaPiecce,
    option: "Section",
    icon: TbBrandCarbon,
    label: "Criteria",
  },
  {
    type: "CSD",
    component: CsdPiece,
    option: "Section",
    icon: FaComputer,
    label: "CSD",
  },
  {
    type: "Unlock",
    component: UnlockPiece,
    option: "Section",
    icon: AiOutlineUnlock,
    label: "Unlock",
  },
  {
    type: "Study",
    component: StudyPiece,
    option: "Section",
    icon: LiaChalkboardTeacherSolid,
    label: "Study",
  },
  {
    type: "Avaialable",
    component: AvailablePiece,
    option: "Section",
    icon: MdOutlineEventAvailable,
    label: "Available",
  },
  {
    type: "Fee",
    component: FeePiece,
    option: "Section",
    icon: TbTax,
    label: "Fee",
  },
  {
    type: "Requirement",
    component: RequirementPiece,
    option: "Section",
    icon: TbContract,
    label: "Requirement",
  },
  {
    type: "Future",
    component: FuturePiece,
    option: "Section",
    icon: HiOutlineLightBulb,
    label: "Future",
  },
  {
    type: "Potential",
    component: PotentaiPiece,
    option: "Section",
    icon: GiMountainClimbing,
    label: "Potential",
  },
  {
    type: "Introduction",
    component: IntroductionPiece,
    option: "Section",
    icon: TbDirections,
    label: "Introduction",
  },
  {
    type: "Innovation",
    component: InnovationPiece,
    option: "Section",
    icon: LuBrainCircuit,
    label: "Innovation",
  },
  {
    type: "FAQ",
    component: FaqPiece,
    option: "Section",
    icon: RiQuestionnaireLine,
    label: "FAQ",
  },
  {
    type: "Apply",
    component: ApplyPiece,
    option: "Section",
    icon: TfiWrite,
    label: "Apply",
  },
  {
    type: "Important",
    component: ImportantPiece,
    option: "Section",
    icon: BsExclamationTriangle,
    label: "Important",
  },
  {
    type: "Contact",
    component: ContactPiece,
    option: "Section",
    icon: AiOutlinePhone,
    label: "Contact",
  },
  {
    type: "Question",
    component: QuestionPiece,
    option: "Section",
    icon: TbWorldQuestion,
    label: "Question",
  },
  {
    type: "About",
    component: AboutPiece,
    option: "Section",
    icon: TbFocusAuto,
    label: "About",
  },
  {
    type: "New",
    component: NewPiece,
    option: "Section",
    icon: TbNews,
    label: "New & Event",
  },
  {
    type: "Research",
    component: ResearchPiece,
    option: "Section",
    icon: TbMicroscope,
    label: "Research",
  },
  {
    type: "Faculty",
    component: FacultyPiece,
    option: "Section",
    icon: FiUser,
    label: "Faculty",
  },
  {
    type: "Lab",
    component: ResearchlabPiece,
    option: "Section",
    icon: TbCell,
    label: "Lab",
  },
  {
    type: "Scholarship",
    component: ScholarshipPiece,
    option: "Section",
    icon: TbSchool,
    label: "Scholarship",
  },
  {
    type: "Career",
    component: CareerPiece,
    option: "Section",
    icon: TbTargetArrow,
    label: "Career",
  },
  {
    type: "Partner",
    component: PartnerPiece,
    option: "Section",
    icon: LuHeartHandshake,
    label: "Partner",
  },
  {
    type: "Feedback",
    component: FeedbackPiece,
    option: "Section",
    icon: TbBrandHipchat,
    label: "Feedback",
  },
  {
    type: "LoF",
    component: LoFPiece,
    option: "List",
    icon: TbUsersGroup,
    label: "List of Faculty",
  },
  {
    type: "LoR",
    component: LoRPiece,
    option: "List",
    icon: TbBrandDatabricks,
    label: "List of Research",
  },
  {
    type: "LoNE",
    component: LoNEPiece,
    option: "List",
    icon: LiaNewspaperSolid,
    label: "List of News & Event",
  },
  {
    type: "LoD",
    component: LoDPiece,
    option: "List",
    icon: FaPeopleGroup,
    label: "List of Developer",
  },
  {
    type: "FacultyDetail",
    component: FacultyDetailPiece,
    option: "Detail",
    icon: FiUser,
    label: "Faculty Detail",
  },
  {
    type: "ResearchDetail",
    component: ResearchDetailPiece,
    option: "Detail",
    icon: TbMicroscope,
    label: "Research Detail",
  },
  {
    type: "ResearchlabDetail",
    component: ResearchlabDetailPiece,
    option: "Detail",
    icon: TbCell,
    label: "Researchlab Detail",
  },
  {
    type: "ScholarshipDetail",
    component: ScholarshipDetailPiece,
    option: "Detail",
    icon: TbSchool,
    label: "Scholarship Detail",
  },
  {
    type: "EventDetail",
    component: EventsDetailPiece,
    option: "Detail",
    icon: TbCalendarEvent,
    label: "Event Detail",
  },
  {
    type: "NewDetail",
    component: NewDetailPiece,
    option: "Detail",
    icon: TbNews,
    label: "New Detail",
  },
  {
    type: "CareerDetail",
    component: CareerDetailPiece,
    option: "Detail",
    icon: TbTargetArrow,
    label: "Career Detail",
  },
  {
    type: "AnnouncementDetail",
    component: AnnouncementDetailPiece,
    option: "Detail",
    icon: TbSpeakerphone,
    label: "Announcement Detail",
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
  const LoFPieceRef = useRef([]);
  const LoRPieceRef = useRef([]);
  const LoNEPieceRef = useRef([]);
  const LoDPieceRef = useRef([]);
  const [showSection, setShowSection] = useState(false);
  const [selectedSections, setSelectedSections] = useState([]);
  const {setLoading} = useLoading();
  const [viewMode, setViewMode] = useState("Section"); // 'Section', 'List', or 'Detail'

  useEffect(() => {
    const fetchSections = async () => {
      if (!page_id) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get(`${API_ENDPOINTS.getSectionByPage}/${page_id}`);
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
    LoF: LoFPieceRef,
    LoR: LoRPieceRef,
    LoNE: LoNEPieceRef,
    LoD: LoDPieceRef,
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
    getLoFs: async () => { return await getDynamicData("LoF", "getLoFs"); },
    getLoRs: async () => { return await getDynamicData("LoR", "getLoRs"); },
    getLoNEs: async () => { return await getDynamicData("LoNE", "getLoNEs"); },
    getLoDs: async () => { return await getDynamicData("LoD", "getLoDs"); },
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

  // Tab options for section selection
  const tabOptions = [
    { label: "Section", icon: TbSquareRoundedLetterS },
    { label: "List", icon: TbSquareRoundedLetterL },
    { label: "Detail", icon: TbSquareRoundedLetterD },
  ];

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        {selectedSections
          .filter((section) => true)
          .map((section, index) => {
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
              const handleRef = React.useRef(null);
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

              drop(ref);
              drag(handleRef);

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
                      : section.type === "Feedback" ? el => feedbackPieceRef.current[index] = el
                      : section.type === "LoF" ? el => LoFPieceRef.current[index] = el
                      : section.type === "LoR" ? el => LoRPieceRef.current[index] = el
                      : section.type === "LoNE" ? el => LoNEPieceRef.current[index] = el
                      : section.type === "LoD" ? el => LoDPieceRef.current[index] = el
                      : null
                    }
                    data={section.data}
                    sectionId={section.data?.sec_id || section.id}
                    pageId={page_id}
                    onDataChange={(newData) => handleDataChange(newData, index)}
                    handleSectionRef={handleRef}
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
            <div className="grid !grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 gap-8 p-8">
              {tabOptions.map((tab, index) => (
                <button
                  key={index}
                  className={`cursor-pointer hover:!bg-gray-100 bg-white grid-cols-1 h-auto border rounded-xl ${
                    viewMode === tab.label ? "border-blue-500 ring-2 ring-blue-400" : ""
                  }`}
                  onClick={() => setViewMode(tab.label)}
                >
                  <tab.icon className="w-30 h-30 mx-auto mt-8" />
                  <h1 className="text-center text-2xl font-medium !mb-8">{tab.label}</h1>
                </button>
              ))}
            </div>
            <div className="grid !grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4 gap-8 p-8 !border-t-2">
              {sectionOptions
                .filter((section) => {
                  if (viewMode === "Section") return section.option === "Section";
                  if (viewMode === "List") return section.option === "List";
                  if (viewMode === "Detail") return section.option === "Detail";
                  return false;
                })
                .map((section, index) => (
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
