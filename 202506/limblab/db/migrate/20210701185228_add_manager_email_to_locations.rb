class AddManagerEmailToLocations < ActiveRecord::Migration[6.1]
  def up
    add_column :locations, :manager_email, :string
  end

  def down
    remove_column :locations, :manager_email
  end
end
