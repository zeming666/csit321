const express = require('express')
const cors = require('cors')
const mysql = require("./mysql");
const {response} = require("express");
var bodyParser = require('body-parser')
const fs = require("fs");
const app = express()
const port = 5000


var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({extended: false})
//最前
app.use(cors()) // Use this after the variable declaration


app.get('/Login', (req, res) => {
    res.send('Hello World!')
})

app.get('/test', (req, res) => {
    console.log('12311')
    console.log(req.query.ID)
    res.status(200).json({
        name: 'william',
        age: 18,
        email: mysql.loginSelectByEmail()
    })
})
app.get('/test1', (req, res) => {
    mysql.loginSelectByEmail()
        .then(res1 => {
            // console.log(res1)
            res.status(200).json({
                name: 'william',
                age: 18,
                phone: 18287888888,
                email: res1
            })
        })
        .catch(err => {
            console.log(err)
        })
    // console.log(mysql.dbConnect1())
})


app.post('/login', jsonParser, (req, res) => {
    // console.log(req.body.email)
    mysql.loginSelectByEmail(req.body.email)
        .then(res1 => {
            console.log(res1.userNum)
            console.log(res1.password)
            console.log(res1.firstName)
            //statusCode 1: success, 0: error
            if (res1.password === req.body.pw) {
                res.status(200).json({
                    fname: res1.firstName,
                    uid: res1.userNum,
                    statusCode: 1
                })
                console.log(res1)
            } else {
                res.status(200).json({
                    uid: res1.userNum,
                    statusCode: 0
                })
                console.log("error")
            }
        })
        .catch(err => {
            console.log(err)
        })
})

app.post('/register', jsonParser, (req, res) => {
    mysql.registerInsert(req.body.lastName, req.body.firstName, req.body.firstPd, req.body.birth, req.body.email, req.body.phoneNumber, req.body.gender).then(res1 => {
        console.log(res1)
        res.status(200).json({
            error: res1
        })
    })
})
// url: /initHomePost
// method: post
// params: uid
app.post('/initHomePost', jsonParser, (req, res) => {
    console.log(req.body.uid)
    mysql.popularSelect().then(res1 => {
        res.status(200).json({
            res1
        })
        console.log(res1)
    })
})

// url: /searchMountains
// method: post
// params: loc
app.post('/searchMountains', jsonParser, (req, res) => {
    console.log(req.body.loc)
    mysql.searchMountains(req.body.loc).then(res1 => {
        res.status(200).json({
            res1
        })
        console.log(res1)
    })
})

// url: /initDetailPost
// method: post
// params: loc
app.post('/initDetailPost', jsonParser, (req, res) => {
    console.log(req.body.loc)
    res.status(200).json({
        lat:-34.42036296539061,
        lng:150.8968482112078
    })
})
// url: /mountainDetailOnload
// method: post
// params: loc
app.post('/mountainDetailOnload', jsonParser, (req, res) => {
    console.log(req.body.loc)
    mysql.selectMountainDetailOnload(req.body.loc).then(res1 => {
        res.status(200).json({
            res1
        })
        console.log(res1)
    })
})
// url: /commentDetailOnload
// method: post
// params: loc
app.post('/commentDetailOnload', jsonParser, (req, res) => {
    console.log(req.body.loc)
    mysql.selectCommentDetailOnload(req.body.loc).then(res1 => {
        res.status(200).json({
            res1

        })
        console.log(res1)
    })
})
// url: /getWeatherInfo
// method: post
// params: loc
app.post('/getWeatherInfo', jsonParser, (req, res) => {
    console.log(req.body.loc)
    mysql.selectWeather(req.body.loc).then(res1 => {
        const fs = require('fs');
        const data = fs.readFileSync('./weather.json', 'utf8');

        // parse JSON string to JSON object
        const config = JSON.parse(data);
        for (let i = 0; i < config.length; i++) {
            if (config[i].name === res1[0].CITY) {
                config[i].main.feels_like -= 273.15;
                config[i].main.temp -= 273.15;
                config[i].main.temp_max -= 273.15;
                config[i].main.temp_min -= 273.15;
                // console.log(config[i].main);
                const weather = config[i];
                res.status(200).json({
                    weather
                })
                break;
            }
        }
    })
})
// url: /getSimilarMountains
// method: post
// params: loc
// app.post('/getSimilarMountains', jsonParser, (req, res) => {
//     console.log(req.body.loc)
//     mysql.selectSimilarMountains(req.body.loc).then(res1 => {
//         res.status(200).json({
//             res1
//         })
//         console.log(res1)
//     })
// })

// url: /postComment
// method: post
// params: fname, loc, score, comment
app.post('/postComment', jsonParser, (req, res) => {
    time = new Date();
    time = time.toLocaleString();
    mysql.insertComment(req.body.fname, req.body.loc, time, req.body.score , req.body.comment).then(res1 => {
        console.log(res1)
        res.status(200).json({
            error: res1
        })
        console.log(res.body)
    })
})
// url: /updateScore
// method: post
// params: loc, score
app.post('/updateScore', jsonParser, (req, res) => {
    mysql.updateScore(req.body.loc, req.body.score).then(res1 => {
        console.log(res1)
        res.status(200).json({
            error: res1
        })
        console.log(res.body)
    })
})

// url: /settingOnload
// method: post
// params: uid
app.post('/settingOnload', jsonParser, (req, res) => {
    console.log(req.body.uid)
    mysql.selectSettingOnload(req.body.uid).then(res1 => {
        res.status(200).json({
             res1
        })
    })
})

// url: /settingUpdate
// method: post
// params: uid, ficusDOBrstName, password, firstName, lastName, phoneNum, email, gender
app.post('/settingUpdate', jsonParser, (req, res) => {
    console.log(req.body.uid)
    mysql.updateSetting(req.body.uid, req.body.cusDOB, req.body.password, req.body.firstName, req.body.lastName, req.body.phoneNum, req.body.email, req.body.gender).then(res1 => {
        res.status(200).json({
            res1
        })
    })
})

//------------------------activity------------------------
// url: /activityOnload
// method: post
// params: uid
app.post('/activityOnload', jsonParser, (req, res) => {
    console.log(req.body.uid)
    mysql.selectActivityOnload(req.body.uid).then(res1 => {
        res.status(200).json({
            res1
        })
    })
})
// url: /setActivity
// method: post
// params: uid, userName, emergencyContact, location, startDate, endDate, notes
app.post('/setActivity', jsonParser, (req, res) => {
    console.log(req.body.uid)
    mysql.insertActivity(req.body.uid, req.body.userName, req.body.emergencyContact, req.body.location, req.body.startDate, req.body.endDate, req.body.notes).then(res1 => {
        res.status(200).json({
            res1
        })
    })
})
// url: /finishActivity
// method: post
// params: uid, location, endDate,
app.post('/finishActivity', jsonParser, (req, res) => {
    console.log(req.body.uid)
    mysql.updateActivity(req.body.uid).then(res1 => {
        res.status(200).json({
            res1
        })
    })
})

//最后
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})