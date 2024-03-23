const express = require("express")
const app = express()
const mongoose = require("mongoose");
//const apiFn = require("./apifunctions")
const bodyParser = require('body-parser');
const path = require('path');
var multer = require('multer');
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
    "mongodb://localhost:27017/makaan"
  );
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error"))
  db.once("open", ()=>console.log("connected to makaan db"))

app.use(express.static('public')) //built in middleware
app.use('/images',express.static('uploads'))

// app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.set("views", "./view");

const propertyModels = require("./models/property")
const agentModel = require("./models/agent")
const categoryModel= require("./models/category")
const propertyTypeModel= require("./models/propertyType")
const testimonialModel= require("./models/testimonial")

app.get("/", (req, res)=>{
    res.render("home")
   
})

app.get("/add_property", async(req, res)=>{
    var category, ptype,testimon;
    await categoryModel.find().then((cat)=>
        {
            category=cat
        })
        await propertyTypeModel.find().then((pt)=>
        {
            ptype=pt 
        })
        await testimonialModel.find().then((test)=>{
            testimon=test
        })
    //console.log(category)
    agentModel.find().sort({_id:-1}).then((data)=>{
        //console.log(data)
        res.render("add_properties", {success:
            {msg:req.query.q,
            cdata:category, 
            tdata:testimon,
            ptData: ptype,  
            adata:data}})
    })
    
   
})

app.get("/show_properties", (req, res)=>{
    propertyModels.find().sort({_id:-1}).then((data)=>{
        console.log(data)
        res.render("show_properties",{propdata:{sdata:data,msg:req.query.success}})
    })
    .catch(err=>console.log(err))
    })


app.get("/single/:id",(req, res)=>{
     propertyModels.find({_id:req.params.id}).then((data)=>{
        res.render("single", {sdata:data})
})

  .catch(err=>console.log(err))
    
 })

 //image upload for property


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+".jpg")
    }
});
 
var uploadProp = multer({ storage: storage });

 app.get("/update/:id", (req,res)=>{
    propertyModels.find({_id:req.params.id}).then((data)=>{
        res.render("updateProperties", {sdata:data})
    })
    .catch(err=>console.log(err))
 })

 app.post("/updateProperty/:sid",uploadProp.single('image'), (req,res,next)=>{
    let prDetail = req.body
    let finalPropertyDetail;
    if(!req.file){
         finalPropertyDetail = {...prDetail, image:req.body.pimg}
    }else{
         finalPropertyDetail = {...prDetail, image:req.file.filename}
    }
    console.log(finalPropertyDetail);
    
    propertyModels.findByIdAndUpdate({_id:req.params.sid},finalPropertyDetail).then((data)=>{
        res.redirect("/show_properties?success=update")
 })
})

 app.delete("/delete/:id", (req, res)=>{
  propertyModels.findByIdAndDelete({_id:req.params.id}).then((data)=>{

})

// req.method = 'GET'
// window.location.href="/show_properties"
res.redirect(303, "/show_properties")

   

})




app.post("/addProperty", uploadProp.single('image'),(req,res,next)=>{
    let prDetail=req.body
    let finalPropertyDetail ={...prDetail,image:req.file.filename}
    let savP = new propertyModels(finalPropertyDetail)
     savP.save()
   // res.send("student created!")
    res.redirect("/add_property?q=success", )
})

//image upload setting

app.get("/add_agent", (req, res)=>{
    res.render("add_agent")
   
})

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+".jpg")
    }
});
 
var upload = multer({ storage: storage });
 
app.post('/addAgent', upload.single('img'), (req, res, next) => {
    let agDetail = req.body
    let finalDetail = {...agDetail, img:req.file.filename}

    let savA = new agentModel(finalDetail)
    savA.save()
   // res.send("agent created!")
    res.redirect("/add_agent?q=success")
  //  console.log(req.body)
})

app.get("/show_agents", (req, res)=>{
    agentModel.find().sort({_id:-1}).then((data)=>{
        console.log(data)
        res.render("show_agents",{agentdata:{sdata:data,msg:req.query.success}})
    })
    .catch(err=>console.log(err))
    })

app.get("/AgentS/:id", async(req, res)=>{
    var agentProperty;
    await propertyModels.find({agent:req.params.id}).then((ap)=>
        {
            agentProperty=ap
        })
        console.log(agentProperty)
    agentModel.find({_id:req.params.id}).then((data)=>{
  res.render("AgentS", {sdata:{ad:data, ap:agentProperty}})
 })
     .catch(err=>console.log(err))
    
 })

 app.delete("/ag_delete/:id", (req, res)=>{
    //   alert("hiiii")
       agentModel.findByIdAndDelete({_id:req.params.id}).then(data=>console.log(data))
     
   //   req.method = 'GET'
   //   window.location.href="/show_categories"
   res.redirect(303, "/show_agents")
     })


     app.get("/updateA/:id", (req,res)=>{
        agentModel.find({_id:req.params.id}).then((data)=>{
            res.render("updateAgent", {sdata:data})
        })
        .catch(err=>console.log(err))
     })

     app.post("/updateAgent/:sid", upload.single('img'), (req,res,next)=>{
        let agDetail = req.body
        let finalDetail;
        if(!req.file){
             finalDetail = {...agDetail, img:req.body.aimg}
        }
        else{
             finalDetail = {...agDetail, img:req.file.filename}
        }
        console.log(finalDetail);
       
        agentModel.findByIdAndUpdate({_id:req.params.sid},finalDetail).then((data)=>{
            res.redirect("/show_agents?success=update")
     })
    })

 //category

 app.get("/add_category", (req, res)=>{
    res.render("add_category")
   
})

 

 app.post("/addCategory", (req, res)=>{
   let savC = new categoryModel(req.body)
   savC.save()
   res.redirect("/add_category?q=success",)
    })
   
   


app.get("/show_categories", (req, res)=>{
    categoryModel.find().sort({_id:-1}).then((data)=>{
        console.log(data)
        res.render("show_categories",{fdata:{sdata:data,msg:req.query.success}})
    })
    .catch(err=>console.log(err))
    })


    app.get("/CategoryS/:id", (req, res)=>{
        categoryModel.find({_id:req.params.id}).then((data)=>{
      res.render("CategoryS", {sdata:data})
     })
         .catch(err=>console.log(err))
        
     })

     app.get("/updateC/:id", (req,res)=>{
        categoryModel.find({_id:req.params.id}).then((data)=>{
            res.render("updateCategory", {sdata:data})
        })
        .catch(err=>console.log(err))
     })

     app.post("/updateCategory/:sid", (req,res)=>{
        categoryModel.findByIdAndUpdate({_id:req.params.sid},{cname:req.body.cname}).then((data)=>{
            res.redirect("/show_categories?success=update")
     })
    })

    app.delete("/cat_delete/:id", (req, res)=>{
     //   alert("hiiii")
        categoryModel.findByIdAndDelete({_id:req.params.id}).then(data=>console.log(data))
      
    //   req.method = 'GET'
    //   window.location.href="/show_categories"
    res.redirect(303, "/show_categories")
      })
      

     //propertyType

     app.get("/add_property_type", (req, res)=>{
        res.render("add_property_type")
       
    })

  

    app.post("/addPropertyType", (req, res)=>{
       // console.log(req.body)
        let savPt = new propertyTypeModel(req.body)
        savPt.save()
        res.redirect("/add_property_type?q=success",)
         })

app.get("/show_property_type", (req, res)=>{
            propertyTypeModel.find().sort({_id:-1}).then((data)=>{
                console.log(data)
                res.render("show_property_type",{pdata:{sdata:data,msg:req.query.success}})
            })
            .catch(err=>console.log(err))
            })
        
            app.get("/PropertyS/:id", (req, res)=>{
               propertyTypeModel.find({_id:req.params.id}).then((data)=>{
              res.render("PropertyS", {sdata:data})
             })
                 .catch(err=>console.log(err))
                
             })

             app.get("/updateP/:id", (req,res)=>{
                propertyTypeModel.find({_id:req.params.id}).then((data)=>{
                    res.render("updatePropertyType", {sdata:data})
                })
                .catch(err=>console.log(err))
             })
        
             app.post("/updatePropertyType/:sid", (req,res)=>{
                propertyTypeModel.findByIdAndUpdate({_id:req.params.sid},{ptname:req.body.ptname}).then((data)=>{
            res.redirect("show_property_type?success=update")
             })
            })

            app.delete("/delete_property_type/:id", (req, res)=>{
                //console.log("deleted")
                propertyTypeModel.findByIdAndDelete({_id:req.params.id}).then(data=>console.log(data))


              
           // req.method = 'GET'
            //window.location.href="/show_property_type"
              res.redirect(303, "/show_property_type")
               })


               //testimonial
               
    app.get("/add_testimonial", (req, res)=>{
        res.render("add_testimonial")
       
    })

    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now()+".jpg")
        }
    });
    var uploadTest = multer({storage:storage});

    app.post("/addTestimonial", uploadTest.single('clientimage'),(req, res,next)=>{
        let testDetail=req.body
        let finalTestimonialDetail={...testDetail,clientimage:req.file.filename}
         let savTest = new testimonialModel(finalTestimonialDetail)
         savTest.save()
         res.redirect("/add_testimonial?q=success");
          })

          app.get("/show_testimonial", (req, res)=>{
            testimonialModel.find().sort({_id:-1}).then((data)=>{
                console.log(data)
                res.render("show_testimonial",{testidata:{sdata:data,msg:req.query.success}})
            })
            .catch(err=>console.log(err))
            })

         

            app.get("/TestimonialS/:id", (req, res)=>{
                testimonialModel.find({_id:req.params.id}).then((data)=>{
               res.render("TestimonialS", {sdata:data})
              })
                  .catch(err=>console.log(err))
                 
              })


              app.delete("/deleteTest/:id", (req, res)=>{
                //console.log("deleted")
                testimonialModel.findByIdAndDelete({_id:req.params.id}).then(data=>console.log(data))


              
           // req.method = 'GET'
            //window.location.href="/show_property_type"
              res.redirect(303, "/show_testimonial")
               })

               app.get("/updateTest/:id", (req,res)=>{
                testimonialModel.find({_id:req.params.id}).then((data)=>{
                    res.render("updateTestimonial", {sdata:data})
                })
                .catch(err=>console.log(err))
             })
        
             app.post("/updateTesti/:sid", uploadTest.single('clientimage'), (req,res,next)=>{
                let testDetail = req.body
                let finalTestimonialDetail;
                if(!req.file){
                    finalTestimonialDetail = {...testDetail, clientimage:req.body.cimg}
                }
                else{
                    finalTestimonialDetail = {...testDetail, clientimage:req.file.filename}
                }
                console.log(finalTestimonialDetail)
                testimonialModel.findByIdAndUpdate({_id:req.params.sid},finalTestimonialDetail).then((data)=>{
            res.redirect("/show_testimonial?success=update")
             })
            })
             

            
           

        
        

app.listen(5555, ()=>console.log("server running fine"))