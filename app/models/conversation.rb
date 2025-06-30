class Conversation < ApplicationRecord
  default_scope { where(archived: false) }

  after_create :register_relationships

  belongs_to :client
  has_many :messages, dependent: :destroy  

  def self.archived
    unscoped.where(archived: true)
  end

  private

  def register_relationships
    self.client.relationships.active.each do |relationship|
      ConversationRegisterJob.perform_later(self, relationship)
    end
  end
end
