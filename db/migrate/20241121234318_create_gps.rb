class CreateGps < ActiveRecord::Migration[7.0]
  def change
    create_table :gps do |t|
      t.string :latitude
      t.string :longitude
      t.datetime :sent_at
      t.string :vehicle_identifier

      t.timestamps
    end
  end
end
