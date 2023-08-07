require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("Connected to database");

const issueSchema = new mongoose.Schema({
  project: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: String,
  updated_on: String,
  created_by: { type: String, required: true },
  assigned_to: String,
  open: { type: Boolean, default: true },
  states_text: String
});

const Issue = mongoose.model('Issue', issueSchema);

async function saveNewIssue(project, issueTitle, issueText, createdBy, assignedTo = "", statusText = "") {

  if (!project || !issueTitle || !issueText || !createdBy) throw new Error('required field(s) missing')

  let date = new Date();

  const newIssue = new Issue({
    project: project,
    issue_title: issueTitle,
    issue_text: issueText,
    created_on: date.toISOString(),
    updated_on: date.toISOString(),
    created_by: createdBy,
    assigned_to: assignedTo,
    states_text: statusText
  });
  await newIssue.save();
  return newIssue;

}

module.exports = { Issue, saveNewIssue };