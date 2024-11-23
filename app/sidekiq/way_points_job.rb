class WayPointsJob < ApplicationJob
  queue_as :default
  def perform(gps_params)
    @gps = Gps.new(gps_params)
    if @gps.save
      puts "El registro ha sido creado #{@gps.id}"
    else
      puts "Hubo un error al procesar #{@gps.errors}"
    end
  end
end
