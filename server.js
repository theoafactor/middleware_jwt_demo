const express = require("express");
const jwt = require("jsonwebtoken")

const server = express();

//create custom middleware
const checkloggedin = (request, response, next) => {

    const bearer_token = request.headers['authorization']

    if(bearer_token == null || typeof bearer_token == "undefined"){
        return response.status(403).send({
            message: "You are not authorized to access the endpoint",
            code: "invalid credentials"
        })
    }else{

        bearer_token_box = bearer_token.split(" ")

        const token = bearer_token_box[1]

        request.token = token;
    
        next()

    }

   

    
}

server.use(express.json())



server.get("/", (request, response) => {


    response.send({
        message: "Server is working fine"
    })


})

server.post("/login", (request, response) => {

    let username = request.body.username.trim();
    let password = request.body.password.trim();

    const user = {
        username: username,
        password: password
    }

    jwt.sign(user, "signingkey", (error, token) => {

        if(error){
            response.status(500).send({
                message: "There was error signing you in"
            })
        }else{

            response.status(200).send({
                message: "Logged in successfully", 
                token: token
            })


        }

    })

   


})


server.post("/profile", checkloggedin, (request, response) => {

    jwt.verify(request.token, "signingkey", (error, user_data) => {

        if(error){
            response.status(403).send({
                message: "Invalid token",
                code: "credentials-error",
                data: null
            })
        }else{

            response.status(200).send({
                message: "User data valid",
                code: "success",
                data: user_data
            })

        }

    })
    

})



server.listen(1234, () => console.log("Server is listening on PORT 1234"))