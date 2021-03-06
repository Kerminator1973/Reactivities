import { observer } from 'mobx-react-lite';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';
import ActivityDetails from './details/ActivityDetails';

// Можно было бы использовать упрощённый вариант определения свойства объекта:
//      export default function ActivityDashboard({activities}: Props) {
// В этом случае мы могли бы написать вместо: Props 
//      {props.activities.map((activity) => (
// вот такой код:
//      {activities.map((activity) => (

// Ниже в коде используется типовой для JavaScript трюк:
//      {activities[0] && 
//      <ActivityDetails activity={activities[0]} />}
// JSX-код трансформируется в обычный JavaScript-код вызова React-компонента 
// и при исполнении приведённая выше конструкция сначала сравнит activities[0]
// с null/undefined (это происходит т.к. используется логическое «И»), и если 
// значение не пустое, тогда будет вызван React-компонент, которому будет передан 
// нулевой элемент через свойство activity

export default observer( function ActivityDashboard() {

    const {activityStore} = useStore();
    const {selectedActivity, editMode} = activityStore;

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !editMode && <ActivityDetails />}
                {editMode &&
                <ActivityForm />}
            </Grid.Column>
        </Grid>
    )
})
