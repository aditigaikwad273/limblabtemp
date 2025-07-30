class CreateMessages < ActiveRecord::Migration[6.1]
  def up
    create_table :messages do |t|
      t.references :conversation, null: false, foreign_key: true
      t.boolean :client, null: false
      t.integer :urgency, null: false, default: 0

      t.timestamps null: false
    end
  end

  def down
    drop_table :messages
  end
end
