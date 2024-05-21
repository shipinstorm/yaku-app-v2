/* eslint-disable */
import { useEffect, useState } from "react";

// project-imports
import { KeyedObject } from "@/types";
import MainCard from "@/components/MainCard";
import SkeletonProductPlaceholder from "@/components/skeleton/CardPlaceholder";
import { IMAGE_PROXY } from "@/config/config";

interface ProjectCardProps extends KeyedObject {
  image: string;
  name: string;
  nameTag?: string;
  description?: string;
  onClick?: Function;
  children?: any;
  sqaure?: boolean;
  height?: number;
}

const ProjectCard = ({
  image,
  name,
  nameTag,
  description,
  onClick,
  children,
  sqaure = false,
  cssClass = "",
  useProxy = true,
  height = 250,
  truncate = true,
}: ProjectCardProps) => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonProductPlaceholder />
      ) : (
        <MainCard
          border={false}
          content={false}
          className={`card shadow-none ${cssClass}`}
          sx={{ cursor: "pointer", minWidth: `calc(${height}px + 1rem)` }}
          onClick={onClick}
        >
          <div
            className={`m-2 ${
              sqaure ? "aspect-square" : ""
            } h-[200px] w-auto pt-2`}
          >
            <img
              className="object-cover w-full h-full rounded-3xl"
              src={`${useProxy ? IMAGE_PROXY : ""}${image}`}
              alt={name}
            />
          </div>
          <div className={!truncate ? "" : "pb-1"}>
            <div className="flex flex-col items-center pt-2 px-2 overflow-hidden">
              <h4
                className={`text-primary text-base ${
                  truncate ? "truncate" : ""
                }`}
              >
                {name}
              </h4>
              {nameTag && (
                <div className="max-w-full font-inter text-xs inline-flex items-center justify-center h-6 text-gray-300 bg-opacity-40 rounded-full whitespace-nowrap transition duration-300 ease-in-out cursor-default focus:outline-none bg-white">
                  <span className="overflow-hidden truncate px-2">
                    {nameTag}
                  </span>
                </div>
              )}
              <h6
                className={`text-terciary text-center w-[90%] overflow-hidden text-xs min-h-[19px] ${
                  truncate ? "truncate" : ""
                }`}
              >
                {description}
              </h6>
              {children}
            </div>
          </div>
        </MainCard>
      )}
    </>
  );
};

export default ProjectCard;
