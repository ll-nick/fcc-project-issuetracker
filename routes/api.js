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
    
    .post(function (req, res){
      let project = req.params.project;
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
