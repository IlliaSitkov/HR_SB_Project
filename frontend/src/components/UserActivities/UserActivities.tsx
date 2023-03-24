/*eslint-disable react-hooks/exhaustive-deps*/
import React, { FC, useEffect, useState } from 'react';
import { Activity, getActivitiesOfUser } from '../../api/activity';

import './UserActivities.css';

export const UserActivities: FC<{ personId: number }> = ({ personId }) => {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [activityGroups, setActivityGroups] = useState<Activity[][]>([]);

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		groupActivitiesByYear();
	}, [activities]);

	const groupActivitiesByYear = () => {
		let year: number;
		const groups = activities.reduce(
			(acc: Activity[][], activity: Activity): Activity[][] => {
				if (acc.length === 0 || activity.year !== year) {
					year = activity.year;
					return [...acc, [activity]];
				} else {
					acc[acc.length - 1].push(activity);
					return acc;
				}
			},
			[]
		);
		setActivityGroups(groups);
	};

	const fetchData = async () => {
		const activities = await getActivitiesOfUser(personId);
		setActivities(activities);
	};

	const tables = () => {
		return activityGroups.map((g) => oneYearGroupRows(g));
	};

	const oneYearGroupRows = (activitiesGroup: Activity[]) => {
		return (
			<tbody key={activitiesGroup[0].year}>
				<tr>
					<td rowSpan={activitiesGroup.length + 1}>
						{activitiesGroup[0].year}
					</td>
				</tr>
				{activitiesGroup.map((a) => (
					<tr key={(a as any).person_id + ' ' + (a as any).event_id}>
						<td>{a.event.name}</td>
						<td>{a.position}</td>
						<td>{a.contribution}</td>
						<td>{a.hours}</td>
					</tr>
				))}
				<tr className='table-secondary'>
					<td colSpan={4}>Підсумок за рік</td>
					<td colSpan={4}>{sumHours(activitiesGroup)}</td>
				</tr>
			</tbody>
		);
	};

	const sumHours = (activities: Activity[]): number => {
		return activities.reduce((prev: number, cur: Activity): number => {
			return prev + cur.hours;
		}, 0);
	};

	return (
		<div>
			{activityGroups.length > 0 ? (
				<table className='table'>
					<thead>
						<tr>
							<th>Рік</th>
							<th>Назва події</th>
							<th>Посада</th>
							<th>Внесок</th>
							<th>Години стажування</th>
						</tr>
					</thead>
					{tables()}
					<tbody>
						<tr className='table-primary fw-bold'>
							<td colSpan={4}>Нараховано всього</td>
							<td>{sumHours(activities)}</td>
						</tr>
					</tbody>
				</table>
			) : (
				<p>В учасника немає жодних активностей</p>
			)}
		</div>
	);
};
