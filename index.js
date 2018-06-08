const octokit = require('@octokit/rest')({
  baseUrl: 'https://api.github.ibm.com',
});
const csv = require('csv');
const fs = require('fs');

const OWNER = 'wiot-security';
const REPO = 'saas-issue-tracking';

if (process.argv.length < 4) {
  console.warn('Not enough arguments, dude');
  return;
}

const token = process.argv[2];
const filename = process.argv[3];

octokit.authenticate({
  type: 'oauth',
  token
});

const createIssue = async ({ title, body, label, assignee }) =>
  octokit.issues.create({
    owner: OWNER,
    repo: REPO,
    assignee,
    title,
    body,
    labels: label ? [label] : []
  });

const csvToIssues = csvString => {
  csv.parse(
    csvString,
    {
      columns: true
    },
    (err, data) => {
      data.forEach(createIssue);
    }
  );
};

const contents = fs.readFileSync(filename, {
  encoding: 'utf8'
});

csvToIssues(contents);