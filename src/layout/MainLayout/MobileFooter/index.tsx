import { useDispatch } from 'react-redux';
import { setPage } from 'store/slices/subpageSlice';
import { activeItem } from 'store/slices/menu';
import mobileMenu from 'menu-items/mobile-menu';
import { map } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'store';

const Icon = ({ icon, ...props }: any) => {
    const Ico = icon!;
    return <Ico {...props} />;
};

const MobileFooter = ({ show }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { activePage } = useSelector<any>((state: any) => state.subpage);
    const { openItem } = useSelector<any>((state: any) => state.menu);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (
        <>
            {show && (
                <div className="fixed z-10 bottom-0 w-full">
                    <div className="bg-surface p-4 shadow flex items-center w-full justify-evenly">
                        {map(mobileMenu.items, ({ id, title, icon, url }: any, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className="bg-transparent"
                                onClick={() => {
                                    dispatch(setPage(title));
                                    dispatch(activeItem([id]));
                                    navigate(url);
                                }}
                            >
                                {icon && (
                                    <Icon
                                        icon={icon}
                                        stroke={1.5}
                                        className={`ml-1 ${
                                            openItem?.findIndex((itemId: any) => itemId === id) > -1 ? 'text-pink-main' : ''
                                        }`}
                                        size="24px"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default MobileFooter;
