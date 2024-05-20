const BadgeIcons: Record<string, string> = {
  BadgeIconAward1: "/images/icons/badges/badge-1.svg",
  BadgeIconAward: "/images/icons/badges/award.svg",
  BadgeIconBadge: "/images/icons/badges/badge.svg",
  BadgeIconBestEssay: "/images/icons/badges/best-essay-award.svg",
  BadgeIconBestSinger: "/images/icons/badges/best-singer-award.svg",
  BadgeIconBronzeCup: "/images/icons/badges/bronze-cup.svg",
  BadgeIconBronzeStar: "/images/icons/badges/bronze-star-medal.svg",
  BadgeIconCert: "/images/icons/badges/certificate.svg",
  BadgeIconDiamond1: "/images/icons/badges/diamond-1.svg",
  BadgeIconDiamond: "/images/icons/badges/diamond.svg",
  BadgeIconDiploma: "/images/icons/badges/diploma.svg",
  BadgeIconDiscord: "/images/icons/badges/discord.svg",
  BadgeIconGemstone: "/images/icons/badges/gemstone-1.svg",
  BadgeIconGemstone1: "/images/icons/badges/gemstone.svg",
  BadgeIconGoldMedal: "/images/icons/badges/gold-medal.svg",
  BadgeIconLemon: "/images/icons/badges/lemon.svg",
  BadgeIconMotor: "/images/icons/badges/motocross.svg",
  BadgeIconRocket: "/images/icons/badges/rocket.svg",
  BadgeIconShield: "/images/icons/badges/shield.svg",
  BadgeIconSilverStar: "/images/icons/badges/silver-star-medal.svg",
  BadgeIconStarCup: "/images/icons/badges/star-cup.svg",
  BadgeIconStarMedal: "/images/icons/badges/star-medal.svg",
  BadgeIconStar: "/images/icons/badges/star.svg",
  BadgeIconThirdBadge: "/images/icons/badges/third-badge.svg",
  BadgeIconThumbUp: "/images/icons/badges/thumb-up-medal.svg",
  BadgeIconTrophy: "/images/icons/badges/trophy.svg",
  BadgeIconTwitter: "/images/icons/badges/twitter.svg",
  BadgeIconWhale: "/images/icons/badges/whale.svg",
  BadgeIconSales: "/images/icons/badges/winner.svg",
};

const Badges = ({ icon, size = 24, alt }: any) => (
  <div className="text-white bg-elevation1 flex items-center gap-2 px-3 py-2 rounded-2xl">
    <img className="w-4" src={BadgeIcons[icon]} alt={alt} />
    <p className="text-xs font-medium">{alt}</p>
  </div>
);

export default Badges;
