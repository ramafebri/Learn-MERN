import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class CreateExercise extends Component {
  constructor(props) {
    super(props);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangePhoto = this.onChangePhoto.bind(this);
    this.onChangeNim = this.onChangeNim.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      name: '',
      photo: [],
      photoName: '',
      nim: 0,
      date: new Date(),
    }
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    })
  }

  onChangePhoto(e) {
    this.setState({
        photo: e.target.files[0]
    })
  }

  onChangeNim(e) {
    this.setState({
      nim: e.target.value
    })
  }

  onChangeDate(date) {
    this.setState({
      date: date
    })
  }

  async onSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('photo',this.state.photo);

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    //upload foto
    axios.post("http://localhost:9000/exercise/file",formData,config)
        .then((response) => {
            console.log(response);
            this.setState({
               photoName: response.data.originalname
           })

           const exercise = {
            nim: this.state.nim,
            name: this.state.name,
            date: this.state.date,
            photo: this.state.photoName,
          }
          //upload ke mongodb
          axios.post('http://localhost:9000/exercise/add', exercise)
            .then((res) => {
                console.log(res.data)
                alert('Student added!')
                window.location = '/';
            }).catch((error) => {
                console.log(error)
                alert('Upload data failed')
            });    

        }).catch((error) => {
            console.log(error)
            alert('Upload photo failed')
    });
  }

  render() {
    return (
    <div>
      <h3>Create New Student Data</h3>
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label>NIM </label>
          <input
              required 
              type="number" 
              className="form-control"
              value={this.state.Nim}
              onChange={this.onChangeNim}
              />
        </div>
        <div className="form-group"> 
          <label>Name: </label>
          <input
              required 
              type="text" 
              className="form-control"
              value={this.state.name}
              onChange={this.onChangeName}
          />
        </div>
        <div className="form-group">
          <label>Date of birth: </label>
          <div>
            <DatePicker
              selected={this.state.date}
              onChange={this.onChangeDate}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              required
            />
          </div>
        </div>
        <div className="form-group"> 
          <label>Photo: </label>
          <input  type="file"
              required
              name="photo"
              className="form-control"
              onChange={this.onChangePhoto}
              />
        </div>
        <div className="form-group">
          <input type="submit" value="Submit" className="btn btn-primary" />
        </div>
      </form>
    </div>
    )
  }
}