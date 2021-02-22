import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Activity } from '../../../app/layout/models/activity';
import ActivityList from './ActivityList';

// Определяем набор свойств компонента
interface Props {
    activities: Activity[];
}

// Можно было бы использовать упрощённый вариант определения свойства объекта:
//      export default function ActivityDashboard({activities}: Props) {
// В этом случае мы могли бы написать вместо: Props 
//      {props.activities.map((activity) => (
// вот такой код:
//      {activities.map((activity) => (

export default function ActivityDashboard({activities}: Props) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList activities={activities} />
            </Grid.Column>
        </Grid>
    )
}