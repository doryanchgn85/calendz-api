const assert = require('chai').assert
const request = require('supertest')
const app = require('../../app')
const helper = require('../test.helper')

describe('./routes/auth.route', () => {
  // ===============================================
  // == POST /api/v1/auth - user login
  // ===============================================
  describe('POST /api/v1/auth - user login', () => {
    it('should fail (412) : certains champs requis sont manquant', (done) => {
      request(app).post('/api/v1/auth').set(helper.defaultSets).expect('Content-Type', /json/)
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyErrors(res.body)
          helper.hasBodyMessage(res.body, 'Certains champs requis sont manquant')
          done()
        })
    })

    it('should fail (412) : veuillez indiquer votre mot de passe', (done) => {
      request(app).post('/api/v1/auth').set(helper.defaultSets).expect('Content-Type', /json/)
        .send({ email: 'arthur.dufour@epsi.fr' })
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyMessage(res.body, 'Certains champs requis sont manquant')
          helper.hasBodyErrorsThatContains(res.body, 'Veuillez indiquer votre mot de passe')
          done()
        })
    })

    it('should fail (412) : veuillez indiquer votre adresse mail', (done) => {
      request(app).post('/api/v1/auth').set(helper.defaultSets).expect('Content-Type', /json/)
        .send({ password: 'password' })
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyMessage(res.body, 'Certains champs requis sont manquant')
          helper.hasBodyErrorsThatContains(res.body, 'Veuillez indiquer votre adresse mail')
          done()
        })
    })

    it('should fail (404) : l\'adresse mail indiquée ne correspond à aucun utilisateur', (done) => {
      request(app).post('/api/v1/auth').set(helper.defaultSets).expect('Content-Type', /json/)
        .send({ email: 'arthur.dufour@epsi.com', password: 'password' })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyMessage(res.body, 'L\'adresse mail indiquée ne correspond à aucun utilisateur')
          done()
        })
    })

    it('should fail (401) : mot de passe invalide', (done) => {
      request(app).post('/api/v1/auth').set(helper.defaultSets).expect('Content-Type', /json/)
        .send({ email: 'arthur.dufour1@epsi.fr', password: 'azeaze' })
        .expect(401)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyMessage(res.body, 'Mot de passe invalide')
          done()
        })
    })

    it('should fail (403) : veuillez confirmer votre adresse mail', (done) => {
      request(app).post('/api/v1/auth').set(helper.defaultSets).expect('Content-Type', /json/)
        .send({ email: 'thomas.zimmermann@epsi.fr', password: 'password' })
        .expect(403)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyMessage(res.body, 'Veuillez confirmer votre email afin de pouvoir vous connecter')
          done()
        })
    })

    it.skip('should success (201) : connexion réussie', (done) => {
      request(app).post('/api/v1/auth').set(helper.defaultSets).expect('Content-Type', /json/)
        .send({ email: 'arthur.dufour1@epsi.fr', password: 'password' })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'user')
          assert.isDefined(res.body.user)
          assert.property(res.body, 'accessToken')
          assert.isDefined(res.body.accessToken)
          assert.property(res.body, 'refreshToken')
          assert.isDefined(res.body.refreshToken)
          helper.hasBodyMessage(res.body, 'Connexion réussie')
          done()
        })
    })
  })

  // ===============================================
  // == POST /api/v1/auth/refresh - login refresh
  // ===============================================
  describe('POST /api/v1/auth/refresh - login refresh', () => {
    it.skip('should fail (412) : aucun accessToken transmit', (done) => {
      request(app).post('/api/v1/auth/refresh').set(helper.defaultSets).expect('Content-Type', /json/)
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyMessage(res.body, 'Aucun accessToken transmit')
          done()
        })
    })

    it.skip('should fail (412) : votre session a expirée, veuillez vous reconnecter', (done) => {
      request(app).post('/api/v1/auth/refresh').set(helper.defaultSetsWithExpiredAuth).expect('Content-Type', /json/)
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyMessage(res.body, 'Votre session a expirée, veuillez vous reconnecter')
          done()
        })
    })

    it.skip('should fail (412) : votre jeton est invalide, veuillez vous reconnecter', (done) => {
      request(app).post('/api/v1/auth/refresh').set(helper.defaultSetsWithInvalidAuth).expect('Content-Type', /json/)
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyMessage(res.body, 'Votre jeton est invalide, veuillez vous reconnecter')
          done()
        })
    })

    it.skip('should success (200) : connexion réussie', (done) => {
      request(app).post('/api/v1/auth/refresh').set(helper.defaultSetsWithAuth).expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          assert.property(res.body, 'user')
          assert.isDefined(res.body.user)
          helper.hasBodyMessage(res.body, 'Connexion réussie')
          done()
        })
    })
  })

  // ==================================================
  // == POST /api/v1/verify/email - vérification email
  // ==================================================
  describe('POST /api/v1/auth/verify/email - vérification adresse email', () => {
    it('should fail (412) : aucun token transmit', (done) => {
      request(app).post('/api/v1/auth/verify/email').set(helper.defaultSets).expect('Content-Type', /json/)
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyMessage(res.body, 'Aucun token transmit')
          done()
        })
    })

    it('should fail (404) : le lien actuel est invalide', (done) => {
      request(app).post('/api/v1/auth/verify/email').set(helper.defaultSets).expect('Content-Type', /json/)
        .send({ token: 'notAValidToken' })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyMessage(res.body, 'Le lien actuel est invalide')
          done()
        })
    })

    it('should fail (412) : le type du token est invalide', (done) => {
      request(app).post('/api/v1/auth/verify/email').set(helper.defaultSets).expect('Content-Type', /json/)
        .send({ token: 'aValidToken2' })
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyMessage(res.body, 'Le type du token est invalide')
          done()
        })
    })

    it('should success (200) : adresse mail bien validée', (done) => {
      request(app).post('/api/v1/auth/verify/email').set(helper.defaultSets).expect('Content-Type', /json/)
        .send({ token: 'aValidToken' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyMessage(res.body, 'Votre adresse mail a bien été validée')
          done()
        })
    })
  })

  // =================================================================================
  // == POST /api/v1/auth/password-reset/send-mail - envoie mail réinitialisation mdp
  // =================================================================================
  describe('POST /api/v1/auth/password-reset/send-mail - envoie mail réinitialisation mdp', () => {
    it('should fail (412) : veuillez indiquer votre adresse mail', (done) => {
      request(app).post('/api/v1/auth/password-reset/send-mail').set(helper.defaultSets).expect('Content-Type', /json/)
        .expect(412)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyMessage(res.body, 'Veuillez indiquer votre adresse mail')
          done()
        })
    })

    it('should fail (404) : l\'adresse mail indiquée ne correspond à aucun utilisateur', (done) => {
      request(app).post('/api/v1/auth/password-reset/send-mail').set(helper.defaultSets).expect('Content-Type', /json/)
        .send({ email: 'notAValidEmail' })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyMessage(res.body, 'L\'adresse mail indiquée ne correspond à aucun utilisateur')
          done()
        })
    })

    it('should success (200) : l\'email a bien été envoyé', (done) => {
      request(app).post('/api/v1/auth/password-reset/send-mail').set(helper.defaultSets).expect('Content-Type', /json/)
        .send({ email: 'alexandre.tuet1@epsi.fr' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          helper.hasBodyMessage(res.body, 'L\'email a bien été envoyé')
          done()
        })
    })
  })
})
