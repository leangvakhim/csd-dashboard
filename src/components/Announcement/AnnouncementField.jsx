import React from "react";
import Aside from "../Aside";
import AnnouncementFieldHeader from "./AnnouncementFieldHeader";
import AnnouncementFieldBody from "./AnnouncementFieldBody";
import { useState } from "react";
import { API_ENDPOINTS } from "../../service/APIConfig";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const AnnouncementField = () => {

  return (
    <div id="main-wrapper" class=" flex">
      <Aside />

      <div class=" w-full page-wrapper overflow-hidden">
        <AnnouncementFieldHeader />
        <AnnouncementFieldBody />
      </div>
    </div>
  );
};

export default AnnouncementField;
