// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Grid } from "@mui/material";

// assets
import {
  IconBrandTwitter,
  IconBrandDiscord,
  IconMail,
  IconBook2,
} from "@tabler/icons-react";
import { map } from "lodash";
import SocialButton from "@/components/buttons/SocialButton";

// ==============================|| SOCIAL ICONS ||============================== //

const SocialSection = () => {
  const theme = useTheme();
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
    <>
      <Box
        sx={{
          mx: 2,
        }}
      >
        <Grid container spacing={1}>
          {map(socials, ({ title, link, icon, label }: any, idx) => (
            <Grid item xs={6} key={idx}>
              <SocialButton
                title={title}
                link={link}
                icon={icon}
                label={label}
                theme={theme}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default SocialSection;
