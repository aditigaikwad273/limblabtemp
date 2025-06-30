class CreateDailyMessageCounters < ActiveRecord::Migration[6.1]
  def change
    create_table :daily_message_counters do |t|
      t.datetime :day
      t.references :clinician, null: false, foreign_key: true
      t.integer :count

      t.timestamps
    end
  end
end
