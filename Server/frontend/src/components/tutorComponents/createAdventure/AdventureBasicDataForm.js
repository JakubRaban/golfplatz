
import { TextField } from '@material-ui/core';
import React from 'react';

class AdventureBasicDataForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => this.props.updateForm({ ...this.state }));
  }

  render() {
    return (
      <form>
        <TextField label={'Nazwa przygody'} id={'standard-basic'} name={'name'} value={this.state.name} onChange={this.handleChange} />
        <TextField label={'Opis przygody'} id={'standard-multiline-flexible'} name={'description'} value={this.state.description} onChange={this.handleChange} />
      </form>
    );
  }
}

export default AdventureBasicDataForm;
