// assets
import {
  IconBrandTwitter,
  IconBrandDiscord,
  IconMail,
  IconBook2,
} from "@tabler/icons-react";
import { map } from "lodash";

import SocialButton from "@/components/buttons/SocialButton";

const SocialSection = () => {
  const socials = [
    {
      title: "Submit feedback",
      link: "https://yaku.canny.io/",
      icon: <IconMail stroke={1.5} size="1.3rem" />,
      label: "Feedback",
    },
    {
      title: "Yaku's Twitter",
      link: "https://twitter.com/YakuCorp",
      icon: <IconBrandTwitter stroke={1.5} size="1.3rem" />,
      label: "Twitter",
    },
    {
      title: "Yaku's Discord",
      link: "https://discord.gg/yakux",
      icon: <IconBrandDiscord stroke={1.5} size="1.3rem" />,
      label: "Discord",
    },
    {
      title: "Yaku's Wiki",
      link: "https://wiki.yaku.ai/",
      icon: <IconBook2 stroke={1.5} size="1.3rem" />,
      label: "Wiki",
    },
  ];

  return (
    <div className="mx-2">
      <div className="flex flex-wrap -mx-1">
        {map(socials, ({ title, link, icon, label }: any, idx) => (
          <div className="w-1/2 pt-2 pl-2" key={label}>
            <SocialButton title={title} link={link} icon={icon} label={label} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialSection;
