import React from "react";
import WjEditor from "@/components/WjEditor/index";
import { useLocation } from "umi";

const Index: React.FC = () => {
  const detailsFromProps = (useLocation() as any).state;

  return (
    <div className="layout-padding-white">
      <WjEditor detailsFromProps={detailsFromProps} />
    </div>
  );
};

export default Index;
