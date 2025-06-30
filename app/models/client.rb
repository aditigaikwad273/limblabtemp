class Client < ApplicationRecord
  include Sessionable
  include Archivable
  
  has_many :relationships, dependent: :destroy
  has_many :clinicians, through: :relationships
  has_many :conversations, dependent: :destroy
  has_many :devices, dependent: :destroy

  accepts_nested_attributes_for :relationships, allow_destroy: true

  def self.ransackable_attributes(auth_object = nil)
    ["active", "created_at", "email", "first_name", "id", "last_name", "password_reset_requested_at", "phone", "updated_at"]
  end
end
