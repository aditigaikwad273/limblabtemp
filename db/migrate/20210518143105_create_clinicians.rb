class CreateClinicians < ActiveRecord::Migration[6.1]
  def up
    enable_extension :pgcrypto unless extension_enabled?(:pgcrypto)
    
    create_table :clinicians do |t|
      t.string :email, null: false
      t.string :password_digest, limit: 60, null: false
      t.string :first_name
      t.string :last_name
      t.boolean :active, null: false, default: true
      t.uuid :api_token, null: false, default: 'gen_random_uuid()'
      t.string :code, null: false

      t.string :password_reset_token
      t.datetime :password_reset_requested_at
      
      t.timestamps null: false
    end

    add_index :clinicians, :email, unique: true
    add_index :clinicians, :api_token, unique: true
    add_index :clinicians, :code, unique: true
  end

  def down
    drop_table :clinicians
  end
end
