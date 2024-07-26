const {Schema, model, default: mongoose} = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    content: String,
  });

  const Notification = mongoose.model('Notification', NotificationSchema);
  module.exports = Notification
  