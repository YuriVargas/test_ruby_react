#app/controllers/gps_controller.rb
class GpsController < ApplicationController
    def index
        render json: { data: 'hola' }
        GpsJob.perform_async('yu', 'prueba')
    end
    
    def create
      render json: { message:"El punto de ubicación será registrado en segundo plano.",id: 3}
        WayPointsJob.perform_later(gps_params)
        
        # @gps = Gps.new(gps_params)
        # if @gps.save
        #   render json: {message: 'El registro ha sido creado', id: @gps.id,}, status: :created
        # else
        #   render json: {message:@gps.errors, id:2}, status: :unprocessable_entity
        # end
    end
    
    def createNotAsync  
        @gps = Gps.new(gps_params)
        if @gps.save
          render json: {message: 'El registro ha sido creado', id: @gps.id,}, status: :created
        else
          render json: {message:@gps.errors, id:2}, status: :unprocessable_entity
        end
    end

    def list
      consulta = Gps.select(:vehicle_identifier, 'MAX(sent_at) AS date').group(:vehicle_identifier)
      render json: Gps.all.joins("RIGHT JOIN (#{consulta.to_sql}) sub ON sub.date=gps.sent_at AND sub.vehicle_identifier = gps.vehicle_identifier" )
    end

    def search
      render json: Gps.select("vehicle_identifier, latitude, longitude, sent_at").where("vehicle_identifier": params[:vehicle_identifier]).order('sent_at desc').first
    end

    private

    def gps_params
      params.require(:gp).permit(:latitude, :longitude, :sent_at, :vehicle_identifier )    
    end

end