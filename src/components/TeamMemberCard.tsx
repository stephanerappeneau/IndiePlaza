import Image from 'next/image';
import React from 'react';

type ABOUT_CARD_PROPS = {
  imageUrl: string;
  title: string;
  description: string;
  sub_description: string;
};

const TeamMemberComponent: React.FC<ABOUT_CARD_PROPS> = (member) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center space-x-4 mb-4">
        <Image
          className="rounded-full shadow-md w-12 h-12"
          src={member.imageUrl}
          alt={member.title}
          width={100}
          height={100}
          loading="eager"
        />
        <div>
          <div className="text-lg font-semibold">{member.title}</div>
          <div className="text-gray-600">{member.description}</div>
        </div>
      </div>
      <div className="text-gray-700">{member.sub_description}</div>
    </div>
  );
};

export default TeamMemberComponent;
