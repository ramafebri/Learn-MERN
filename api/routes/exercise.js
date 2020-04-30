const router = require('express').Router();
let Exercise = require('../models/exercise.model');
var multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, '../crud-nodejs/src/image')
  },
  filename: (req, file, callBack) => {
      callBack(null, file.originalname)
  }
})

const upload = multer({ 
  storage: storage,
  limits:{fileSize: 1000000},
})

router.route('/').get((req, res) => {
  Exercise.find()
    .then(exercises => res.json(exercises))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const nim = Number(req.body.nim);
  const name = req.body.name;
  const date = Date.parse(req.body.date);
  const photo = req.body.photo;
  
  const newExercise = new Exercise({
    nim,
    name,
    date,
    photo,
  });

  newExercise.save()
  .then(() => res.json('Student added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/file', upload.single('photo'), (req, res, next) => {
    const file = req.file;
    console.log(file.filename);
  
    if (!file) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send(file);
});

router.route('/:id').get((req, res) => {
  Exercise.findById(req.params.id)
    .then(exercise => res.json(exercise))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Exercise.findByIdAndDelete(req.params.id)
    .then(() => res.json('Student deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    console.log(req.body.photo)
  Exercise.findById(req.params.id)
    .then(exercise => {
      exercise.nim = Number(req.body.nim);
      exercise.name = req.body.name;
      exercise.date = Date.parse(req.body.date);
      exercise.photo = req.body.photo;
      
      exercise.save()
        .then(() => res.json('Student updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/search').post((req, res) => {
    var regex = new RegExp(".*"+ req.body.name +".*", 'i')
    Exercise.find({name:regex})
    .then(exercise => res.json(exercise))
    .catch(err => res.status(400).json('Error: ' + err));
});  

module.exports = router;