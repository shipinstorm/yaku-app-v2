import { Button, Typography } from '@mui/material';

const BannerSpace = ({ title, title2, description }: any) => {
  return (
    <div
      className="h-[70vh] w-full flex items-center md:mx-4 p-4 z-50"
      style={{ pointerEvents: "none" }}
    >
      <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
        <div className="text-center">
          <h1 className="font-akirabold text-3xl tracking-tight text-white-900 sm:text-4xl md:text-5xl">
            <span className="block">{title}</span>
            <span className="block text-purple-700">{title2}</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            {description}
          </p>
          <div className="pt-4">
            <Button
              sx={{ borderRadius: 30, pointerEvents: "auto" }}
              className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
              color="secondary"
              variant="contained"
              onClick={() =>
                window.open(
                  "https://store.epicgames.com/p/yakuverse-170f13",
                  "_blank"
                )
              }
            >
              <Typography component="p" noWrap>
                PLAY NOW
              </Typography>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSpace;
