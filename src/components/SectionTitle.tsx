import React from "react";

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ icon, title }) => {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
  );
};

export default SectionTitle;
