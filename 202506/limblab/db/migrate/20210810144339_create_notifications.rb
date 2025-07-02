class CreateNotifications < ActiveRecord::Migration[6.1]
  def up
    create_table :notifications do |t|
      t.integer :status, null: false, default: 0
      t.string :body, null: false
      t.json :payload
      t.integer :device_id, null: false
      t.timestamps null: false
    end
    add_foreign_key :notifications, :devices
  end

  def down
    drop_table :notifications
  end
end
