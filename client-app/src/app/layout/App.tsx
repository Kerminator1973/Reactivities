import React, { Fragment, useEffect, useState} from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from './models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

function App()  {

  // Определяем состояние функционального компонента. Используя 
  // специализацию, явно указываем тип состояния, что обеспечивает
  // контроль типов при их использовании, см. activities.map()
  const [activities, setActivities] = useState<Activity[]>([]);

  // Определяем дополнительное состояние, которое будет хранить
  // текущий выбранный Activity-элемент
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

  // Загружаем список элементов из API, используя Axios
  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities')
      .then(response => {
          setActivities(response.data);
      })
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

  return (
    <Fragment>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
        />
      </Container>
    </Fragment>
  );
}

export default App;
