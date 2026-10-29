const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const usersDB = {
  users: require('../model/user.json'),
  setUsers: function (data) {this.users = data}
}

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd ) {
    return res.status(400).json({ 'message': 'Username and password are required.' });
  }

  const duplicate = usersDB.users.find(user => user.username === user);

  if (duplicate) return res.sendStatus(409); //conflict

  try {
    const hashedpwd = await bcrypt.hash(pwd, 10);

    const newuser = {
      "username": user,
      "password": hashedpwd
    }

    usersDB.setUsers([...usersDB.users, newuser]);

    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users));

    console.log(usersDB.users);
    res.status(201).json({ 'success': `New user ${user} created!` })
  } catch (err) {
    res.status(500).json({ 'message': err.message });
  }
}

module.exports = { handleNewUser }