import { Dispatch, SetStateAction } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store';
import { setSubpage } from 'store/slices/subpageSlice';

interface MobilePopoverProps {
    showMobilePopover: boolean;
    setShowMobilePopover: Dispatch<SetStateAction<boolean>>;
}

const MobilePopover = ({ showMobilePopover, setShowMobilePopover }: MobilePopoverProps) => {
    const { subpages } = useSelector((state: RootState) => state.subpage);
    const dispatch = useDispatch();

    return (
        <>
            {showMobilePopover && (
                <div className="fixed z-10 bottom-0 w-full p-3">
                    <div className="bg-surface p-4 rounded-2xl shadow">
                        <h3 className="mb-2 text-center text-lg font-bold">Select Subpage</h3>
                        {subpages.map((el, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className="flex items-center w-full border-b border-gray-500 bg-transparent"
                                onClick={() => {
                                    dispatch(setSubpage(el));
                                    setShowMobilePopover(false);
                                }}
                            >
                                <p className="p-3 text-base text-white">{el}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default MobilePopover;
