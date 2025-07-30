class Device < ApplicationRecord
  belongs_to :clinician, required: false
  belongs_to :client, required: false
  has_many :notifications, dependent: :destroy

  def self.active
    where(active: true)
  end
end
