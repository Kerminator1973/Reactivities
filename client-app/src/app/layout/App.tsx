import React, { Fragment, useEffect, useState} from 'react';
import { Container } from 'semantic-ui-react';
import {v4 as uuid} from 'uuid';
import { Activity } from './../models/activity';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import NavBar from './NavBar';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App()  {

  // Определяем объект для доступа к централизованному хранилищу.
  // Хранилище используется в JSX-коде, например:
  //    <h2>{activityStore.title}</h2>
  const {activityStore} = useStore();

  // Определяем состояние функционального компонента. Используя 
  // специализацию, явно указываем тип состояния, что обеспечивает
  // контроль типов при их использовании, см. activities.map()
  const [activities, setActivities] = useState<Activity[]>([]);

  // Определяем дополнительное состояние, которое будет хранить
  // текущий выбранный Activity-элемент
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

  // Определяем состояние, которое отражает режим работы формы - просмотр,
  // или редактирование Activity. Для простых типов нам не обязательно
  // явно указывать тип переменной-состояния
  const [editMode, setEditMode] = useState(false);

  // Определяем состояние "Выполнение Submit"
  const [submitting, setSubmitting] = useState(false);

  // Загружаем список элементов из API, используя Axios и систему
  // управления состояниями приложения ActivityStore
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  // Определяем функцию, которая будет добавлять, или обновлять Activity
  // в общем списке активностей
  function handleCreateOrEditActivity(activity: Activity) {
    setSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(x => x.id !== activity.id), activity]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      });
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      });
    }
  }

  // Определяем функцию, которая возволяет удалять Activity из списка,
  // а также из базы данных в API
  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    });
  }

  // Если осуществляется загрузка страницы, то возвращает специализированный
  // компонент, в котором используются Dimmer и Loader
  if (activityStore.loadingInitial) return <LoadingComponent content='Loading app' />

  return (
    <Fragment>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activityStore.activities}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </Fragment>
  );
}

export default observer(App);
