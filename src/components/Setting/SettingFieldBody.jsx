import React from "react";
import SettingFieldHeader from "./SettingFieldHeader";
import SettingFieldBodyInfo from "./SettingFieldBodyInfo";
import Aside from "../Aside";

const SettingFieldBody = () => {
  return (
    <div id="main-wrapper" className=" flex">
      <Aside />

      <div className=" w-full page-wrapper overflow-hidden">
        <SettingFieldHeader />
        <SettingFieldBodyInfo />
      </div>
    </div>
  );
};

export default SettingFieldBody;
