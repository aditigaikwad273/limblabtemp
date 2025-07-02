class CreateRelationships < ActiveRecord::Migration[6.1]
  def up
    create_table :relationships do |t|
      t.references :client, null: false, foreign_key: true
      t.references :clinician, null: false, foreign_key: true
      t.boolean :primary, null: false, default: false
      t.boolean :active, null: false, default: true

      t.timestamps null: false
    end
  end

  def down
    drop_table :relationships
  end
end
