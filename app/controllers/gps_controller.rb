#app/controllers/gps_controller.rb
class GpsController < ApplicationController
    def index
        render json: { data: 'hola' }
        GpsJob.perform_async('yu', 'prueba')
    end
    
    def create
        @gps = Gps.new(gps_params)
        if @gps.save
          render json: {message: 'El registro ha sido creado', id: @gps.id,}, status: :created
        else
          render json: {message:@gps.errors, id:2}, status: :unprocessable_entity
        end
    end

    def list
        render json: Gps.all
    end

    private

    def gps_params
      params.require(:gp).permit(:latitude, :longitude, :sent_at, :vehicle_identifier )    
    end

    def findGps
      
    end
end