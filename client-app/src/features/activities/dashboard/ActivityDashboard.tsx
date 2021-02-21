import React from 'react';
import { Grid, List } from 'semantic-ui-react';
import { Activity } from '../../../app/layout/models/activity';

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

export default function ActivityDashboard(props: Props) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <List>
                    {props.activities.map((activity) => (
                        <List.Item key={activity.id}>{activity.title}</List.Item>
                    ))}
                </List>
            </Grid.Column>
        </Grid>
    )
}