import { map } from "lodash";

const PartnerLogos = () => {
  const partners = [
    {
      name: "Immutable",
      image: "/images/partners/immutable-logo-horiz-noreg-WHT-RGB-01.svg",
      style: "",
    },
    {
      name: "Justin",
      image: "/images/partners/justin_kan.png",
      style: "",
    },
    {
      name: "Epic",
      image: "/images/partners/Epic_Games_logo.png",
      style: "",
    },
    {
      name: "Solana Foundation",
      image: "/images/partners/solana-foundation-text.svg",
      style: "p-2",
    },
    {
      name: "Honda",
      image: "/images/partners/Honda-logo.svg",
      style: "p-2",
    },
    {
      name: "Toy's Rus",
      image: "/images/partners/Toys__R__Us_logo.svg",
      style: "p-1",
    },
    {
      name: "Magic Eden",
      image: "/images/partners/magic-eden.png",
      style: "p-2",
    },
    {
      name: "Open Sea",
      image: "/images/partners/audius.png",
      style: "",
    },
    {
      name: "Phantom",
      image: "/images/partners/phantom-icon-purple.svg",
      style: "",
    },
    {
      name: "Monke DAO",
      image: "/images/partners/monkedao.png",
      style: "",
    },
    {
      name: "Unreal Engine",
      image: "/images/partners/Degods.png",
      style: "",
    },
    {
      name: "Fractal",
      image: "/images/partners/MadLads.png",
      style: "",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-0 md:px-6 lg:px-8">
      <div className="card p-12 mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:gap-x-10 lg:mx-0 lg:max-w-none">
        {map(partners, ({ name, image, style }: any, idx: number) => (
          <div className="col-span-2 w-full object-contain lg:col-span-1">
            <img
              className={"max-h-14 object-contain w-full " + style}
              src={image}
              alt={name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerLogos;
