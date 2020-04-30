import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class EditExercise extends Component {
  constructor(props) {
    super(props);

    this.onChangename = this.onChangename.bind(this);
    this.onChangephoto = this.onChangephoto.bind(this);
    this.onChangenim = this.onChangenim.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
        name: '',
        photo: null,
        photoName: '',
        nim: 0,
        date: new Date(),
    }
  }

  componentDidMount() {
    axios.get('http://localhost:9000/exercise/'+this.props.match.params.id)
      .then(response => {
        this.setState({
          name: response.data.name,
          photoName: response.data.photo,
          nim: response.data.nim,
          date: new Date(response.data.date)
        })   
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  onChangename(e) {
    this.setState({
      name: e.target.value
    })
  }

  onChangephoto(e) {
    this.setState({
      photo: e.target.files[0]
    })
  }

  onChangenim(e) {
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

    if(this.state.photo){
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
                
               const exercise = {
                nim: this.state.nim,
                name: this.state.name,
                date: this.state.date,
                photo: response.data.originalname,
               }
          
              axios.post('http://localhost:9000/exercise/update/' + this.props.match.params.id, exercise)
                .then((res) => {
                    console.log(res.data)
                    alert('Student updated!')
                    window.location = '/';
                }).catch((error) => {
                    console.log(error)
                    alert('Update data failed')
                });       
            })
            .catch((error) => {
                console.log(error)
                alert('Upload photo failed')
        });   
    }
    else{
        const exercise = {
            nim: this.state.nim,
            name: this.state.name,
            date: this.state.date,
            photo: this.state.photoName,
        }
      
        axios.post('http://localhost:9000/exercise/update/' + this.props.match.params.id, exercise)
            .then((res) => {
                console.log(res.data)
                alert('Student updated!')
                window.location = '/';
            }).catch((error) => {
                console.log(error)
                alert('Update data failed')
            }); 
    }
  }

  render() {
    return (
    <div>
      <h3>Edit Exercise Log</h3>
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label>NIM: </label>
          <input
              required 
              type="text" 
              className="form-control"
              value={this.state.nim}
              onChange={this.onChangenim}
          />
        </div>
        <div className="form-group"> 
          <label>Name: </label>
          <input
              required 
              type="text" 
              className="form-control"
              value={this.state.name}
              onChange={this.onChangename}
          />
        </div>
        <div className="form-group">
          <label>Date: </label>
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
              className="form-control"
              name="photo"
              onChange={this.onChangephoto}
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Edit" className="btn btn-primary" />
        </div>
      </form>
    </div>
    )
  }
}