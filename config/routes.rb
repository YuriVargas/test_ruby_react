require 'sidekiq/web'
require 'sidekiq-scheduler/web'

Rails.application.routes.draw do
  get 'vehicle/index'
  #root "pages#home"


  mount Sidekiq::Web => '/sidekiq'
  #root "components#index"

  get '/show', to: 'show#index'
  post '/api/v1/gps', to: 'gps#create'
  get '/api/v1/search-gps/:vehicle_identifier', to: 'gps#search'
  get '/api/v1/index', to: 'gps#index'  
  get '/api/v1/list', to: 'gps#list'     
  post '/api/v1/vehicle', to: 'vehicle#create'    
  get '/api/v1/vehicle-list', to: 'vehicle#list' 
end
