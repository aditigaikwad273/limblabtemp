class CreatePractices < ActiveRecord::Migration[6.1]
  def up
    create_table :practices do |t|
      t.references :clinician, null: false, foreign_key: true
      t.references :location, null: false, foreign_key: true
      t.boolean :primary, null: false, default: false
      t.boolean :active, null: false, default: true

      t.timestamps null: false
    end
  end

  def down
    drop_table :practices
  end
end
