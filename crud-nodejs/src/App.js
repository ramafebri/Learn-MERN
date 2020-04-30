import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./ui/navbar"
import ExercisesList from "./ui/list-excercise";
import EditExercise from "./ui/edit-exercise";
import CreateExercise from "./ui/create-exercise";
import SearchExercise from "./ui/search-exercise";

function App() {
  return (
    <Router>
      <div className="container">
      <Navbar />
      <br/>
      <Route path="/" exact component={ExercisesList} />
      <Route path="/edit/:id" component={EditExercise} />
      <Route path="/create" component={CreateExercise} />
      <Route path="/search/:name" component={SearchExercise} />
      </div>
    </Router>
  );
}

export default App;