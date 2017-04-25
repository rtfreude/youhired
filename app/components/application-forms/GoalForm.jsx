import React, { createClass } from 'react';
import { connect } from 'react-redux';
import 'react-date-picker/index.css';
import { TransitionView, Calendar } from 'react-date-picker';
import { changeDate } from '../../actions/jobsinformationpage/JobInformationActions';
import { selectGoalType } from '../../actions/dashboard/DashboardActions';
import moment from 'moment';
import { DropdownButton, MenuItem } from 'react-bootstrap';

const GoalForm = createClass({
  displayName: 'GoalForm',

  cancelForm() {
    this.goal.value = '';
    this.props.hideModal();
  },

  onSubmit(event) {
    event.preventDefault();
    this.props.addGoal({
      type: this.props.goalType,
      goal:  this.goal.value,
      date: this.props.currentDate
    })
    .then(() => {
      this.props.changeDate({
        startDate: moment()
      });
    });

    this.goal.value = '';
    this.props.hideModal();
  },

  selectStatus(event) {
    this.props.selectGoalType({
      goalType: event
    });
  },

  changeDate(dateString, { dateMoment, timestamp }) {

    let newDate = new Date();
    let timezone = newDate.getTimezoneOffset() / 60;
    let date = dateString.slice(0, 10)
    console.log(date);
    console.log('combined date', date + '-' + timezone);
    this.props.changeDate({
      currentDate: dateString + '-' + timezone
    });
  },

  render() {

    return (
      <form onSubmit={this.onSubmit}>
        <TransitionView>
          <Calendar
            dateFormat="DD/MM/YYYY HH:mm"
            defaultDate={this.props.startDate}
            onChange={this.changeDate}
          />
        </TransitionView>
        <DropdownButton className='button' title='Status' onSelect={this.selectStatus} >
          <MenuItem eventKey='OFFER'>Offer</MenuItem>
          <MenuItem eventKey='INTERVIEW'>Interview</MenuItem>
          <MenuItem eventKey='APPLIED'>Applied</MenuItem>
          <MenuItem eventKey='INTERESTED'>Interested</MenuItem>
        </DropdownButton>
        <input
          className='form-control'
          type='number'
          ref={goal => { this.goal = goal }}
          placeholder={'Number of applications to fill out'}
        />
        <button className='button' type='submit'>
          Submit
        </button>
        <button className='button' onClick={this.cancelForm}>
          Cancel
        </button>
      </form>
    );
  }
});

const mapStateToProps = (state) => {
  return {
    startDate: state.datePicker.startDate,
    currentDate: state.datePicker.currentDate,
    goalType: state.dashboard.goalType
  };
};

const mapActionsToProps = {
  changeDate: changeDate,
  selectGoalType: selectGoalType
};

export default connect(mapStateToProps, mapActionsToProps)(GoalForm);
