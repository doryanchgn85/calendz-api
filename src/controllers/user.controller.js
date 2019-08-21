const uuidv4 = require('uuid/v4')
const config = require('../config/config')
const mailer = require('../config/mailgun')

const UserService = require('../services/user.service')
const TokenService = require('../services/token.service')

// creates a new user (register)
exports.create = async (req, res) => {
  const _firstname = req.body.firstname
  const _lastname = req.body.lastname
  const _email = req.body.email
  const _password = req.body.password
  const _grade = req.body.grade

  // création utilisateur et création token confirmation mail
  const user = await UserService.create(_firstname, _lastname, _email, _password, _grade)
  const token = await TokenService.create(user._id, uuidv4(), 'EMAIL_VERIFICATION')

  // envoie mail de confirmation
  await mailer.sendVerificationEmail(user.email, user.firstname, user.lastname, `${config.front_url}email-confirmation/${token.value}`)

  return res.status(201).json({
    id: user._id,
    message: 'Votre compte a bien été créé'
  })
}

// modification du mot de passe
exports.changePassword = async (req, res) => {
  const _tokenValue = req.body.token
  const _password = req.body.password

  // supprime le token puis update le mdp
  const token = await TokenService.deleteByValue(_tokenValue)
  await UserService.setPassword(token.user, _password)

  return res.status(200).json({
    message: 'Votre mot de passe a bien été modifié'
  })
}

// envoie un mail pour réinitialiser le mot de passe
exports.sendResetPasswordEmail = async (req, res) => {
  const _user = req.user

  // création token page de réinitialisation du mot de passe
  const token = await TokenService.create(_user._id, uuidv4(), 'PASSWORD_RESET')

  // envoie mail reset
  await mailer.sendPasswordResetEmail(_user.email, _user.firstname, _user.lastname, `${config.front_url}password-reset/${token.value}`)

  return res.status(200).json({
    message: 'L\'email a bien été envoyé'
  })
}

// change le mot de passe de l'utilisateur
exports.changePasswordUser = async (req, res) => {
  const _password = req.body.password
  const _userId = req.decodedUserId

  // update le mdp
  await UserService.setPassword(_userId, _password)

  // envoie mail d'informations
  const _user = await UserService.findOne({ _id: _userId })
  await mailer.sendPasswordChangedEmail(_user.email, _user.firstname, _user.lastname)

  return res.status(200).json({
    message: 'Votre mot de passe a bien été modifié'
  })
}

// change l'incription à la liste de mail de l'utilisateur
exports.changeIsSubMail = async (req, res) => {
  const _userId = req.decodedUserId
  const _isSubMail = req.body.isSubMail

  console.log(_userId + ' - ' + _isSubMail)

  await UserService.setIsSubMail(_userId, _isSubMail)

  return res.status(200).json({
    message: 'Le statut à bien été modifié'
  })
}
