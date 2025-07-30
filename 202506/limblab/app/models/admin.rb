class Admin < ApplicationRecord
  include Sessionable
  include Archivable

  def self.ransackable_attributes(auth_object = nil)
    ["active", "created_at", "email", "first_name", "id", "last_name", "password_reset_requested_at", "updated_at"]
  end
end
