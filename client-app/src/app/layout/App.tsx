import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';
import { Activity } from './models/activity';

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
    <div>
      <Header as='h2' icon='users' content='Reactivities' />
        <List>
          {activities.map((activity) => (
            <List.Item key={activity.id}>{activity.title}</List.Item>
          ))}
        </List>
    </div>
  );
}

export default App;
