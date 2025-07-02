class AddNotesToRelationships < ActiveRecord::Migration[6.1]
  def up
    add_column :relationships, :notes, :string
  end

  def down
    remove_column :relationships, :notes
  end
end
