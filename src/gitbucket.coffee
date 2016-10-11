# Description:
#   GitBucket notifier
#
# Commands:
#   None

module.exports = (robot) ->

  robot.router.post "/hubot/gitbucket-webhook", (req, res) =>
    if req.body
      payload = JSON.parse req.body.payload

      if payload.comment
        robot.send {room: process.env.BOT_CHANNEL_ID},
          "#{payload.sender.login} #{payload.action} [comment](#{payload.comment.html_url}):\r\n" +
          "> #{payload.comment.body.split(/\n/)[0]}"

      else if payload.pull_request
        robot.send {room: process.env.BOT_CHANNEL_ID},
          "#{payload.sender.login} #{payload.action} [pull request ##{payload.pull_request.number}](#{payload.pull_request.html_url}): " +
          "#{payload.pull_request.title}\r\n" +
          "> #{payload.pull_request.body.split(/\n/)[0]}"

      else if payload.ref
        robot.send {room: process.env.BOT_CHANNEL_ID},
          "#{payload.sender.login} pushed into [#{payload.repository.full_name}](#{payload.repository.html_url})/#{payload.ref}"

    res.end "OK"
