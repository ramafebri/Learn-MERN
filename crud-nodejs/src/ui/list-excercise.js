import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

library.add(faSearch);

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

    this.deleteExercise = this.deleteExercise.bind(this)
    this.onChangename = this.onChangename.bind(this);

    this.state = {
      exercises: [],
      name:''
    };
  }

  componentDidMount() {
    axios.get('http://localhost:9000/exercise/')
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

  onChangename(e) {
    this.setState({
      name: e.target.value
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
          <div style={{flexDirection: 'row', marginBottom:20}}>
            <input 
                type="text" 
                value={this.state.name}
                onChange={this.onChangename}
                style={{width:200}}
                placeholder='search name'
            />
            <Link to={"/search/"+this.state.name}><button style={{color:'#328ea8', marginLeft:10}}><FontAwesomeIcon icon="search"/></button></Link>
          </div>  
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