class AddApiTokenToMessages < ActiveRecord::Migration[6.1]
  def up
    remove_column :messages, :client
    add_column :messages, :api_token, :string, null: false
    add_column :messages, :clinician_id, :bigint

    add_index :messages, :api_token, unique: true
    add_foreign_key :messages, :clinicians
  end

  def down
    remove_column :messages, :api_token
    remove_column :messages, :clinician_id
    add_column :messages, :client, :boolean, null: false
  end
end
