module.exports = function (app) {

  const http = require('http');
  const httpServer = http.createServer(app);
  const io = require('socket.io');
  const realtimeServer = io(httpServer);
  const bodyParser = require('body-parser');
  const urlencodedBodyParser = bodyParser.urlencoded({ extended: false });

  app.post('/log-in', urlencodedBodyParser, async(req, res) =>{
    let user = req.body.username;
    let pass = req.body.password;
    // Ensure no fields are empty
    if(!user || !pass){
      console.log('A field was left empty');
    }else{

      const db = app.get('db')
      const users = db.collection("users");

      //Check for user in db
      const user_exists_check = await users.findOne({username: user, password: pass});
      //If user exists, assign them a session
      if(user_exists_check){
        req.session.username = user;
        res.redirect('/dashboard')
      }else{
        console.log('No user found with those credentials');
      }
    }
  });
};
