'use client';

import { 
  Crown, 
  Vegan, 
  Ghost, 
  Squirrel, 
  Cookie, 
  Drama,
  LucideIcon 
} from "lucide-react";

interface SponsorProps {
  icon: LucideIcon;
  name: string;
}

const sponsors: SponsorProps[] = [
  {
    icon: Crown,
    name: "Acmebrand",
  },
  {
    icon: Vegan,
    name: "Acmelogo",
  },
  {
    icon: Ghost,
    name: "Acmesponsor",
  },
  {
    icon: Squirrel,
    name: "Acme",
  },
  {
    icon: Cookie,
    name: "Accmee",
  },
  {
    icon: Drama,
    name: "Acmetech",
  },
];

export const SponsorsSection = () => {
  return (
    <section id="sponsors" className="max-w-[75%] mx-auto pb-24 sm:pb-32">
      <h2 className="text-lg md:text-xl text-center mb-6">
        Our Platinum Sponsors
      </h2>

      <div className="relative overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {sponsors.map(({ icon: Icon, name }) => (
            <div
              key={name}
              className="flex items-center text-xl md:text-2xl font-medium mx-8"
            >
              <Icon 
                size={32} 
                className="mr-2 text-white" 
              />
              {name}
            </div>
          ))}
          {/* Duplicate sponsors for seamless loop */}
          {sponsors.map(({ icon: Icon, name }) => (
            <div
              key={`${name}-duplicate`}
              className="flex items-center text-xl md:text-2xl font-medium mx-8"
            >
              <Icon 
                size={32} 
                className="mr-2 text-white" 
              />
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};