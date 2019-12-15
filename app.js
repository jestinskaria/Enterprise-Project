const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;
const pug = require('pug');
app.use(cors());
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const MongoClient = require('mongodb').MongoClient;



// CONNECTING MONGO DB
const uri = "mongodb+srv://jestin:root@infantcare-tzbj0.mongodb.net/InfantDatabase?retryWrites=true&w=majority"
MongoClient.connect(uri,{ useUnifiedTopology: true }, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected...');
   const collection = client.db("InfantDatabase").collection("InfantVaccinationDetails");
   var mydatabase = client.db('InfantDatabase');
  






// ADDING and EDITING INFANT DETAILS TO DB

app.post('/addEditInfantData', (req, res) => {

   const infData = req.body;
   var infantEditArray = [];
   var parentEditArray = [];
   var currentDateValue = CurrentDateTime();

   if(infData["InfantHospitalId"]==""){
    var InfantId = InfantHospitalIdGenerator();
    console.log(InfantId);
    console.log(currentDateValue);
    
    var InfantInsertData = [{InfantHospitalId:InfantId,InfantFName:infData["InfantFirstName"],InfantLName:infData["InfantLastName"],
                           Gender:infData["Gender"],BirthDateTime:infData["BirthDateTime"],Address:infData["Address"],
                           ZIP:infData["ZIP"],UpdatedDate:currentDateValue}];

    var ParentInsertData = [{InfantHospitalId:InfantId,FatherFName:infData["FatherFName"],FatherLName:infData["FatherLName"],
                            MotherFName:infData["MotherFName"],MotherLName:infData["MotherLName"],
                            Address:infData["Address"],ZIP:infData["ZIP"],CreatedDate:currentDateValue,UpdatedDate:currentDateValue}];
    
                            mydatabase.collection("NewBornInfantsDetails").insertMany(InfantInsertData, function(err, res) {
                                  if (err) throw err;
                                  console.log("Number of documents inserted: " + res.insertedCount);
                                
                                });     
                                
                                mydatabase.collection("NewBornInfantsParentsDetails").insertMany(ParentInsertData, function(err, res) {
                                 if (err) throw err;
                                 console.log("Number of documents inserted: " + res.insertedCount);
                                 
                               });  
                               
                              //  client.db.close();
                                client.close();
   }else{

      // UPDATING INFANT DETAILS

      var myquery = { InfantHospitalId: infData["InfantHospitalId"] };
      if(infData["InfantFirstName"]!=""){
         infantEditArray.push({InfantFName:infData["InfantFirstName"]}) 
      }
      if(infData["InfantLastName"]!=""){
         infantEditArray.push({InfantLName:infData["InfantLastName"]}) 
      }
      if(infData["Gender"]!=""){
         infantEditArray.push({Gender:infData["Gender"]}) 
      }
      if(infData["BirthDateTime"]!=""){
         infantEditArray.push({BirthDateTime:infData["BirthDateTime"]}) 
      }
      if(infData["Address"]!=""){
         infantEditArray.push({Address:infData["Address"]}) 
      }
      if(infData["ZIP"]!=""){
         infantEditArray.push({ZIP:infData["ZIP"]}) 
      }

    for(var i=0;i<infantEditArray.length;i++){
   
      var infantNewvalues = { $set: infantEditArray[i] };
      mydatabase.collection("NewBornInfantsDetails").updateOne(myquery, infantNewvalues, function(err, res) {
           if (err) throw err;
      
           console.log("1st document updated");
               
         });  
      }  
         // UPDATING DATE
         if(i>0){

            mydatabase.collection("NewBornInfantsDetails").updateOne(myquery, { $set:{UpdatedDate:currentDateValue}}, function(err, res) {
               if (err) throw err;
          
               console.log("1st document updated");
                   
             });  
         }
         console.log(i+"fields updated");
           
      console.log(infantEditArray.length);
   




    // UPDATING PARENT DETAILS

    var myquery = { InfantHospitalId: infData["InfantHospitalId"] };
    
    if(infData["FatherFName"]!=""){
      parentEditArray.push({FatherFName:infData["FatherFName"]}) 
    }
    if(infData["FatherLName"]!=""){
      parentEditArray.push({FatherLName:infData["FatherLName"]}) 
    }
    if(infData["MotherFName"]!=""){
      parentEditArray.push({MotherFName:infData["MotherFName"]}) 
    }
    if(infData["MotherLName"]!=""){
      parentEditArray.push({MotherLName:infData["MotherLName"]}) 
    }
    if(infData["Address"]!=""){
      parentEditArray.push({Address:infData["Address"]}) 
    }
    if(infData["ZIP"]!=""){
      parentEditArray.push({ZIP:infData["ZIP"]}) 
    }

  for(var j=0;j<parentEditArray.length;j++){
 
    var infantNewvalues = { $set: parentEditArray[j] };
    mydatabase.collection("NewBornInfantsParentsDetails").updateOne(myquery, infantNewvalues, function(err, res) {
         if (err) throw err;
    
        
             
       });  
    }  
       // UPDATING DATE
       if(j>0){

          mydatabase.collection("NewBornInfantsParentsDetails").updateOne(myquery, { $set:{UpdatedDate:currentDateValue}}, function(err, res) {
             if (err) throw err;
        
             console.log("1st document updated");
                 
           });  
       }
       console.log(i+"fields updated");
         client.close();
   
    console.log(infantEditArray.length);
 }

   

   res.writeHead(301,{Location: 'http://localhost/FinalProject/try.html'});
   res.end();
});




//  FETCHING INFANT DETAILS



 //   <td>${result[l].["InfantFName"]}</td>
      //   <td>${result[l].["InfantLName"]}</td>
app.post('/getInfantData', (req, res) => {

   const reportData = req.body;
    console.log(reportData);
   var infData = [];
    mydatabase.collection("NewBornInfantsDetails").find({ InfantFName:reportData["InfantFirstName"]}).toArray (function(err, result) {
      if (err) throw err;
      
      infData = result
      console.log(infData);
      client.close();
    

    const x = ` <table id="infantReport" style="width:100%">
      <caption>Infant Data</caption>
      <tr>
        <th>Infant Hospital Id</th>
        <th>Infant Fist Name</th>
        <th>Infant Last Name</th>
      </tr>`
    for (var l=0 ;l<infData.length;l++) {
     const y =`
      <tr>
        <td>${infData[l]}</td>
     
      </tr>
      
    </table>`

    document.getElementById('infantReport').innerHTML = document.getElementById('infantReport').innerHTML + x + y;
    }
   });
   res.writeHead(301,{Location: 'http://localhost/FinalProject/get.html'});
   res.end();
});


     
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

});



// COMMON FUNCTIONS

function InfantHospitalIdGenerator(){
   var InfantHospitalId = 'INF'+Math.floor(Math.random() * 10000000) + 1;
   return InfantHospitalId;

}

function CurrentDateTime(){
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;
                return dateTime;
}
