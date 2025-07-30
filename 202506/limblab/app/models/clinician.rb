class Clinician < ApplicationRecord
  include Sessionable
  include Archivable
  
  before_create :generate_code
  
  has_many :relationships, dependent: :destroy
  has_many :clients, through: :relationships
  has_many :practices, dependent: :destroy
  has_many :locations, through: :practices
  has_many :conversations, dependent: :destroy
  has_many :devices, dependent: :destroy

  accepts_nested_attributes_for :relationships, allow_destroy: true
  accepts_nested_attributes_for :practices, allow_destroy: true

  private

  def generate_code
    self.code = SecureRandom.hex(3).upcase
  end

  def self.ransackable_attributes(auth_object = nil)
    ["active", "code", "created_at", "email", "first_name", "id", "last_name", "password_reset_requested_at", "title", "updated_at"]
  end
end
