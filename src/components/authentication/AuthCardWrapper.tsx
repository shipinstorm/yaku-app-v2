// project import
import MainCard, { MainCardProps } from "@/components/cards/MainCard";

// ==============================|| AUTHENTICATION CARD WRAPPER ||============================== //

const AuthCardWrapper = ({ children, ...other }: MainCardProps) => (
  <MainCard
    sx={{
      maxWidth: { xs: 400, lg: 475 },
      margin: { xs: 2.5, md: 3 },
      "& > *": {
        flexGrow: 1,
        flexBasis: "50%",
      },
    }}
    content={false}
    {...other}
  >
    <div className="p-4 sm:p-6">{children}</div>
  </MainCard>
);

export default AuthCardWrapper;
