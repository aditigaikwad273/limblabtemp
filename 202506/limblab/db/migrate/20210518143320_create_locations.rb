class CreateLocations < ActiveRecord::Migration[6.1]
  def up
    create_table :locations do |t|
      t.string :name, null: false
      t.string :address_line1
      t.string :address_line2
      t.string :city
      t.string :state
      t.string :postal
      t.string :phone
      t.string :fax
      t.string :mobile
      t.float :lat
      t.float :lng

      t.timestamps null: false
    end
  end

  def down
    drop_table :locations
  end
end
