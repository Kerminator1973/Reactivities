import React, { Fragment, useEffect, useState} from 'react';
import axios from 'axios';
import { Container, List } from 'semantic-ui-react';
import { Activity } from './models/activity';
import NavBar from './NavBar';

function App()  {

  // Определяем состояние функционального компонента. Используя 
  // специализацию, явно указываем тип состояния, что обеспечивает
  // контроль типов при их использовании, см. activities.map()
  const [activities, setActivities] = useState<Activity[]>([]);

  // Загружаем список элементов из API, используя Axios
  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities')
      .then(response => {
          setActivities(response.data);
      })
  }, [])

  return (
    <Fragment>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <List>
          {activities.map((activity) => (
            <List.Item key={activity.id}>{activity.title}</List.Item>
          ))}
        </List>
      </Container>
    </Fragment>
  );
}

export default App;
