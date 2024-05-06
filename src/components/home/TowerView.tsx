const TowerView = ({ height, type, surface, loading }: any) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-8">
        <div className="w-1/2">
          <div className="rounded bg-gray-300 h-16"></div>
        </div>
        <div className="w-1/2">
          <div className="rounded bg-gray-300 h-16"></div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-wrap gap-1 my-4 justify-between items-center">
        <div className="p-0 flex flex-col justify-center items-center">
          <p className="text-terciary font-bold text-xs">
            {type === "Tower" ? "Height" : "Surface"}
          </p>
          <p className="text-lg font-bold">
            {`${type === "Tower" ? height : surface}`}
            {type === "Tower" ? (
              "m"
            ) : (
              <>
                m<sup>2</sup>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default TowerView;
