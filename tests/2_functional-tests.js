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

  test('put one field', function (done) {
    let id;
    chai
      // Create a new issue
      .request(server)
      .keepOpen()
      .post('/api/issues/test_project')
      .send({
        issue_title: "test put one field",
        issue_text: "b",
        created_by: "c",
      })
      .end(function (err, res) {
        // Update the issue
        id = res.body._id
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/test_project')
          .send({
            _id: id,
            issue_text: "changed in put request",
          })
          .end(function (err, res) {
            assert.equal(res.body.result, 'successfully updated')
            assert.equal(res.body._id, id)

            // Get updated issue
            chai
              .request(server)
              .keepOpen()
              .get('/api/issues/test_project')
              .query({
                _id: id,
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body[0].issue_text, 'changed in put request')
                done();
              });
          });
      });
  });

  test('put multiple fields', function (done) {
    let id;
    chai
      // Create a new issue
      .request(server)
      .keepOpen()
      .post('/api/issues/test_project')
      .send({
        issue_title: "test put multiple field",
        issue_text: "b",
        created_by: "c",
      })
      .end(function (err, res) {
        // Update the issue
        id = res.body._id
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/test_project')
          .send({
            _id: id,
            issue_text: "changed in put request 1",
            created_by: "changed in put request 2",
          })
          .end(function (err, res) {
            assert.equal(res.body.result, 'successfully updated')
            assert.equal(res.body._id, id)

            // Get updated issue
            chai
              .request(server)
              .keepOpen()
              .get('/api/issues/test_project')
              .query({
                _id: id,
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body[0].issue_text, 'changed in put request 1')
                assert.equal(res.body[0].created_by, 'changed in put request 2')
                done();
              });
          });
      });
  });

  test('put missing id', function (done) {
    let id;
    chai
      // Create a new issue
      .request(server)
      .keepOpen()
      .post('/api/issues/test_project')
      .send({
        issue_title: "test put missing id",
        issue_text: "b",
        created_by: "c",
      })
      .end(function (err, res) {
        // Update the issue
        id = res.body._id
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/test_project')
          .send({
            issue_text: "changed in put request 1",
            created_by: "changed in put request 2",
          })
          .end(function (err, res) {
            assert.equal(res.body.error, 'missing _id')
            done();
          });
      });
  });

  test('put no changes', function (done) {
    let id;
    chai
      // Create a new issue
      .request(server)
      .keepOpen()
      .post('/api/issues/test_project')
      .send({
        issue_title: "test put no changes",
        issue_text: "b",
        created_by: "c",
      })
      .end(function (err, res) {
        // Update the issue
        id = res.body._id
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/test_project')
          .send({
            _id: id,
          })
          .end(function (err, res) {
            assert.equal(res.body.error, 'no update field(s) sent')
            assert.equal(res.body._id, id)
            done();
          });
      });
  });

  test('put invalid id', function (done) {
    let id = '123'
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/test_project')
      .send({
        _id: id,
        issue_title: "test put invalid id",
      })
      .end(function (err, res) {
        assert.equal(res.body.error, 'could not update')
        assert.equal(res.body._id, id)
        done();
      });
  });

  test('delete', function (done) {
    let id;
    chai
      // Create a new issue
      .request(server)
      .keepOpen()
      .post('/api/issues/test_project')
      .send({
        issue_title: "test delete issue",
        issue_text: "b",
        created_by: "c",
      })
      .end(function (err, res) {
        // Update the issue
        id = res.body._id
        chai
          .request(server)
          .keepOpen()
          .delete('/api/issues/test_project')
          .send({
            _id: id,
          })
          .end(function (err, res) {
            assert.equal(res.body.result, 'successfully deleted')
            assert.equal(res.body._id, id)

            // Get issues, filter for deleted
            chai
              .request(server)
              .keepOpen()
              .get('/api/issues/test_project')
              .query({
                _id: id,
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.length, 0)
                done();
              });
          });
      });
  });

  test('delete missing id', function (done) {
    let id;

    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/test_project')
      .end(function (err, res) {
        assert.equal(res.body.error, 'missing _id')
        done();
      });
  });

  test('delete invalid id', function (done) {
    let id = '123'
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/test_project')
      .send({
        _id: id,
      })
      .end(function (err, res) {
        assert.equal(res.body.error, 'could not delete')
        assert.equal(res.body._id, id)
        done();
      });
  });

});