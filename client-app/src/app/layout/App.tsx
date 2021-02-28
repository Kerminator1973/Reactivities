import React, { Fragment, useEffect, useState} from 'react';
import { Container } from 'semantic-ui-react';
import {v4 as uuid} from 'uuid';
import { Activity } from './../models/activity';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import NavBar from './NavBar';
import agent from '../api/agent';

function App()  {

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

  // Загружаем список элементов из API, используя Axios
  useEffect(() => {
    agent.Activities.list().then(response => {
      setActivities(response);
    });
  }, [])

  // Определяем callback-функцию, которая будет искать Activity
  // в списке Activities по её идентификатору и будет устанавливать
  // selectedActivity соответствующим образом
  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(x => x.id === id))
  }

  // Определяем ещё одну callback-функцию, посредством которой мы можем
  // отметить выбор некоторой Activity
  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  // Определяем ещё две callback-функции, которые позволяют управлять
  // режимом "Просмотр/редактирование"
  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  // Определяем функцию, которая будет добавлять, или обновлять Activity
  // в общем списке активностей
  function handleCreateOrEditActivity(activity: Activity) {
    activity.id 
      ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
      : setActivities([...activities, {...activity, id: uuid()}]);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  // Определяем функцию, которая возволяет удалять Activity из списка
  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter(x => x.id !== id)]);
  }

  return (
    <Fragment>
      <NavBar openForm={handleFormOpen} />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </Fragment>
  );
}

export default App;
