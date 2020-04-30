import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Exercise = props => (
  <tr>
    <td>{props.exercise.nim}</td>
    <td>{props.exercise.name}</td>
    <td>{props.exercise.date.substring(0,10)}</td>
    <td> <img src={require('../image/'+props.exercise.photo)} alt="Photo" width="150px" height="130px"/></td>
    <td>
      <Link to={"/edit/"+props.exercise._id}>edit</Link> | <a href="#" onClick={() => { props.deleteExercise(props.exercise._id) }}>delete</a>
    </td>
  </tr>
)

export default class ExercisesList extends Component {
  constructor(props) {
    super(props);

    this.deleteExercise = this.deleteExercise.bind(this);

    this.state = {
        exercises: [],
        name:''
    };
  }

  componentDidMount() {
    const exercise = {
        name: this.props.match.params.name,
    }

    axios.post('http://localhost:9000/exercise/search', exercise)
      .then(response => {
        this.setState({ exercises: response.data })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  deleteExercise(id) {
    axios.delete('http://localhost:9000/exercise/'+id)
      .then(response => { console.log(response.data)});

    this.setState({
      exercises: this.state.exercises.filter(el => el._id !== id)
    })
  }

  exerciseList() {
    return this.state.exercises.map(currentexercise => {
      return <Exercise exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id}/>;
    })
  }

  render() {
    return (
      <div>
        <h3>Student Data</h3>
          <h3>search {this.props.match.params.name}</h3>  
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>NIM</th>
              <th>Name</th>
              <th>Date of birth</th>
              <th>Photo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            { this.exerciseList() }
          </tbody>
        </table>
      </div>
    )
  }
}