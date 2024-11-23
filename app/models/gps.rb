class Gps < ApplicationRecord
    validates:vehicle_identifier, presence: { message: "Campo vehicle_identifier No puede estar en vacío" }    
    validates:latitude, presence: {message:"Debe contener campo latitude"}
    validates:longitude, presence: {message:"Debe contener campo longitude"}
    validates:sent_at, presence: {message:"Debe contener campo set_at del ingreso"}
end
