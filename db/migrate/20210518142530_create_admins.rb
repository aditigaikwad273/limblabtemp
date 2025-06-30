class CreateAdmins < ActiveRecord::Migration[6.1]
  def up
    create_table :admins do |t|
      t.string :email, null: false
      t.string :password_digest, limit: 60, null: false
      t.string :first_name
      t.string :last_name
      t.boolean :active, null: false, default: true

      t.string :password_reset_token
      t.datetime :password_reset_requested_at

      t.timestamps null: false
    end

    add_index :admins, :email, unique: true
  end

  def down
    drop_table :admins
  end
end
