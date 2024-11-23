class Vehicles < ApplicationRecord
  validates:vehicle_identifier, presence: { message: "Campo vehicle_identifier No puede estar en vacío" },
  uniqueness: { message: "Registro duplicado" }
  validates:color, presence: {message:"Debe ingresar un color"}
  validates:type, presence: {message:"Debe ingresar un tipo"}
  self.inheritance_column = :_type_disabled
end
