import React from 'react';
import { IconType } from 'react-icons';

interface MainLinkProps {
  href: string;
  text: string;
  Icon: IconType;
}

const MainLink: React.FC<MainLinkProps> = ({ href, text, Icon }) => {
  return (
    <a href={href} className="flex items-center text-blue-500 hover:underline mb-4">
      <Icon className="mr-2" />
      {text}
    </a>
  );
};

export default MainLink;
