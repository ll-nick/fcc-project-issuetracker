const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  test('Post valid issue with optional fields', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/test_project')
      .send({
        issue_title: "a",
        issue_text: "b",
        created_by: "c",
        assigned_to: "d",
        status_text: "e"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.issue_title, 'a')
        assert.equal(res.body.issue_text, 'b')
        assert.equal(res.body.created_by, 'c')
        assert.equal(res.body.assigned_to, 'd')
        assert.equal(res.body.status_text, 'e')
        assert.equal(res.body.open, true)
        assert.isNotNull(res.body.created_on)
        assert.isNotNull(res.body.updated_on)
        done();
      });
  });

  test('Post valid issue without optional fields', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/test_project')
      .send({
        issue_title: "a",
        issue_text: "b",
        created_by: "c",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.issue_title, 'a')
        assert.equal(res.body.issue_text, 'b')
        assert.equal(res.body.created_by, 'c')
        assert.equal(res.body.assigned_to, '')
        assert.equal(res.body.status_text, '')
        assert.equal(res.body.open, true)
        assert.isNotNull(res.body.created_on)
        assert.isNotNull(res.body.updated_on)
        done();
      });
  });

  test('Post valid issue without required fields', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/test_project')
      .send({
        issue_title: "a",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'required field(s) missing')
        done();
      });
  });

  test('get without filter', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/test_project')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.typeOf(res.body, 'array');
        assert.isAtLeast(res.body.length, 2)
        done();
      });
  });

  test('get without single filter', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/test_project')
      .query({
        issue_title: "a",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.typeOf(res.body, 'array');
        assert.isAtLeast(res.body.length, 2)
        done();
      });
  });

  test('get without multiple filters', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/test_project')
      .query({
        issue_title: "a",
        status_text: "e",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.typeOf(res.body, 'array');
        assert.isAtLeast(res.body.length, 1)
        done();
      });
  });

});
