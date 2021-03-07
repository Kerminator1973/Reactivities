import { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import HomePage from '../../features/home/HomePage';
import { Route } from 'react-router-dom';
import ActivityForm from '../../features/activities/form/ActivityForm';

function App()  {
  return (
    <Fragment>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <Route exact path='/' component={HomePage} />
        <Route path='/activities' component={ActivityDashboard} />
        <Route path='/createActivity' component={ActivityForm} />
      </Container>
    </Fragment>
  );
}

export default observer(App);
