const assert = require('chai').assert
const mongoose = require('mongoose')
const TasksService = require('../../services/tasks.service')

describe('./services/tasks.service', () => {
  const user = '5d4f26aa046ad506f9583bd3'
  const date = new Date().getTime()
  const type = 'task'
  const title = 'Un titre de tâche'
  const description = 'Description de ma tâche de test'
  const subject = 'Une matière'
  const city = 'Lyon'
  const grade = 'B3'
  const group = 'G1 (dev)'
  const targets = []

  // ===============================================
  // == Methods
  // ===============================================

  describe('#getAllFrom', () => {
    it('should get notifications of user', (done) => {
      TasksService.getAllFrom(user).then(tasks => {
        assert.isDefined(tasks)
        assert.isArray(tasks)
        done()
      }).catch(err => done(err))
    })
  })

  describe('#create', () => {
    it('should create a task', (done) => {
      TasksService.create(user, date, type, title, description, subject, city, grade, group, targets).then(task => {
        assert.isTrue(task._id instanceof mongoose.mongo.ObjectID)
        assert.isTrue(task.author._id instanceof mongoose.mongo.ObjectID)
        assert.strictEqual(task.date, date.toString())
        assert.strictEqual(task.type, type)
        assert.strictEqual(task.title, title)
        assert.strictEqual(task.description, description)
        assert.strictEqual(task.subject, subject)
        assert.strictEqual(task.city, city)
        assert.strictEqual(task.grade, grade)
        assert.strictEqual(task.group, group)
        assert.isArray(task.targets)
        done()
      }).catch(err => done(err))
    })
  })
})
