class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :clinician, required: false

  has_one :client, through: :conversation

  def author
    self.clinician? ? self.clinician : self.client
  end
  
  def client?
    !self.clinician?
  end

  def clinician?
    self.clinician_id.present?
  end
end
