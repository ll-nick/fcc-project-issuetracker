'use strict';

const { Issue, saveNewIssue } = require('../db');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async (req, res) => {
      let searchParams = req.query;
      searchParams.project = req.params.project;
      let issues = await Issue.find(searchParams);
      res.json(issues);
    })

    .post(async (req, res) => {
      try {
        let newIssue = await saveNewIssue(
          req.params.project,
          req.body.issue_title,
          req.body.issue_text,
          req.body.created_by,
          req.body.assigned_to,
          req.body.status_text
        );

        let resJson = {
          issue_title: newIssue.issue_title,
          issue_text: newIssue.issue_text,
          created_by: newIssue.created_by,
          assigned_to: newIssue.assigned_to,
          status_text: newIssue.status_text,
          created_on: newIssue.created_on,
          updated_on: newIssue.updated_on,
          open: newIssue.open,
          _id: newIssue._id
        }

        res.json(resJson)

      } catch (err) {
        res.json(JSON.parse(err.message));
      }

    })

    .put(async (req, res) => {
      try {
        let id = req.body._id;
        if (!id) throw new Error(JSON.stringify({ error: 'missing _id' }))

        let update = {};
        Object.keys(req.body).forEach(key => {
          if (req.body[key] !== "" && key !== "_id") update[key] = req.body[key]
        })
        if (Object.keys(update).length === 0) {
          throw new Error(JSON.stringify({
            error: 'no update field(s) sent',
            _id: id
          }))
        }
        update["updated_on"] = new Date().toISOString();

        let issue = await Issue.findOneAndUpdate(
          { project: req.params.project, _id: id },
          update
        );
        if (!issue) throw new Error(JSON.stringify({ error: 'could not update', _id: id }))

        res.json({
          result: 'successfully updated',
          _id: id
        })

      } catch (err) {
        res.json(JSON.parse(err.message));
      }
    })

    .delete(async (req, res) => {
      try {
        let id = req.body._id;
        if (!id) throw new Error(JSON.stringify({ error: 'missing _id' }))

        let issue = await Issue.findOneAndDelete({ _id: id })
        if (!issue) throw new Error(JSON.stringify({ error: 'could not delete', _id: id }))

        res.json({
          result: 'successfully deleted',
          _id: id
        })
      } catch (err) {
        res.json(JSON.parse(err.message));
      }
    });

};
