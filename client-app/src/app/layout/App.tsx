import React, { Fragment, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import NavBar from './NavBar';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App()  {

  // Определяем объект для доступа к централизованному хранилищу.
  // Хранилище используется в JSX-коде, например:
  //    <h2>{activityStore.title}</h2>
  const {activityStore} = useStore();

  // Загружаем список элементов из API, используя Axios и систему
  // управления состояниями приложения ActivityStore
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  // Если осуществляется загрузка страницы, то возвращает специализированный
  // компонент, в котором используются Dimmer и Loader
  if (activityStore.loadingInitial) return <LoadingComponent content='Loading app' />

  return (
    <Fragment>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
}

export default observer(App);
