class Relationship < ApplicationRecord
  include Archivable
  
  before_create :ensure_first_primary
  after_update :ensure_one_primary
  after_create :register_conversations
  
  belongs_to :client
  belongs_to :clinician

  private

  def ensure_first_primary
    unless self.client.relationships.where(primary: true).exists?
      self.primary = true
    end
  end

  def ensure_one_primary
    if self.saved_change_to_primary? && self.primary?
      self.class.where.not(id: self.id).where(primary: true).update_all(primary: false)
    end
  end

  def register_conversations
    self.client.conversations.each do |conversation|
      ConversationRegisterJob.perform_later(conversation, self)
    end
  end
end
