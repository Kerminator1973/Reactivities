import { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import HomePage from '../../features/home/HomePage';
import { Route, useLocation } from 'react-router-dom';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/dashboard/details/ActivityDetails';

function App()  {

  // Используем hook useLocation(), чтобы решить проблему сохранения значений в полях
  // ввода на форме ActivityForm. Проблема связана с использованием useEffect()
  const location = useLocation();

  return (
    <Fragment>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/activities' component={ActivityDashboard} />
        <Route path='/activities/:id' component={ActivityDetails} />
        <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
      </Container>
    </Fragment>
  );
}

export default observer(App);
