import { map } from 'lodash';

const AsideLayout = ({ elements, cssClass }: any) => (
    <div className={`grid grid-cols-1 xl:grid-cols-4 mx-auto ${cssClass}`}>
        {map(elements, ({ component, colSpan = 1, css }) => (
            <aside className={`col-span-${colSpan} ${css}`}>{component}</aside>
        ))}
    </div>
);

export default AsideLayout;
