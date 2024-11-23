class VehicleController < ApplicationController
  def index
  end
  def create
    @vehicle = Vehicles.new(vehicle_params)
    if @vehicle.save
      render json: {message: 'El registro ha sido creado', id: @vehicle.id,}, status: :created
    else
      render json: {message:@vehicle.errors, id:2}, status: :unprocessable_entity
    end
end

  def vehicle_params
    params.require(:vehicle).permit(:color, :type, :vehicle_identifier )  
  end

  def list
    render json: Vehicles.all
  end
end
