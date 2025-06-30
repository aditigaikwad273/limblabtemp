class Location < ApplicationRecord
  validates :name, presence: true
  validates :manager_email, email: true
  
  has_one_attached :hero_image

  def display_name
    self.name
  end

  def manager_email=(value)
    if value.present?
      super(value.to_s.strip.downcase)
    else
      super(nil)
    end
  end
  def self.ransackable_attributes(auth_object = nil)
    ["address_line1", "address_line2", "city", "created_at", "fax", "id", "lat", "lng", "manager_email", "mobile", "name", "phone", "postal", "state", "updated_at"]
  end
end
