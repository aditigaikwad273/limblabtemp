class Notification < ApplicationRecord
  belongs_to :device

  enum :status, {
    pending: 0,
    sent: 1,
    failed: 2
  }
end
