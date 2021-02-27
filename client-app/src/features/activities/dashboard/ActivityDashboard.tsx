import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Activity } from '../../../app/layout/models/activity';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';
import ActivityDetails from './details/ActivityDetails';

// Определяем набор свойств компонента
interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id: string) => void;
    cancelSelectActivity: () => void;
    editMode: boolean;
    openForm: (id: string) => void;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
}

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

export default function ActivityDashboard({activities, selectedActivity, 
        selectActivity, cancelSelectActivity, editMode, openForm, closeForm, createOrEdit}: Props) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList activities={activities} selectActivity={selectActivity} />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !editMode && <ActivityDetails 
                    activity={selectedActivity}
                    cancelSelectActivity={cancelSelectActivity}
                    openForm={openForm}
                />}
                {editMode &&
                <ActivityForm closeForm={closeForm} activity={selectedActivity} createOrEdit={createOrEdit} />}
            </Grid.Column>
        </Grid>
    )
}