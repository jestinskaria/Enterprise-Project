var axios = require('axios');

function tryData(){

console.log("enter function")
axios({
  method: 'post',
  url: 'http://localhost:5000/user',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
})
.then(function (res) {
  console.log(res.data);
})
.catch(function (err) {
  console.log(err);
});

}