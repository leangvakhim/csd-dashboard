import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import JoditEditor from 'jodit-react';
import 'jodit/es5/jodit.css';

const config = {
  readonly: false,  // Set to true for read-only mode
  height: 400,
  placeholder: 'Start typing...',
  buttons: [
    'bold', 'italic', 'underline', 'strikethrough', '|',
    'ul', 'ol', '|', 'image', 'link', 'table', '|',
    'align', 'undo', 'redo', 'hr', '|',
    'source'
  ],
  uploader: {
    insertImageAsBase64URI: true,  // Enable base64 image upload
  },
};

const EventsRichText = () => {
  const [rotatedStates, setRotatedStates] = useState({});
  const [subtitleContent, setSubtitleContent] = useState('');
  const [info, setInfo] = useState([
    {
      id: "1",
      title: "Information 1",
      subtitle: "",
      place: "",
    },
  ]);

  const handleAddInfo = () => {
    const newInfo = {
      id: `${Date.now()}`,
      title: `Information ${info.length + 1}`,
      subtitle: "",
      place: "",
    };

    setInfo([...info, newInfo]);
  };

  const toggleRotation = (id) => {
    setRotatedStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newInfo = Array.from(info);
    const [reorderedInfo] = newInfo.splice(result.source.index, 1);
    newInfo.splice(result.destination.index, 0, reorderedInfo);

    setInfo(newInfo);
  };

  return (
    <div>
      {/* Faculty Info */}
      <div className="flex-1">

        <div className="grid grid-cols-1 gap-4 py-2">
          <div className="w-full">
            <label className="block text-xl font-medium leading-6 text-white-900">
              Description
            </label>
            <div className="mt-2 cursor-text">
              <JoditEditor
                value={subtitleContent}
                config={config}
                onChange={(newContent) => setSubtitleContent(newContent)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventsRichText