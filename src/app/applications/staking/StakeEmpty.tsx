const StakeEmpty = () => (
  <div className="flex flex-wrap -mt-6 -ml-6 w-[calc(100%+24px)]">
    <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
      <div className="text-center">
        <div className="flex flex-wrap -mt-6 -ml-6 w-[calc(100%+24px)] justify-center">
          <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
            <div className="flex flex-wrap -mt-6 -ml-6 w-[calc(100%+24px)]">
              <div className="box-border m-0 flex-grow max-w-full pl-6 pt-6">
                <div className="m-0 text-4xl font-bold font-inter leading-tight text-white">
                  You do not own any unstaked Yaku collections.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default StakeEmpty;
