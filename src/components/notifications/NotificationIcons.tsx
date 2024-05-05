import {
  IconBellRinging,
  IconFileInvoice,
  IconInfoCircle,
  IconMessageCircle,
  IconParachute,
  IconPlanet,
  IconSpeakerphone,
  IconTrendingUp,
} from "@tabler/icons-react";

const NotificationIcons = ({ icon }: any) => (
  <>
    {icon === "planet" && <IconPlanet stroke={1.5} size="1.3rem" />}
    {icon === "trendup" && <IconTrendingUp stroke={1.5} size="1.3rem" />}
    {icon === "parachute" && <IconParachute stroke={1.5} size="1.3rem" />}
    {icon === "speakerphone" && <IconSpeakerphone stroke={1.5} size="1.3rem" />}
    {icon === "file" && <IconFileInvoice stroke={1.5} size="1.3rem" />}
    {icon === "bell" && <IconBellRinging stroke={1.5} size="1.3rem" />}
    {icon === "info" && <IconInfoCircle stroke={1.5} size="1.3rem" />}
    {icon === "message" && <IconMessageCircle stroke={1.5} size="1.3rem" />}
  </>
);
export default NotificationIcons;
