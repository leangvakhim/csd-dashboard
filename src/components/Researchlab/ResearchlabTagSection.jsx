import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MediaLibraryModal from "../MediaLibraryModal";
import { API_ENDPOINTS, API } from "../../service/APIConfig";
import axios from "axios";

const ResearchlabTagSection = forwardRef(({ rsdl_id }, ref) => {
  const [rotatedStates, setRotatedStates] = useState({});
  const [isMediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [currentImageFieldId, setCurrentImageFieldId] = useState(null);
  const [tags, setTags] = useState([
    {
      id: "1",
      title: "Tag 1",
      rsdlt_title: null,
      rsdlt_img: null,
      active: 1,
      rsdlt_order: 1,
    },
  ]);

  useImperativeHandle(ref, () => ({
    getData: () => {
      const sorted = [...tags].sort((a, b) => a.rsdlt_order - b.rsdlt_order);
      return sorted.map((item, index) => {
        const baseItem = {
          rsdl_id: rsdl_id,
          rsdlt_id: item.rsdlt_id,
          rsdlt_title: item.rsdlt_title,
          rsdlt_img: item.rsdlt_img,
          rsdlt_img_id: item.rsdlt_img_id,
          active: item.active,
          rsdlt_order: index + 1,
        };
        if (typeof item.rsdlt_id === 'number') {
          baseItem.rsdlt_id = item.rsdlt_id;
        }
        return baseItem;
      });
    },
  }));

  const handleDeleteTag = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tag?")) return;

    try {
      await axios.put(`${API_ENDPOINTS.deleteResearchlabTag}/${id}`);
      setTags((prevItems) =>
        prevItems.map((item) =>
          item.rsdlt_id === id ? { ...item, active: item.active ? 0 : 1 } : item
        )
      );
      window.location.reload();
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const handleAddTag = () => {
    const newTag = {
      id: `${Date.now()}`,
      rsdl_id: rsdl_id,
      title: `Tag ${tags.length + 1}`,
      rsdlt_title: null,
      rsdlt_img: null,
      active: 1,
      rsdlt_order: tags.length + 1,
    };
    setTags((prevItems) => [...prevItems, newTag]);
  };

  const toggleRotation = (id) => {
    setRotatedStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newTags = Array.from(tags);
    const [reorderedTag] = newTags.splice(result.source.index, 1);
    newTags.splice(result.destination.index, 0, reorderedTag);
    const reorderedItems = newTags.map((item, index) => ({
      ...item,
      rsdlt_order: index + 1,
    }));

    setTags(reorderedItems);
  };

  const openMediaLibrary = (tagId) => {
    setCurrentImageFieldId(tagId);
    setMediaLibraryOpen(true);
  };

  const handleImageSelect = async (imageUrl) => {
    try {
      const response = await axios.get(API_ENDPOINTS.getImages);
      const result = response.data;

      if (result.status_code === "success" && Array.isArray(result.data)) {
        const matchedImage = result.data.find((image) => image.image_url === imageUrl);

        if (matchedImage) {
          setTags((prevItems) =>
            prevItems.map((item) =>
              item.id === currentImageFieldId
                ? {
                    ...item,
                    rsdlt_img: `${API}/storage/uploads/${matchedImage.img}`,
                    rsdlt_img_id: matchedImage.image_id,
                  }
                : item
            )
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch image data:", error);
      alert("Error fetching image data");
    }
    setMediaLibraryOpen(false);
    setCurrentImageFieldId(null);
  };

  useEffect(() => {
    if (rsdl_id) {
      fetch(`${API_ENDPOINTS.getResearchlab}/${rsdl_id}`)
        .then((res) => res.json())
        .then(async (result) => {
          if (Array.isArray(result.data)) {
            const imgRes = await fetch(`${API_ENDPOINTS.getImages}`);
            const imgData = await imgRes.json();

            const formattedTags = result.data.map((item, index) => {
              const matchedImage = Array.isArray(imgData?.data)
                ? imgData.data.find((img) => String(img.image_id) === String(item.rsdlt_img))
                : null;

              return {
                rsdlt_id: item.rsdlt_id || null,
                rsdl_id: rsdl_id,
                id: String(item.rsdlt_id || `${index}_${Date.now()}`),
                title: `Tag ${index + 1}`,
                rsdlt_title: item.rsdlt_title || "",
                rsdlt_img: matchedImage ? `${API}/storage/uploads/${matchedImage.img}` : null,
                rsdlt_img_id: item.rsdlt_img || null,
                active: item.active ?? 1,
                rsdlt_order: index + 1,
              };
            });

            setTags(formattedTags);
          }
        })
        .catch((err) => console.error("Error fetching tag data:", err));
    }
  }, [rsdl_id]);

  return (
    <div>
      <div className="flex-1">
        <label className="block text-xl font-medium leading-6 text-white-900">
          Tags
        </label>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tags">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="mt-2"
              >
                <ul className="h-auto overflow-y-auto border rounded-t-lg mt-1">
                  {tags.map((tag, index) => (
                    <Draggable key={tag.id} draggableId={tag.id} index={index}>
                      {(provided) => (
                        <li
                          className={`below-border ${
                            index === tags.length - 1 ? "border-none" : ""
                          }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <details className="group [&_summary::-webkit-details-marker]:hidden !border-b-1">
                            <summary
                              className="cursor-pointer flex justify-between rounded-lg px-2 py-2 pl-5 w-full"
                              onClick={() => toggleRotation(tag.id)}
                            >
                              <div className="flex">
                                <div
                                  className="cursor-grab my-auto"
                                  {...provided.dragHandleProps}
                                >
                                  <svg
                                    className="cursor-grab size-5 my-auto"
                                    viewBox="0 0 320 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"></path>
                                  </svg>
                                </div>
                                <span className="ml-2 text-lg">{tag.title}</span>
                              </div>
                              <span className="shrink-0 transition-transform duration-500 group-open:-rotate-0 flex gap-2">
                                <div className="block">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6 cursor-pointer"
                                    onClick={() => handleDeleteTag(tag.rsdlt_id)}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </div>
                                <span
                                  className={`cursor-pointer shrink-0 transition-transform duration-300 ${
                                    rotatedStates[tag.id] ? "rotate-180" : ""
                                  }`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m4.5 15.75 7.5-7.5 7.5 7.5"
                                    />
                                  </svg>
                                </span>
                              </span>
                            </summary>
                            <div className="grid grid-cols-1 gap-4 px-4 py-2">
                              <div className="flex-1">
                                <label className="block text-xl font-medium leading-6 text-white-900">
                                  Title
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    value={tag.rsdlt_title || ""}
                                    onChange={(e) => {
                                      const newTags = [...tags];
                                      newTags[index].rsdlt_title = e.target.value;
                                      setTags(newTags);
                                    }}
                                    className="!border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 px-4 py-2">
                              <div className="flex-1">
                                <label className="block text-xl font-medium leading-6 text-white-900">
                                  Image
                                </label>
                                <div className="flex items-center justify-center w-full mt-2 border-1">
                                  <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    {tag.rsdlt_img ? (
                                      <div>
                                        <img
                                          src={tag.rsdlt_img}
                                          alt="Selected"
                                          className="h-40 w-40 object-contain"
                                        />
                                        <div className="flex gap-3 mt-2 justify-center">
                                          <svg
                                            onClick={() => openMediaLibrary(tag.id)}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="size-8 hover:text-red-700"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                                            />
                                          </svg>
                                          <svg
                                            onClick={() => {
                                              const updated = [...tags];
                                              updated[index].rsdlt_img = null;
                                              updated[index].rsdlt_img_id = null;
                                              setTags(updated);
                                            }}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="size-8 hover:text-red-700"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                            />
                                          </svg>
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        onClick={() => openMediaLibrary(tag.id)}
                                        className="flex flex-col items-center justify-center pt-5 pb-6"
                                      >
                                        <svg
                                          className="w-8 h-8 mb-4 text-gray-500"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 20 16"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                          />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500">
                                          <span className="font-semibold">
                                            Click to upload image
                                          </span>
                                        </p>
                                      </div>
                                    )}
                                  </label>
                                </div>
                              </div>
                              {isMediaLibraryOpen && (
                                <MediaLibraryModal
                                  onSelect={handleImageSelect}
                                  onClose={() => setMediaLibraryOpen(false)}
                                />
                              )}
                            </div>
                          </details>
                        </li>
                      )}
                    </Draggable>
                  ))}
                </ul>
                <a
                  className="flex items-center p-3 text-sm font-medium text-blue-600 !border-b !border-x rounded-b-lg bg-gray-50 cursor-pointer hover:bg-gray-100 hover:underline"
                  onClick={handleAddTag}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  Add new tag
                </a>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
});

export default ResearchlabTagSection;