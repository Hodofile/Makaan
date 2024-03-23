const putMethod = {
    method: 'PUT', 
    headers: {
     'Content-type': 'application/json; charset=UTF-8' 
    },
    body: JSON.stringify(someData) 
   }

   function deleteRecord(url){
   // make the HTTP put request using fetch api
   fetch(url, putMethod)
   .then(response => response.json())
   .then(data => console.log(data)) 
   .catch(err => console.log(err))
   }

   module.exports=deleteRecord