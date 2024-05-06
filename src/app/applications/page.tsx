"use client"

import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import YakuIcon from "@/components/icons/YakuIcon";
import { LOGO } from "@/config/config";

const AppstoreData = [
  {
    id: "mint-calendar",
    title: <FormattedMessage id="mint-calendar" />,
    url: "/applications/calendar",
    icon: LOGO,
    description: "Upcoming mint for your reminder",
    coming: false,
  },
  {
    id: "raffles",
    title: <FormattedMessage id="raffles" />,
    url: "/applications/raffles",
    icon: LOGO,
    description: "Raffles rewards for Yaku holders",
    coming: false,
  },
  {
    id: "staking",
    title: <FormattedMessage id="staking" />,
    url: "/applications/staking",
    icon: LOGO,
    description: "Stake for some $Yaku",
    coming: false,
  },
];

const Appstore = () => (
  <div className="vault-container flex">
    <div className="w-full">
      <div className="mb-6">
        <h2 className="primary-title ml-2">App Store</h2>
        <p className="detail-text text-muted mt-3 ml-2">
          Interact with your favorite dapps.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-2 lg:gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-6 w-100 md:w-2/3">
          {AppstoreData.map((el, idx) => (
            <Link key={idx} to={el.url} className="card app-box flex h-full">
              <div className="flex-shrink-0">
                <YakuIcon icon={el.icon} />
              </div>
              <div className="ml-2">
                <h3 className="secondary-title">{el.title}</h3>
                <p className="detail-text text-muted">{el.description}</p>
              </div>
              {el.coming && <p className="coming">Comming Soon</p>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Appstore;
