const bcrypt = require('bcryptjs')
const User = require('../models/user.model')
const Notification = require('../models/notification.model')
const Refresh = require('../models/refresh.model')
const Token = require('../models/token.model')

// ================================================
//  == Methods
// ================================================

exports.create = async (firstname, lastname, email, password, grade) => {
  const user = new User({
    firstname,
    lastname,
    email,
    password: bcrypt.hashSync(password, 10),
    grade
  })

  await user.save()
  return user
}

exports.updateUserInformations = async (userId, _firstname, _lastname, _email, _permissionLevel, _grade, _bts, _isActive) => {
  const user = await User.findById(userId)
  user.firstname = _firstname
  user.lastname = _lastname
  user.email = _email
  user.permissionLevel = _permissionLevel
  user.grade = _grade
  user.bts = _bts
  user.isActive = _isActive
  await user.save()
}

exports.deleteAccount = async (userId) => {
  await User.findByIdAndDelete(userId)
  await Notification.deleteMany({
    user: userId
  })
  await Token.deleteMany({
    user: userId
  })
  await Refresh.deleteMany({
    user: userId
  })
}

// ================================================
//  == Getters
// ================================================

exports.findOne = async (search, includePassword) => {
  if (includePassword) {
    const user = await User.findOne(search).lean()
    return user
  } else {
    const user = await User.findOne(search)
      .select('-password')
      .lean()
    return user
  }
}

exports.findAll = async (search) => {
  const users = await User.find({ search }).select('-password').lean()
  return users
}

// ================================================
//  == Setters
// ================================================

exports.setActive = async (userId, value) => {
  const user = await User.findById(userId)
  user.isActive = value
  await user.save()
}

exports.setPassword = async (userId, value) => {
  const user = await User.findById(userId)
  user.password = bcrypt.hashSync(value, 10)
  await user.save()
}

exports.setInformationMails = async (userId, value) => {
  const user = await User.findById(userId)
  user.hasInformationMails = value
  await user.save()
}
