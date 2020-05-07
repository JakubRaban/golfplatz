import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Text, NestedForm } from "react-form";


const PlotPart = ({ i }) => (
  <NestedForm field={["plotParts", i]} key={`nested-plot-part-${i}`}>
    <Form>
      {formApi => (
        <div>
          <h3>Część fabuły</h3>
          <label htmlFor={`nested-plot-part-first-${i}`}>Nazwa</label>
          <Text field="name" id={`nested-plot-part-first-${i}`} />
          <label htmlFor={`nested-plot-part-last-${i}`}>Krótki opis</label>
          <Text field="introduction" id={`nested-plot-part-last-${i}`} />
        </div>
      )}
    </Form>
  </NestedForm>
);


export class AddPlotParts extends Component {
  static propTypes = {
    user: PropTypes.any,
    isAuthenticated: PropTypes.bool,
  };

  continue = e => {
    e.preventDefault();
    this.props.values.plotParts.pop();
    this.props.values.plotParts.unshift(this.firstPlotPart);
    this.props.handleChange(this.props.values.plotParts);
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  firstPlotPart = {};

  mapAllParts(plotPartValues) {
    if (plotPartValues.length === 1) {
      this.firstPlotPart = plotPartValues[0];
    } else {
      this.props.values.plotParts = plotPartValues;
    }
  }

  render() {
    return(
      <div>
        <Form onSubmit={this.onSubmit}>
        {formApi => (
          <div>
            <form onSubmit={formApi.submitForm} id="plot-form">
                <div key={0}>
                  <PlotPart i={0} />
                </div>
                {formApi.values.plotParts &&
                  formApi.values.plotParts.slice(1).map((f, i) => (
                    <div key={i}>
                      <PlotPart i={i} />
                    </div>
                    
                  ), this.mapAllParts(formApi.values.plotParts))}
                <button
                  onClick={() =>
                    formApi.addValue("plotParts", {
                      name: "",
                      introduction: ""
                    })}
                  type="button">Dodaj część fabuły</button>
                <button onClick={this.continue}>
                  Dalej
                </button>
            </form>        
          </div>
        )}
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(AddPlotParts);