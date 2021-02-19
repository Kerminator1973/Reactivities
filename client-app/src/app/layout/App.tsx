import React, {Component} from 'react';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

class App extends Component {

  state = {
    values: []
  }

  componentDidMount() {
    axios.get('http://localhost:5000/api/activities')
      .then(response =>{
        this.setState({
          values: response.data
        })
      })
  }

  render() {

    return (
      <div>
        <Header as='h2' icon='users' content='Reactivities' />
          <List>
            {this.state.values.map((value: any) => (
              <List.Item key={value.id}>{value.title}</List.Item>
            ))}
          </List>
      </div>
    );
  }
}

export default App;
