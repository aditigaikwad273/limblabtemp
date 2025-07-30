class CreateDevices < ActiveRecord::Migration[6.1]
  def up
    create_table :devices do |t|
      t.references :client, null: true, foreign_key: true
      t.references :clinician, null: true, foreign_key: true
      t.boolean :active, null: false, default: true
      t.string :platform, null: false
      t.string :token, null: false
      t.string :arn
      t.timestamps null: false
    end
  end

  def down
    drop_table :devices
  end
end
