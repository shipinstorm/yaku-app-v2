import { each, get, groupBy, map, sum } from 'lodash';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

export const calculateMonthlyPayout = (projectData: any, solPrice: number) =>
    sum(
        map(projectData, ({ amount, method, period }: any) => {
            let Weekly = dayjs().endOf('month').week() - dayjs().startOf('month').week() + 1;
            if (dayjs().startOf('month').week() > dayjs().endOf('month').week()) {
                Weekly = dayjs().endOf('month').week() - 1;
            }
            const multiplier: Record<string, number> = {
                Daily: dayjs().daysInMonth(),
                Weekly,
                Biweeky: Weekly / 2,
                Monthly: 1
            };
            return +amount * (method === 'SOL' ? solPrice : 1) * (multiplier[period] || 1);
        })
    );

export const generateNotify = (projectData: {
    project: string;
    name: string;
    user: string;
    amount: number;
    method: string;
    time: string;
    period: string;
}) => {
    const projectGrp = groupBy(projectData, 'project');
    const after1days: any = {};
    const after3days: any = {};
    const after7days: any = {};
    const after30days: any = {};
    const employees: any = {};
    each(Object.keys(projectGrp), (key: string) => {
        map(projectGrp[key], ({ name, user, amount, method, time }: any) => {
            if (!after1days[key]) {
                after1days[key] = {};
            }
            if (after1days[key][method] === undefined) {
                after1days[key][method] = 0;
            }
            if (!after3days[key]) {
                after3days[key] = {};
            }
            if (after3days[key][method] === undefined) {
                after3days[key][method] = 0;
            }
            if (!after7days[key]) {
                after7days[key] = {};
            }
            if (after7days[key][method] === undefined) {
                after7days[key][method] = 0;
            }
            if (!after30days[key]) {
                after30days[key] = {};
            }
            if (after30days[key][method] === undefined) {
                after30days[key][method] = 0;
            }
            if (dayjs(time).diff(dayjs(), 'days') <= 1) {
                after1days[key][method] += +amount;
            }
            if (dayjs(time).diff(dayjs(), 'days') <= 3) {
                after3days[key][method] += +amount;
            }
            if (dayjs(time).diff(dayjs(), 'days') <= 7) {
                after7days[key][method] += +amount;
            }
            if (dayjs(time).diff(dayjs(), 'days') <= 30) {
                after30days[key][method] += +amount;
            }
            if (!employees[key]) {
                employees[key] = [];
            }
            employees[key].push({
                avatar: get(user, '0.avatar'),
                vanity: get(user, '0.vanity'),
                _id: get(user, '0._id'),
                name
            });
        });
    });
    return {
        after1days,
        after3days,
        after7days,
        after30days,
        employees
    };
};

export const displayAlertLabel = (notifyProjects: any, project: string, type: string, balance: number) => {
    let color: 'error' | 'info' | 'success' | 'warning' | undefined;
    let dayLabel = '';
    if (balance < get(notifyProjects, ['after1days', project, type])) {
        color = 'error';
        dayLabel = `next day`;
    } else if (balance < get(notifyProjects, ['after3days', project, type])) {
        color = 'warning';
        dayLabel = `3 days`;
    } else if (balance < get(notifyProjects, ['after7days', project, type])) {
        color = 'info';
        dayLabel = `7 days`;
    } else if (balance < get(notifyProjects, ['after30days', project, type])) {
        color = 'info';
        dayLabel = `30 days`;
    }
    const titleLabel: string = `Insufficient ${type} for ${dayLabel}`;
    return {
        color,
        label: titleLabel
    };
};

export default {
    calculateMonthlyPayout,
    generateNotify
};
