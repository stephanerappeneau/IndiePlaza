import React from 'react';
import AppLayout from '@/components/AppLayout/AppLayout';
import data from '@/data/data';
import TeamMemberComponent from '@/components/TeamMemberCard';

const path = [{ label: 'About', href: '/about', last: false }];

const AboutPage: React.FC = () => {
  return (
    <AppLayout
      title="Indie plaza Where Ideas Meet Opportunity"
      description="Indie Plaza Project is a one-stop shop to support european indies in their financing quest. Access our database of hundreds of financing solutions and experts in video games studio creation and funding. The Indie Plaza project has been granted funding by the Creative Europe Business Innovation Program"
      path={path}
    >
      <div className="container mx-auto mt-16 text-sm lg:text-lg leading-8 font-thin px-3">
        <div>
          We established this platform recognizing the challenges many
          independent European game studios face in managing their economic and
          international growth.
        </div>
        <div>
          They struggle to find specialized financiers and meet their
          expectations, to identify the right financial tools at the right stage
          of their production development, and to locate legal, financial, and
          accounting experts with experience in the gaming industry.
        </div>
        <div>
          Our platform is designed for those smaller studios who may not have
          the resources to hire a dedicated financial director.
        </div>
        <div>
          We aim to bridge these gaps, providing these studios with tailored,
          professional advice and resources, enabling them to focus on what they
          do best - creating captivating games.
        </div>
        <h1 className="text-2xl text-center my-10">They whisper our name</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-20">
          {data.our_team.map((el, index) => (
            <TeamMemberComponent
              key={index}
              title={el.title}
              description={el.description}
              sub_description={el.sub_description}
              imageUrl={el.imageUrl}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default AboutPage;
