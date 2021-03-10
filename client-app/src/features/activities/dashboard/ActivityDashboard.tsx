import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityList from './ActivityList';

// Можно было бы использовать упрощённый вариант определения свойства объекта:
//      export default function ActivityDashboard({activities}: Props) {
// В этом случае мы могли бы написать вместо: Props 
//      {props.activities.map((activity) => (
// вот такой код:
//      {activities.map((activity) => (

// Ниже в коде использовался типовой для JavaScript трюк:
//      {activities[0] && 
//      <ActivityDetails activity={activities[0]} />}
// JSX-код трансформируется в обычный JavaScript-код вызова React-компонента 
// и при исполнении приведённая выше конструкция сначала сравнит activities[0]
// с null/undefined (это происходит т.к. используется логическое «И»), и если 
// значение не пустое, тогда будет вызван React-компонент, которому будет передан 
// нулевой элемент через свойство activity

export default observer( function ActivityDashboard() {

    // Определяем объект для доступа к централизованному хранилищу.
    // Хранилище используется в JSX-коде, например:
    //    <h2>{activityStore.title}</h2>
    const {activityStore} = useStore();
    const {loadActivities, activityRegistry} = activityStore;

    // Загружаем список элементов из API, используя Axios и систему
    // управления состояниями приложения ActivityStore
    useEffect(() => {
        if (activityRegistry.size <= 1) loadActivities();
    }, [loadActivities, activityRegistry.size]);

    // Если осуществляется загрузка страницы, то возвращает специализированный
    // компонент, в котором используются Dimmer и Loader
    if (activityStore.loadingInitial) return <LoadingComponent content='Loading app' />    

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <h2>Activity filters</h2>
            </Grid.Column>
        </Grid>
    )
})
