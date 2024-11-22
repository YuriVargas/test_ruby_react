#app/controllers/vehicle_controller.rb
class VehicleController < ApplicationController
    def index
    end
    
    def create
        @vehicle = Vehicle.new(vehicle_params)
        if @vehicle.save
          render json: {message: 'El registro ha sido creado', id: @vehicle.id,}, status: :created
        else
          render json: {message:@vehicle.errors, id:2}, status: :unprocessable_entity
        end
    end

    def list
        render json: Gps.all
    end

    private

    def vehicle_params
      params.require(:Vehicle).permit(:vehicle_identifier, :color, :type )    
    end

    def findGps
      
    end
end