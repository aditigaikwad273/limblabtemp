class AddApiTokenToConversations < ActiveRecord::Migration[6.1]
  def up
    remove_column :conversations, :clinician_id
    add_column :conversations, :api_token, :string, null: false

    add_index :conversations, :api_token, unique: true
  end

  def down
    remove_column :conversations, :api_token
    add_column :conversations, :clinician_id, :bigint
    add_foreign_key :conversations, :clinicians
  end
end
