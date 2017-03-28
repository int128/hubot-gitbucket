/*
 * Description:
 *   GitBucket
 *
 * Commands:
 *   None
 */

const quote = content => content.replace(/^|\r\n|\r|\n/g, '\r\n> ');

const renderAssignee = pull_request =>
  pull_request.assignee
  ? `(assigned to @${pull_request.assignee.login})`
  : '';

const renderOpener = pull_request =>
  pull_request.user
  ? `(opened by @${pull_request.user.login})`
  : '';

const renderPullRequestHeader = pull_request =>
  pull_request
  ? `**[#${pull_request.number}](${pull_request.html_url}) ${pull_request.title}** ${renderOpener(pull_request)} ${renderAssignee(pull_request)}`
  : '';

const renderComment = (comment, issue) => quote(`${renderPullRequestHeader(issue)}\r\n${comment.body}`);

const renderPullRequest = pull_request => quote(`${renderPullRequestHeader(pull_request)}\r\n${pull_request.body}`);


module.exports = function (robot) {

  robot.router.post("/hubot/gitbucket", (req, res) => {
    if (req.body) {
      const send = content => robot.send({room: process.env.BOT_CHANNEL_ID}, content);

      const { sender, action, comment, issue, pull_request, ref, repository } = req.body;

      console.log(`Received webhook from GitBucket ${sender.login}`)

      if (comment) {
        send(`@${sender.login} ${action} [comment](${comment.html_url}):${renderComment(comment, issue)}`);
      } else if (pull_request) {
        send(`@${sender.login} ${action}:${renderPullRequest(pull_request)}`);
      } else if (ref) {
        send(`@${sender.login} pushed ${ref} into ${repository.full_name}: [New Pull Request](${repository.html_url}/compare/master...${ref.replace('refs/heads/', '')})`)
      }
    }

    res.end();
  });

}
