const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors")
const studentM= require("./models/student")
const propertyModel = require("./models/property")
const categoryModel = require("./models/category")
const agentModel = require("./models/agent")
const testimonialModel= require("./models/testimonial")
const propertyTypeModel = require("./models/propertyType")
const registerModel= require("./models/register")
const agentDataModel= require("./models/agentDataModel")
//react
const reactRegistrationModel=require("./models/reactReagistration")
// const loginModel = require("./models/login")
//const apiFn = require("./apifunctions")
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session')
var nodemailer = require('nodemailer');

var multer = require('multer');




const app = express()

// support parsing of application/json type post data
app.use(bodyParser.json());

app.use(cors())
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({secret: "iambest"}));

app.use(express.static('public')) //built in middleware

mongoose.connect(
    "mongodb://localhost:27017/makaan"
  );

  app.use(express.json());

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error"))
  db.once("open", ()=>console.log("connected to makaan db"))




app.set('view engine', 'ejs');
app.set("views", "./view");
// app.use('/images',express.static('uploads'))

// let userObject ={
//     username: "techedo",
//     password: "admin"
// }

var auth = function(req,res,next){
    if(req.session && req.session.user === userObject.username)
    return next();
else 
return res.redirect("/login")
};

//locals
app.use((req,res,next)=>{
    res.locals.userid = req.session.userid
     res.locals.queryString = req.query
    res.locals.temp_fp=req.session.tempEmail
    res.locals.otp = req.session.otp
    res.locals.tempUID=req.session.tempUserId
    next();
})


const transporter = nodemailer.createTransport({
    port: 465, // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
    user: 'vanshika.node.makaan@gmail.com',
    pass: 'bozb pmqk nxki zlrb',
     },
    secure: true,
     });
    


app.get('/login', async function(req,res){
    let cdata = await get_category_type();
    let ptdata = await get_property_type();
   // console.log(cdata)
    res.render("login",{p_cat:cdata,
        p_type:ptdata,
        page_url:req.url, });
   // console.log(req.session)
});

app.post("/logIn",(req,res)=>{
    const email = req.body.email
    const pass = req.body.pass
    let usermail = registerModel.findOne({email:email,pass:pass})
    .then((data)=>{
        usermail=data
        if(usermail !==null){
            req.session.userid = data._id
            res.redirect("/myaccount")
        }else{
            res.redirect("/login?msg=failed")
        }
    })
    .catch((err)=>{
        console.log(err)
    })
})
//  app.get("/loginCheck",function(req,res){
//     console.log(req.query, req.session.user)
// if (!req.query.uname || !req.query.psw){
//     res.send('login failed')
// }
// else if(req.query.uname === userObject.username || req.query.psw === userObject.password){
//     req.session.user =req.query.uname;
//     req.session.password = req.query.psw;
//     // res.send("login successfull!!")
//     res.redirect("/content")
// }
// else{
//     res.send("wrong credential")
//  }
//  })

app.get("/content", auth, function(req,res){
    res.render("account");

});


//LogOut endpoint
app.get("/logout", function (req,res){
    req.session.destroy();
    res.redirect("/login")
});


//image upload
// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now()+".jpg")
//     }
// });

// var uploadImg = multer({ storage: storage });


//signup
app.get('/signup', async function(req,res){
    let cdata = await get_category_type();
    let ptdata = await get_property_type();
   // console.log(cdata)
    res.render("signup",{p_cat:cdata,
        p_type:ptdata,
        page_url:req.url, });
   // console.log(req.session)
});

app.post("/SignUp", (req, res)=>{
    // let signDetail= req.body
    // let finalSignDetail ={...signDetail,image:req.file.filename}
    res.locals.userid = req.session.userid
    let savC = new registerModel(req.body)
    savC.save()
    .then((data)=>{
        console.log("User sign-in successfully......",{data})
        req.session.userid = data._id

        const mailData = {
            from: 'vanshika.node.makaan@gmail.com',
            to:req.body.email,
            subject: 'Registration successfully at Makaan!',
            text: 'That was easy!',
            html: `<body style="font-family: Helvetica, sans-serif; -webkit-fontsmoothing: antialiased; font-size: 16px; line-height: 1.3; -ms-text-size-adjust:
            100%; -webkit-text-size-adjust: 100%; background-color: #f4f5f6; margin: 0; padding:0;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0"
            class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-tablerspace: 0pt; background-color: #f4f5f6; width: 100%;" width="100%"
            bgcolor="#f4f5f6"> <tr><td style="font-family: Helvetica, sans-serif; font-size:
            16px; vertical-align: top;" valign="top">&nbsp;</td>
            <td class="container" style="font-family: Helvetica, sans-serif; fontsize: 16px; vertical-align: top; max-width: 600px; padding: 0; padding-top: 24px;
            width: 600px; margin: 0 auto;" width="600" valign="top">
            <div class="content" style="box-sizing: border-box; display: block;
            margin: 0 auto; max-width: 600px; padding: 0;">
            <span class="preheader" style="color: transparent; display: none;
            height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all;
            visibility: hidden; width: 0;">This is preheader text. Some clients will show this
            text as a preview.</span>
            <table role="presentation" border="0" cellpadding="0"
            cellspacing="0" class="main" style="border-collapse: separate; mso-table-lspace:
            0pt; mso-table-rspace: 0pt; background: #ffffff; border: 1px solid #eaebed; borderradius: 16px; width: 100%;" width="100%">
            <tr>
            <td class="wrapper" style="font-family: Helvetica, sans-serif;
            font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 24px;"
            valign="top">
            <p style="font-family: Helvetica, sans-serif; font-size: 16px;
            font-weight: normal; margin: 0; margin-bottom: 16px;">Hi ${req.body.username}
            </p>
            <p style="font-family: Helvetica, sans-serif; font-size: 16px;
            font-weight: normal; margin: 0; margin-bottom: 16px;">Sometimes you just want to
            send a simple HTML email with a simple design and clear call to action. This is it.
            </p>
            <table role="presentation" border="0" cellpadding="0"
            cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-tablelspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%; min-width:
            100%;" width="100%">
            <tbody>
            <tr>
            <td align="left" style="font-family: Helvetica, sansserif; font-size: 16px; vertical-align: top; padding-bottom: 16px;" valign="top">
            <table role="presentation" border="0" cellpadding="0"
            cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-tablerspace: 0pt; width: auto;">
            <tbody>
            <tr>
            <td style="font-family: Helvetica, sans-serif;
            font-size: 16px; vertical-align: top; border-radius: 4px; text-align: center;
            background-color: #0867ec;" valign="top" align="center" bgcolor="#0867ec"> <a
            href="http://htmlemail.io" target="_blank" style="border: solid 2px #0867ec; borderradius: 4px; box-sizing: border-box; cursor: pointer; display: inline-block; fontsize: 16px; font-weight: bold; margin: 0; padding: 12px 24px; text-decoration: none;
            text-transform: capitalize; background-color: #0867ec; border-color: #0867ec; color:
            #ffffff;">Call To Action</a> </td>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
<p style="font-family: Helvetica, sans-serif; font-size: 16px;
font-weight: normal; margin: 0; margin-bottom: 16px;">This is a really simple email
template. It's sole purpose is to get the recipient to click the button with no
distractions.</p>
<p style="font-family: Helvetica, sans-serif; font-size: 16px;
font-weight: normal; margin: 0; margin-bottom: 16px;">Good luck! Hope it works.</p>
</td>
</tr>
</table>
<div class="footer" style="clear: both; padding-top: 24px; textalign: center; width: 100%;">
<table role="presentation" border="0" cellpadding="0"
cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-tablerspace: 0pt; width: 100%;" width="100%">
<tr>
<td class="content-block" style="font-family: Helvetica, sansserif; vertical-align: top; color: #9a9ea6; font-size: 16px; text-align: center;"
valign="top" align="center">
<span class="apple-link" style="color: #9a9ea6; font-size:
16px; text-align: center;">Company Inc, 7-11 Commercial Ct, Belfast BT1 2NB</span>
<br> Don't like these emails? <a
href="http://htmlemail.io/blog" style="text-decoration: underline; color: #9a9ea6;
font-size: 16px; text-align: center;">Unsubscribe</a>.
</td>
</tr>
<tr>
<td class="content-block powered-by" style="font-family:
Helvetica, sans-serif; vertical-align: top; color: #9a9ea6; font-size: 16px; textalign: center;" valign="top" align="center">
Powered by <a href="http://htmlemail.io" style="color:
#9a9ea6; font-size: 16px; text-align: center; text-decoration:
none;">HTMLemail.io</a>
</td>
</tr>
</table>
</div>
</div>
</td>
<td style="font-family: Helvetica, sans-serif; font-size: 16px;
vertical-align: top;" valign="top">&nbsp;</td>
</tr>
</table>
</body>`,
            
        };
        transporter.sendMail(mailData, (error,info)=>{
            if(error){
                return console.log(error)
            }
        })
        res.redirect("/myaccount?msg=success",)
    })
    .catch((err)=>{
        console.log("Something wrong in user sign-in",{err})
    })
     })

     //myaccount
     app.get('/myaccount', async function(req,res){
        // let agentData;
        // let udata;
        let cdata = await get_category_type();
    let ptdata = await get_property_type();
    //    agentData= await agentDataModel.findOne({_id:req.session.userid})
       registerModel.findOne({_id:req.session.userid})
        .then((d)=>{
            // if(d==null){
            //     udata = agentData;
            // }
            // else{
            //     udata = d;
            // }
            console.log(d)
            res.render("myaccount",{userdata:d, p_cat:cdata,
                p_type:ptdata,
                page_url:req.url,
           })
        })
    //     let cdata = await get_category_type();
    //     let ptdata = await get_property_type();
    //    // console.log(cdata)
    //     res.render("myaccount",{p_cat:cdata,
    //         p_type:ptdata,
    //         page_url:req.url, });
    //    // console.log(req.session)
    });


// let x = [
//     {
//         id:1,
//         title:"The Last Stand",
//         cat:"Action",
//         img: "movie1.jpg",
//         price:" 200",
//         desc:" a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
//     },
//     {
//         id:2,
//         title:"SpiderMan-2",
//         cat:"Action",
//         img: "movie2.jpg",
//         price:" 250",
//         desc:" a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
//     },
//     {
//         id:3,
//         title:"SpiderMan-3",
//         cat:"Action",
//         img: "movie3.jpg",
//         price:" 300",
//         desc:" a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
//     },
//     {
//         id:4,
//         title:"Valkyrie",
//         cat:"Action",
//         img: "movie4.jpg",
//         price:" 350",
//         desc:" a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
//     },
//     {
//         id:5,
//         title:"Gladiator",
//         cat:"Horror",
//         img: "movie5.jpg",
//         price:" 400",
//         desc:"Horror films may incorporate incidents of physical violence and psychological terror; they may be studies of deformed, disturbed, psychotic, or evil characters;"
//     },
//     {
//         id:6,
//         title:"Ice Age",
//         cat:"Horror",
//         img: "movie6.jpg",
//         price:" 450",
//         desc:"Horror films may incorporate incidents of physical violence and psychological terror; they may be studies of deformed, disturbed, psychotic, or evil characters;"
//     },
//     {
//         id:7,
//         title:"Transformer",
//         cat:"Horror",
//         img: "movie7.jpg",
//         price:" 500",
//         desc:"Horror films may incorporate incidents of physical violence and psychological terror; they may be studies of deformed, disturbed, psychotic, or evil characters;"
//     },
//     {
//         id:8,
//         title:"Magneto",
//         cat:"Comedy",
//         img: "movie8.jpg",
//         price:" 550",
//         desc: "A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh."
//     },
//     {
//         id:9,
//         title:"Kung Fu Panda",
//         cat:"Comedy",
//         img: "movie9.jpg",
//         price:" 600",
//         desc: "A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh."
//     },
//     {
//         id:10,
//         title:"Eagle Eye",
//         cat:"Comedy",
//         img: "movie10.jpg",
//         price:" 650",
//         desc: "A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh."
//     },
//     {
//         id:11,
//         title:"Narnia",
//         cat:"Comedy",
//         img: "movie11.jpg",
//         price:" 700",
//         desc: "A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh."
//     },
//     {
//         id:12,
//         title:"Angles & Demons",
//         cat:"Drama",
//         img: "movie12.jpg",
//         price:" 750",
//         desc:"a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
//     },
//     {
//         id:13,
//         title:"House",
//         cat:"Drama",
//         img: "movie13.jpg",
//         price:" 800",
//         desc:"a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
//     },
//     {
//         id:14,
//         title:"Vacancy",
//         cat:"Drama",
//         img: "movie14.jpg",
//         price:" 850",
//         desc:"a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
//     },
//     {
//         id:15,
//         title:"Mirrors",
//         cat:"Drama",
//         img: "movie15.jpg",
//         price:" 900",
//         desc:"a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
//     }
// ]

//get category type
async function get_category_type(){
    let cdata;
    await categoryModel.find().then(async(cn)=>{
        cdata=cn
      //  console.log(m)
      //  finalData.push(cname)
        })
   return cdata;


}

//get property type
async function get_property_type(){
    let ptData;
    await propertyTypeModel.find().then(async(cn)=>{
        ptData=cn
      //  console.log(m)
      //  finalData.push(cname)
        })
   return ptData;


}

app.get("/", async(req, res)=>{
    var cname;
    var propertyType;
    var finalData=[];
    var agents;
    var test;
    let cdata = await get_category_type();
    let ptdata = await get_property_type();

    await agentModel.find().sort({_id:-1}).then((data)=>{
        console.log(data)
       agents=data
    })

    await testimonialModel.find().sort({_id:-1}).then((data)=>{
        console.log(data)
        test=data;
    })

    await propertyModel.find().then(async (data)=>{
        for(let m of data){
            await categoryModel.findOne({_id:m.category}).then(async(cn)=>{
            cname=cn.cname
          //  console.log(m)
            finalData.push(cname)
            })
//      propertyTypeModel.findOne({_id:m.ptType}).then(async(prop)=>{
// ptname=prop.ptname
// finalData.push(ptname)
        //  })
        }

        console.log(finalData)
        res.render("Home_Page",{sdata:data,
            p_cat:cdata,
            p_type:ptdata,
            cat:finalData,
            page_url:req.url, 
            agents:agents,
            test:test})
    })
    .catch(err=>console.log(err))
   // res.render("Home_Page")
   
})

// app.post("/",(req,res)=>{
//     let pdata=
// })




app.get("/about", async(req, res)=>{
    let cdata = await get_category_type();
    let ptdata = await get_property_type();
    console.log(cdata)
    res.render("about",
        {p_cat:cdata,
        p_type:ptdata,
        page_url:req.url, 
        })
   
})

app.get("/contact", async(req, res)=>{
    let cdata = await get_category_type();
    let ptdata = await get_property_type();
    console.log(cdata)
    res.render("contact",{p_cat:cdata,
        p_type:ptdata,
        page_url:req.url, 
        })
   
})


app.get("/property", async (req, res)=>{
    let cdata = await get_category_type();
    let ptdata = await get_property_type();
    console.log(cdata)
    res.render("property", {p_cat:cdata,
        p_type:ptdata,
        page_url:req.url, 
        })
   
})

app.post("/property", async (req, res)=>{
   // console.log(req.body)
    let cdata = await get_category_type();
    let ptdata = await get_property_type();

    let searchObject = {
        pname:{$regex: new RegExp(req.body.title, "i")},
    }
    // if(req.body.cat!="" || req.body.pt==""){
    //     searchObject = {
    //         pname:{$regex: new RegExp(req.body.title, "i")},
    //         category:req.body.cat
    //     }
    // }

    // if(req.body.cat=="" || req.body.pt!=""){
    //     searchObject = {
    //         pname:{$regex: new RegExp(req.body.title, "i")},
    //         ptType:req.body.pt
    //     }
    // }

    if(req.body.cat!="" || req.body.pt!=""){
        searchObject = {
            pname:{$regex: new RegExp(req.body.title, "i")},
            category:req.body.cat,
            ptType:req.body.pt
        }
    }

    propertyModel.find(searchObject).then(async(cn)=>{
        
      //  console.log(m)
      var string = encodeURIComponent(JSON.stringify(cn));
      console.log(cn)
      req.method='GET'
      res.render('property',{p_cat:cdata,
        p_type:ptdata,
        page_url:req.url, 
        pdata:cn
        })
        })
 //   console.log(cdata)

   
   
})

app.get("/property-type", async(req, res)=>{
    let cdata = await get_category_type();
    let ptdata = await get_property_type();
    console.log(cdata)
    res.render("property-type",{p_cat:cdata,
        p_type:ptdata,
        page_url:req.url, 
        })
   
})


app.get("/property-agent", async(req, res)=>{
    let cdata = await get_category_type();
    let ptdata = await get_property_type();
    console.log(cdata)
    res.render("property-agent",{p_cat:cdata,
        p_type:ptdata,
        page_url:req.url, 
        })
   
})


app.get("/testimonial", async(req, res)=>{
    let cdata = await get_category_type();
    let ptdata = await get_property_type();
    console.log(cdata)
    res.render("testimonial",{p_cat:cdata,
        p_type:ptdata,
        page_url:req.url, 
        })
   
})

app.get("/404", async(req, res)=>{
    let cdata = await get_category_type();
    let ptdata = await get_property_type();
    console.log(cdata)
    res.render("404",{p_cat:cdata,
        p_type:ptdata,
        page_url:req.url, 
        })
   
})



     //add image
    //  var storage = multer.diskStorage({
    //     destination: (req, file, cb) => {
    //         cb(null, 'uploads')
    //     },
    //     filename: (req, file, cb) => {
    //         cb(null, file.fieldname + '-' + Date.now()+".jpg")
    //     }
    // });

    // var uploadR = multer({ storage: storage });

app.post("/add_agent", (req,res)=>{
    let savS = new studentM(req.body)
    savS.save()
   // res.send("student created!")
    res.redirect("/view_agent")
})






// app.get("/data", (req, res)=>{
//     res.json(x)
// })




// app.get("/data/:id", (req, res)=>{
//    // console.log(req)
//    let y = x.find(p=>p.id==req.params.id)
//     res.render("detail",{detail:y})
// })

app.get("/testdb", (req, res)=>{
    res.render("testDB")
})

app.get("/viewdb", (req, res)=>{
    studentM.find().sort({_id:-1}).then((data)=>{
    console.log(data)
    res.render("viewdetail", {sdata:data})
})
    .catch(err=>console.log(err))
    //res.render("viewdetail")
   
})

app.get("/single/:id", (req, res)=>{
   studentM.find({_id:req.params.id}).then((data)=>{
    //console.log(req.params.id)
 // res.render("viewdetail", {sdata:data})
 res.render("single", {sdata:data})
})
    .catch(err=>console.log(err))
    //res.render("single")
   
})

app.delete("/delete/:id", (req, res)=>{
     // console.log("hiii delete "+req.params.id)
    // alert("hii")
   studentM.findByIdAndDelete({_id:req.params.id}).then((data)=>{

  
 })
//      .catch(err=>console.log(err))
req.method = 'GET'
window.location.href="/viewdb"
res.redirect(303,"/viewdb")

    
 })

app.post("/createStudent", (req,res)=>{
    let savS = new studentM(req.body)
    savS.save()
   // res.send("student created!")
    res.redirect("/testdb")
})

app.get("/update/:id", (req, res)=>{
    studentM.find({_id:req.params.id}).then((data)=>{
     //console.log(req.params.id)
  // res.render("viewdetail", {sdata:data})
  res.render("updatestudent", {sdata:data})
 })
     .catch(err=>console.log(err))
     //res.render("single")
    
 })

 app.post("/updateStudent/:sid", (req,res)=>{
   studentM.findByIdAndUpdate({_id:req.params.sid}, req.body).then(d=>{
   // res.send("student created!")
    res.redirect("/viewdb")
})
})


//testMail
app.get("/testmail",(req,res)=>{
    const mailData = {
        from:'vanshika.node.makaan@gmail.com',
        to:'sharmav9708@gmail.com',
        subject: 'Sending Email from node.js',
        text: 'That was easy!',
        html: '<b>Hey there!</b>',

    };
    transporter.sendMail(mailData, (error,info)=>{
        if(error){
            return console.log(error)
        }
        res.status(200).send({msg:"sent successfully", mid:info})
    })
})

//fp
app.get('/forget_password', async function(req,res){
    let cdata = await get_category_type();
    let ptdata = await get_property_type();
   console.log(res.locals.queryString)
    res.render("forget_password",{p_cat:cdata,
        p_type:ptdata,
        page_url:req.url, });
   console.log(req.session)
});

    
app.post("/fp",(req, res)=>{
    res.locals.userid = req.session.userid
    registerModel.findOne({email:req.body.email})
     .then((data)=>{
    if(data==null){
    //response.redirect("/fp")
    res.redirect("/forget_password?msg=invalidEmail")
     }
    else {
    let otp = Math.floor(100000 + Math.random() * 900000)
    console.log(otp)
    req.session.tempEmail=data.email
    req.session.tempUserId=data._id
    req.session.otp = otp
    const mailData = {
        from: 'vanshika.node.makaan@gmail.com', // sender address
        to: data.email, // list of receivers
        subject: 'Forget passwoed otp from makaan',
        text: 'That was easy!',
        html: `<body style="font-family: Helvetica, sans-serif; -webkit-fontsmoothing: antialiased; font-size: 16px; line-height: 1.3; -ms-text-size-adjust:
        100%; -webkit-text-size-adjust: 100%; background-color: #f4f5f6; margin: 0; padding:
        0;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0"
        class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-tablerspace: 0pt; background-color: #f4f5f6; width: 100%;" width="100%"
        bgcolor="#f4f5f6"> <tr><td style="font-family: Helvetica, sans-serif; font-size:
        16px; vertical-align: top;" valign="top">&nbsp;</td>
        <td class="container" style="font-family: Helvetica, sans-serif; fontsize: 16px; vertical-align: top; max-width: 600px; padding: 0; padding-top: 24px;
        width: 600px; margin: 0 auto;" width="600" valign="top">
        <div class="content" style="box-sizing: border-box; display: block;
        margin: 0 auto; max-width: 600px; padding: 0;">
        <span class="preheader" style="color: transparent; display: none;
height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all;
visibility: hidden; width: 0;">This is preheader text. Some clients will show this
text as a preview.</span>
<table role="presentation" border="0" cellpadding="0"
cellspacing="0" class="main" style="border-collapse: separate; mso-table-lspace:
0pt; mso-table-rspace: 0pt; background: #ffffff; border: 1px solid #eaebed; borderradius: 16px; width: 100%;" width="100%">
<tr>
<td class="wrapper" style="font-family: Helvetica, sans-serif;
font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 24px;"
valign="top">
<p style="font-family: Helvetica, sans-serif; font-size:
16px; font-weight: normal; margin: 0; margin-bottom: 16px;">Hi ${data.username}</p>
<p style="font-family: Helvetica, sans-serif; font-size:
16px; font-weight: normal; margin: 0; margin-bottom: 16px;">
Here is otp for forget password: <b>${otp}</b></p>
<table role="presentation" border="0" cellpadding="0"
cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-tablelspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%; min-width:
100%;" width="100%">
<tbody>
<tr>
<td align="left" style="font-family: Helvetica, sansserif; font-size: 16px; vertical-align: top; padding-bottom: 16px;" valign="top">
<table role="presentation" border="0"
cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace:
0pt; mso-table-rspace: 0pt; width: auto;">
<tbody>
<tr>
<td style="font-family: Helvetica, sans-serif;
font-size: 16px; vertical-align: top; border-radius: 4px; text-align: center;
background-color: #0867ec;" valign="top" align="center" bgcolor="#0867ec"> <a
href="http://localhost:3333" target="_blank" style="border: solid 2px #0867ec;
border-radius: 4px; box-sizing: border-box; cursor: pointer; display: inline-block;
font-size: 16px; font-weight: bold; margin: 0; padding: 12px 24px; text-decoration:
none; text-transform: capitalize; background-color: #0867ec; border-color: #0867ec;
color: #ffffff;">Visit here</a> </td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<p style="font-family: Helvetica, sans-serif; font-size:
16px; font-weight: normal; margin: 0; margin-bottom: 16px;">Thank you for choosing
us, and we appreciate the opportunity to serve you.</p>
<p style="font-family: Helvetica, sans-serif; font-size:
16px; font-weight: normal; margin: 0; margin-bottom: 16px;">Good luck! Hope it
works.</p>
</td>
</tr>
</table>
<div class="footer" style="clear: both; padding-top: 24px; textalign: center; width: 100%;">
<table role="presentation" border="0" cellpadding="0"
cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-tablerspace: 0pt; width: 100%;" width="100%">
<tr>
<td class="content-block" style="font-family: Helvetica,
sans-serif; vertical-align: top; color: #9a9ea6; font-size: 16px; text-align:
center;" valign="top" align="center">
<span class="apple-link" style="color: #9a9ea6; font-size:
16px; text-align: center;">Company Inc, 7-11 Commercial Ct, Belfast BT1 2NB</span>
<br> Don't like these emails? <a
href="http://htmlemail.io/blog" style="text-decoration: underline; color: #9a9ea6;
font-size: 16px; text-align: center;">Unsubscribe</a>.
</td>
</tr>
<tr>
<td class="content-block powered-by" style="font-family:
Helvetica, sans-serif; vertical-align: top; color: #9a9ea6; font-size: 16px; textalign: center;" valign="top" align="center">
Powered by <a href="http://htmlemail.io" style="color:
#9a9ea6; font-size: 16px; text-align: center; text-decoration:
none;">HTMLemail.io</a>
</td>
</tr>
</table>
</div>
</div>
</td>
<td style="font-family: Helvetica, sans-serif; font-size: 16px;
vertical-align: top;" valign="top">&nbsp;</td>
</tr>
</table>
</body>`,
 }
transporter.sendMail(mailData, (error, info)=>{
if(error){
return console.log(error)
 }
// response.redirect("/resetpassword")
 })
res.redirect("/forget_password?msg=ok")
//response.redirect("/fp?msg=ok")
 }
console.log("forget Successfully.....", {data})
// request.session.userid = data._id
 })
 .catch((err)=>{
console.log("Something Wrong In User Sign-Up:", {err})
 })
})


app.post("/checkotp",(req, res)=>{
    //req.session.destroy()
    if(req.body.otp==req.session.otp){
    res.redirect("/reset_password")
     }
    else {
    res.redirect("/forget_password?msg=wrongotp")
     }
    // res.render("reset-password")
    })

    app.post("/reset_password",(req, res)=>{
        //req.session.destroy()
        registerModel.findByIdAndUpdate({_id:req.session.tempUserId},
            {pass:req.body.password})
             .then((data)=>{
            if(data!=null){
            req.session.destroy()
            res.redirect("/reset_password?msg=success")
             }
            else {
            res.redirect("/reset_password?msg=fail")
             }
             })
            console.log(res.locals.queryString)
            //res.render("reset-password")
            })


            app.get("/reset_password",async (req, res)=>{
                let cdata = await get_category_type();
                let ptdata = await get_property_type();
            //req.session.destroy()
            console.log(res.locals.queryString)
            res.render("reset_password",{p_cat:cdata,
                p_type:ptdata,
                page_url:req.url,})
                console.log(req.session)
            })
                    

//react work
app.get("/forreact",(req,res)=>{
    registerModel.find().then((data)=>{
     res.json(data)
    })
    
    })

    app.post("/submitreactform",(req,res)=>{
        console.log(req.body)
        let sav = new reactRegistrationModel(req.body)
        sav.save();
    })

    app.get("/getusers",(req,res)=>{
        reactRegistrationModel.find().then((data)=>{
            console.log(data)
            res.json(data);
        })
        console.log(req.body)
    
    })

    app.post("/react_logIn",(req,res)=>{
        console.log(req.body)
        const email = req.body.email
        const pass = req.body.psw
        let usermail = reactRegistrationModel.findOne({email:email,psw:pass})
        .then((data)=>{
            usermail=data
            if(usermail !==null){
                res.json(data)
              
            }else{
                res.json(data)
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    app.get("/account",(req,res)=>{
        reactRegistrationModel.find().then((data)=>{
            console.log(data)
            res.json(data);
        })
        console.log(req.body)
    
    })


app.listen(3333, ()=>console.log("server running fine"))




    
