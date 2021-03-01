import React, { Fragment, useEffect, useState} from 'react';
import { Container } from 'semantic-ui-react';
import {v4 as uuid} from 'uuid';
import { Activity } from './../models/activity';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import NavBar from './NavBar';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

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

  // Определяем состояние "Загрузка страницы". Начальное состояние - true,
  // т.е. загрузка начинается в useEffect()
  const [loading, setLoading] = useState(true);

  // Загружаем список элементов из API, используя Axios
  useEffect(() => {
    agent.Activities.list().then(response => {

      // Обрабатываем полученные данные с целью корректировки формата
      // представления данных. Мы получаем данные в виде строк: 
      //    2021-01-13T19:08:55.7992459
      // React умеет обрабатывать строку в виде "2021-01-13"
      let activities: Activity[] = [];
      response.forEach(activity => {

        // Отделяем дату от времени
        activity.date = activity.date.split('T')[0];
        activities.push(activity);
      });

      // Устанавливаем полученный список Activities, в качестве состояния компонента 
      setActivities(activities);

      // Изменяем состояние страницы на "Загрузка завершена"
      setLoading(false);
    });
  }, []);

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

  // Если осуществляется загрузка страницы, то возвращает специализированный
  // компонент, в котором используются Dimmer и Loader
  if (loading) return <LoadingComponent content='Loading app' />

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
