class CreateConversations < ActiveRecord::Migration[6.1]
  def up
    create_table :conversations do |t|
      t.references :client, null: false, foreign_key: true
      t.references :clinician, null: false, foreign_key: true
      t.boolean :archived, null: false, default: false

      t.timestamps null: false
    end
  end

  def down
    drop_table :conversations
  end
end
