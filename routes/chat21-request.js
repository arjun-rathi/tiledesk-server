var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var Request = require("../models/request");
var Message = require("../models/message");
var requestservice = require('../models/requestService');
var messageservice = require('../models/messageService');
var Project_userApi = require("../controllers/project_user");
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;





router.post('/', function(req, res) {

  console.log("chat21 req.body", req.body);

  // console.log("req.projectid", req.projectid);
  // console.log("req.user.id", req.user.id);

// curl -X POST -H 'Content-Type:application/json'  -d '{"event_type": "first-message", "data":{"sender":"sender", "sender_fullname": "sender_fullname", "recipient":"123456789123456789", "recipient_fullname":"Andrea Leo","text":"text", "projectid":"5ad5bd52c975820014ba900a", "attributes": {"departmentId":"5b8eb4955ca4d300141fb2cc"}}}' http://localhost:3000/chat21/requests
  if (req.body.event_type == "first-message") {

    console.log("event_type","first-message");


    var message = req.body.data;

    
    console.log("chat21 message", message);

    var departmentid = "default";

    var sourcePage;
    var client;
    var language;

    if (message.attributes) {

      departmentid = message.attributes.departmentId;
      console.log("chat21 departmentid", departmentid);

      sourcePage = message.attributes.sourcePage;
      console.log("chat21 sourcePage", sourcePage);
      
      client = message.attributes.client;
      console.log("chat21 client", client);
  
      language = message.attributes.language;
      console.log("chat21 language", language);
    }
    

    var projectid = message.projectid;

    if (!projectid) {
      console.log("projectid is null. Not a support message");
      return res.status(400).send({success: false, msg: 'projectid is null. Not a support message'});
    }

    console.log("chat21 projectid", projectid);

    return requestservice.createWithId(message.recipient, message.sender, message.sender_fullname, projectid, message.text, departmentid, sourcePage, language, client).then(function (result) {
      return res.json(result);
    }).catch(function (err) {
      console.log("err", err);

      return res.status(500).send({success: false, msg: 'Error creating the request object.', err:err});
    });





  } else if (req.body.event_type == "new-message") {
    //with projectid
    // curl -X POST -H 'Content-Type:application/json'  -d '{"event_type": "new-message", "data":{"sender":"sender", "sender_fullname": "sender_fullname", "recipient":"123456789123456789", "recipient_fullname":"Andrea Leo","text":"text", "projectid":"987654321"}}' http://localhost:3000/chat21/requests
    //with recipient with existing projectid
    // curl -X POST -H 'Content-Type:application/json'  -d '{"event_type": "new-message", "data":{"sender":"sender", "sender_fullname": "sender_fullname", "recipient":"123456789123456789", "recipient_fullname":"Andrea Leo","text":"text"}}' http://localhost:3000/chat21/requests

    //with recipient with no projectid
    // curl -X POST -H 'Content-Type:application/json'  -d '{"event_type": "new-message", "data":{"sender":"sender", "sender_fullname": "sender_fullname", "recipient":"1234567891234567891", "recipient_fullname":"Andrea Leo","text":"text"}}' http://localhost:3000/chat21/requests


    console.log("event_type","new-message");

    var message = req.body.data;
    console.log("chat21 message", message);


 

    var projectid = message.projectid;
    console.log("chat21 projectid", projectid);


    return messageservice.create(message.sender, message.sender_fullname, message.recipient, message.recipient_fullname, message.text,
      projectid, "system").then(function(savedMessage){
        return res.json(savedMessage);

      }).catch(function(err){
        console.error("Error creating message", err);
        return res.status(500).send({success: false, msg: 'Error creating message', err:err });
      });
   

  } else {
    res.json("Not implemented");
  }

  

});













module.exports = router;
